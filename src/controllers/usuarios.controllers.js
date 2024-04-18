const pool = require('../database'); 
const bcrypt = require('bcryptjs');

const usuarioCtrl= {}

usuarioCtrl.getUsuario = async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM usuario'); 
      res.json(result.rows);
    } catch (error) {
      console.error('Error al obtener usuarios', error);
      res.status(500).send('Error interno del servidor');
    }
  };



  // para crear un usuario 
  usuarioCtrl.createUsuario = async (req, res) => {
    try {
      const { nombre, apellido, correo, contrasena } = req.body;
  
      // Verifica si los campos necesarios están presentes en la solicitud
      if (!nombre || !apellido || !correo || !contrasena) {
        return res.status(400).send('Todos los campos son requeridos (nombre, apellido, correo, contrasena).');
      }
  
      // Hashear la contraseña antes de guardarla en la base de datos
      const hashedPassword = await bcrypt.hash(contrasena, 10); // 10 es el costo de hash, puedes ajustarlo según tus necesidades de seguridad
  
      // Ejecuta la consulta SQL para insertar un nuevo usuario con la contraseña hasheada
      const result = await pool.query(
        'INSERT INTO usuario (nombre, apellido, correo, contrasena) VALUES ($1, $2, $3, $4) RETURNING *',
        [nombre, apellido, correo, hashedPassword] // Usamos la contraseña hasheada en lugar de la contraseña original
      );
  
      // Devuelve el nuevo usuario creado en la respuesta
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error al crear usuario:', error.message);
      res.status(500).send('Error al crear usuario');
    }
  };
 



  module.exports= usuarioCtrl