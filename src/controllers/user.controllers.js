const pool = require('../database'); // Asumiendo que 'pool' es una instancia de Pool de PostgreSQL

const userCtrl = {};

userCtrl.createUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body; // Asumiendo que los datos del usuario están en el cuerpo de la solicitud

        // Aquí puedes realizar validaciones de los datos recibidos

        // Crear un nuevo usuario en la base de datos
        const newUserQuery = `
            INSERT INTO users (username, email, password, role)
            VALUES ($1, $2, $3, $4)
            RETURNING *;`;

        const newUserValues = [username, email, password, role];

        const result = await pool.query(newUserQuery, newUserValues);

        res.status(201).json({ message: 'Usuario creado exitosamente', user: result.rows[0] });
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).json({ message: 'Ocurrió un error al intentar crear el usuario' });
    }
};

module.exports = userCtrl;
