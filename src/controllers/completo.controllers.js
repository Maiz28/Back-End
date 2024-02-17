const pool = require('../database'); 

const completoctrl= {}

completoctrl.getCompleto = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM pedido INNER JOIN comanda ON pedido.idcomanda = comanda.idcomanda;');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener la bebida', error);
    res.status(500).send('Error interno del servidor');
  }
};

  
module.exports = completoctrl