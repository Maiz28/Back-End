const pool = require('../database'); 

const pagosctrl= {}

pagosctrl.getPagos = async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM pago'); // Reemplaza 'tu_tabla' con el nombre de tu tabla
      res.json(result.rows);
    } catch (error) {
      console.error('Error al obtener los datos de el pago', error);
      res.status(500).send('Error interno del servidor');
    }
};


  
  module.exports = pagosctrl