const pool = require('../database'); 

const meseroctrl= {}

meseroctrl.getMesero = async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM mesero'); // Reemplaza 'tu_tabla' con el nombre de tu tabla
      res.json(result.rows);
    } catch (error) {
      console.error('Error al obtener los Meseros', error);
      res.status(500).send('Error interno del servidor');
    }
  };

  
module.exports = meseroctrl