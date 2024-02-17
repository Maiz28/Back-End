const mail = require('./../mailer.service');
const pool = require('../database'); 

const usuariosctrl={}

usuariosctrl.getusuarios = async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM usuario'); // Reemplaza 'tu_tabla' con el nombre de tu tabla
      res.json(result.rows);
    } catch (error) {
      console.error('Error al obtener los usuarios', error);
      res.status(500).send('Error interno del servidor');
    }
  };

  module.exports = usuariosctrl