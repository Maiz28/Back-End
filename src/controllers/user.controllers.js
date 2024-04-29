const pool = require("../database"); // Asumiendo que 'pool' es una instancia de Pool de PostgreSQL
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { token } = require("morgan");

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
    role: user.role,
  };
  return jwt.sign(payload, "en lugar de la mancha ");
};

// mmmmmmmmmiiiguueeellll

const crypto = require("crypto");

// Esta función generará un token único para el restablecimiento de contraseña
function generateResetToken() {
  return crypto.randomBytes(20).toString('hex');
}

// Esta función almacenará el token de restablecimiento de contraseña en la base de datos
async function saveResetToken(email, token) {
  const saveTokenQuery = `
    UPDATE users
    SET reset_token = $1,
        reset_token_expiry = NOW() + INTERVAL '1 hour' -- Aquí establecemos el tiempo de expiración del token
    WHERE email = $2;
  `;
  const saveTokenValues = [token, email];
  await pool.query(saveTokenQuery, saveTokenValues);
}

// Esta función será llamada desde user.routes.js para solicitar un restablecimiento de contraseña
userCtrl.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Generar un token de restablecimiento de contraseña
    const resetToken = generateResetToken();

    // Almacenar el token de restablecimiento de contraseña en la base de datos
    await saveResetToken(email, resetToken);

    // Aquí deberías enviar un correo electrónico al usuario con el enlace para restablecer la contraseña, usando el token generado

    res.status(200).json({ message: "Se ha enviado un correo electrónico con instrucciones para restablecer la contraseña" });
  } catch (error) {
    console.error("Error al solicitar restablecimiento de contraseña:", error);
    res.status(500).json({ message: "Ocurrió un error al intentar solicitar el restablecimiento de contraseña" });
  }
};

// Esta función permitirá al usuario restablecer la contraseña utilizando el token proporcionado
userCtrl.resetPassword = async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;
    
    // Verificar si el token de restablecimiento de contraseña es válido
    const checkTokenQuery = `
      SELECT reset_token, reset_token_expiry
      FROM users
      WHERE email = $1;
    `;
    const checkTokenValues = [email];
    const tokenResult = await pool.query(checkTokenQuery, checkTokenValues);

    const userToken = tokenResult.rows[0].reset_token;
    const tokenExpiry = new Date(tokenResult.rows[0].reset_token_expiry);

    if (token !== userToken || tokenExpiry < new Date()) {
      return res.status(400).json({ message: "El token de restablecimiento de contraseña es inválido o ha expirado" });
    }

    // Actualizar la contraseña del usuario en la base de datos
    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    const updatePasswordQuery = `
      UPDATE users
      SET password = $1,
          reset_token = null,
          reset_token_expiry = null
      WHERE email = $2;
    `;
    const updatePasswordValues = [hashedPassword, email];
    await pool.query(updatePasswordQuery, updatePasswordValues);

    res.status(200).json({ message: "La contraseña se ha restablecido exitosamente" });
  } catch (error) {
    console.error("Error al restablecer la contraseña:", error);
    res.status(500).json({ message: "Ocurrió un error al intentar restablecer la contraseña" });
  }
};


module.exports = userCtrl;
