const pool = require('../database'); 

const ultimactrl= {}

ultimactrl.getUltima = async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM comanda ORDER BY idcomanda DESC LIMIT 1;'); // Reemplaza 'tu_tabla' con el nombre de tu tabla
      res.json(result.rows);
    } catch (error) {
      console.error('Error al obtener la comanda', error);
      res.status(500).send('Error interno del servidor');
    }
  };

  
module.exports = ultimactrl