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
}

module.exports = userCtrl;
