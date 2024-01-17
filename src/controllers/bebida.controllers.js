const pool = require('../database'); 

const bebidactrl= {}

bebidactrl.getBebida = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM platillo WHERE categoria = \'Bebida\';');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener la bebida', error);
    res.status(500).send('Error interno del servidor');
  }
};

  
module.exports = bebidactrl