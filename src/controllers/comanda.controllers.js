const pool = require('../database'); 

const comandactrl= {}

comandactrl.getComandas = async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM comanda '); // Reemplaza 'tu_tabla' con el nombre de tu tabla
      res.json(result.rows);
    } catch (error) {
      console.error('Error al obtener comanda', error);
      res.status(500).send('Error interno del servidor');
    }
  };

  comandactrl.createComanda = async (req, res) => {
    try {
      const { numeromesa, nombremesero } = req.body; // Asegúrate de tener los campos correctos
  
      // Verifica si los campos necesarios están presentes en la solicitud
      if (!numeromesa || !nombremesero) {
        return res.status(400).send('numeromesa y nombremesero son campos requeridos.');
      }
  
      // Ejecuta la consulta SQL para insertar un nuevo empleado
      const result = await pool.query(
        'INSERT INTO comanda (numeromesa, nombremesero) VALUES ($1, $2) RETURNING *',
        [numeromesa, nombremesero]
      );
  
      // Devuelve el nuevo empleado creado en la respuesta
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error al crear comanda', error);
      res.status(500).send('Error interno del servidor');
    }
  };

  comandactrl.getComanda = async (req, res) => {
    try {
        const { idcomanda } = req.params;

        if (!idcomanda) {
            return res.status(400).send('ID de la comanda es requerido.');
        }

        const result = await pool.query('SELECT * FROM comanda WHERE idcomanda = $1', [idcomanda]);

        if (result.rows.length === 0) {
            return res.status(404).send('Comanda no encontrada.');
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener comanda', error);
        res.status(500).send('Error interno del servidor');
    }
};

comandactrl.editComanda = async (req, res) => {
    try {
      const { idcomanda } = req.params;
      const { numeromesa, nombremesero } = req.body;
  
      // Verifica si el ID y al menos uno de los campos a editar están presentes en la solicitud
      if (!idcomanda || (!numeromesa && !nombremesero)) {
        return res.status(400).json({ error: 'ID de la comanda y al menos uno de los campos a editar son requeridos.' });
      }
  
      // Construye la parte dinámica de la consulta SQL basada en los campos proporcionados
      const updateFields = [];
      const values = [idcomanda];
  
      if (numeromesa) {
        updateFields.push(`numeromesa = $${values.length + 1}`);
        values.push(numeromesa);
      }
  
      if (nombremesero) {
        updateFields.push(`nombremesero = $${values.length + 1}`);
        values.push(nombremesero);
      }
  
      // Construye la consulta SQL completa
      const updateQuery = `UPDATE comanda SET ${updateFields.join(', ')} WHERE idcomanda = $1 RETURNING *`;
  
      // Ejecuta la consulta SQL para editar la comanda
      const result = await pool.query(updateQuery, values);
  
      // Verifica si se encontró una comanda con el ID proporcionado
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Comanda no encontrada.' });
      }
  
      // Devuelve la comanda editada en la respuesta
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error al editar comanda', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };

  comandactrl.deleteComanda = async (req, res) => {
    try {
      const { idcomanda } = req.params;
  
      // Verifica si el ID está presente en la solicitud
      if (!idcomanda) {
        return res.status(400).json({ error: 'ID de la comanda es requerido.' });
      }
  
      // Ejecuta la consulta SQL para eliminar la comanda
      const result = await pool.query('DELETE FROM comanda WHERE idcomanda = $1 RETURNING *', [idcomanda]);
  
      // Verifica si se encontró una comanda con el ID proporcionado
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Comanda no encontrada.' });
      }
  
      // Devuelve la comanda eliminada en la respuesta
      res.json({ message: 'Comanda eliminada correctamente.', deletedComanda: result.rows[0] });
    } catch (error) {
      console.error('Error al eliminar comanda', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };




  module.exports = comandactrl