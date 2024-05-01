const pool = require("../database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const speakeasy = require("speakeasy");
const mailService = require("../mailer.service");
const userCtrl = {};

userCtrl.createUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body; // Asumiendo que los datos del usuario están en el cuerpo de la solicitud

    // Hash de la contraseña
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Crear un nuevo usuario en la base de datos
    const newUserQuery = `
            INSERT INTO users (username, email, password, role)
            VALUES ($1, $2, $3, $4)
            RETURNING *;`;

    const newUserValues = [username, email, hashedPassword, role];

    const result = await pool.query(newUserQuery, newUserValues);

    res.status(201).json({ message: "Registro exitoso", user: result.rows[0] });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res
      .status(500)
      .json({ message: "Ocurrió un error al intentar crear el usuario" });
  }
};

userCtrl.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar si el nombre de usuario o correo electrónico está presente en la solicitud
    if (!email || !password) {
      return res.status(400).json({
        message:
          "Nombre de usuario/correo electrónico y contraseña son obligatorios",
      });
    }

    // Buscar el usuario en la base de datos por nombre de usuario o correo electrónico
    const userQuery = `
            SELECT * FROM users WHERE email = $1 OR email = $1;
        `;
    const userValues = [email];
    const userResult = await pool.query(userQuery, userValues);

    // Verificar si se encontró el usuario
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const user = userResult.rows[0];

    // Verificar si la contraseña coincide
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "La contraseña es incorrecta" });
    }

    // En este punto, el usuario ha proporcionado credenciales válidas
    res.status(200).json({
      message: "Inicio de sesión exitoso",
      token: createToken(user),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res
      .status(500)
      .json({ message: "Ocurrió un error al intentar iniciar sesión" });
  }
};

function createToken(user) {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
  };
  return jwt.sign(payload, process.env.SECRETJWT, { expiresIn: 60 });
}

userCtrl.resetPassword = async (req, res) => {
  const secret = speakeasy.generateSecret({ length: 20 });
  const { correo } = req.body;

  const respDb = await pool.query("SELECT email FROM users WHERE email = $1", [
    correo,
  ]);

  if (respDb.rows.length > 0) {
    if (respDb.rows[0].email === correo) {
      const code = speakeasy.totp({
        secret: secret.base32,
        encoding: "base32",
        time: 120,
      });

      mailService
        .sendCode(correo, code)
        .then(() => {
          res
            .status(200)
            .json(
              generarRespuesta(
                0,
                "Se envió correctamente el código a tu correo.",
                secret.base32,
                null
              )
            );
        })
        .catch((error) => {
          console.log("Ocurrió un error en el sistema.", error);
          res
            .status(200)
            .json(
              generarRespuesta(
                1,
                "Ocurrio un error al enviar el código.",
                null,
                null
              )
            );
        });
    } else {
      res
        .status(200)
        .json(
          generarRespuesta(
            1,
            "El correo electronico no está registrado, verificalo y vuelve a intentarlo.",
            correo,
            null
          )
        );
    }
  } else {
    res
      .status(200)
      .json(
        generarRespuesta(
          1,
          "El correo electronico no está registrado, verificalo y vuelve a intentarlo.",
          correo,
          null
        )
      );
  }
};

userCtrl.updatePassword = async (req, res) => {
  const { correo, password } = req.body;

  const user = await pool.query("SELECT password FROM users WHERE email = $1", [
    correo,
  ]);

  const isEquals = await bcrypt.compare(password, user.rows[0].password);

  if (isEquals) {
    res
      .status(500)
      .json(
        generarRespuesta(
          1,
          "La nueva contraseña no puede ser igual a la anterior.",
          null,
          null
        )
      );
  } else {
    const resp = await pool.query(
      "UPDATE users SET password = $1 WHERE email = $2",
      [bcrypt.hashSync(password, 10), correo]
    );

    if (resp) {
      res
        .status(200)
        .json(
          generarRespuesta(
            0,
            "Se reestablecio correctamente la contraseña",
            null,
            null
          )
        );
    } else {
      res
        .status(500)
        .json(
          generarRespuesta(
            1,
            "Ocurrió un error al actualizar la contraseña.",
            null,
            null
          )
        );
    }
  }
};

userCtrl.validCode = (req, res) => {
  const { codigo, secret } = req.body;

  const tokenValidates = speakeasy.totp.verify({
    secret: secret,
    token: codigo,
    encoding: "base32",
    window: 6,
    time: 120,
  });

  if (tokenValidates) {
    res
      .status(200)
      .json(generarRespuesta(0, "Código validado correctamente.", null, null));
  } else {
    res.status(500).json(generarRespuesta(1, "Código invalido.", null, null));
  }
};

userCtrl.secondFactor = (req, res) => {
  const secret = speakeasy.generateSecret({ length: 20 });
  const { correo } = req.body;
  const code = speakeasy.totp({
    secret: secret.base32,
    encoding: "base32",
    time: 120,
  });

  mailService
    .secondFactor(correo, code)
    .then(() => {
      res
        .status(200)
        .json(
          generarRespuesta(
            0,
            "Se envió correctamente un código a tu correo.",
            secret.base32,
            null
          )
        );
    })
    .catch((error) => {
      console.log("Ocurrió un error en el sistema.", error);
      res
        .status(200)
        .json(
          generarRespuesta(
            1,
            "Ocurrio un error al enviar el código.",
            null,
            null
          )
        );
    });
};

function generarRespuesta(estado, mensaje, objeto, token) {
  return {
    estado: estado,
    mensaje: mensaje,
    objeto: objeto,
    token: token,
  };
}

module.exports = userCtrl;
