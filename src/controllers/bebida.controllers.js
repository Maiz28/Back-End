const pool = require('../database'); 


const bebidaCtrl={}

bebidaCtrl.getBebida = async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM bebida'); // Reemplaza 'tu_tabla' con el nombre de tu tabla
      res.json(result.rows);
    } catch (error) {
      console.error('Error al obtener las bebidas', error);
      res.status(500).send('Error interno del servidor');
    }
  };

  bebidaCtrl.createBebida = async (req, res) => {
    try {
        const { id, nombre_de_la_bebida, descripcion_de_bebida, precio, categoria } = req.body;

        // Verificar la presencia de campos obligatorios
        if (!id || !nombre_de_la_bebida || !descripcion_de_bebida|| !precio || !categoria) {
            return res.status(400).json({ error: 'id,  nombre_de_la_bebida, descripcion_de_bebida, precio y categoria son campos requeridos.' });
        }

        // Verificar si el precio es un número positivo
        if (typeof precio !== 'number' || precio <= 0) {
            return res.status(400).json({ error: 'El precio debe ser un número positivo.' });
        }

        // Ejecutar la consulta SQL para insertar un nuevo empleado
        const result = await pool.query(
            'INSERT INTO bebida (id,  nombre_de_la_bebida, descripcion_de_bebida, precio, categoria) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [id,  nombre_de_la_bebida, descripcion_de_bebida, precio, categoria]
        );

        // Devolver el nuevo empleado creado en la respuesta
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear la bebida:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};


  bebidaCtrl.editBebida = async (req, res) => {
    try {
      const { id } = req.params; // Suponiendo que el ID del platillo está en los parámetros de la solicitud
      const { nombre_de_la_bebida, descripcion_de_bebida, precio, categoria } = req.body;
  
      // Verifica si el ID y al menos uno de los campos a editar están presentes en la solicitud
      if (!id || (!nombre_de_la_bebida && !descripcion_de_bebida && !precio && !categoria)) {
        return res.status(400).send('ID del la bebida y al menos uno de los campos a editar son requeridos.');
      }
  
      // Construye la parte dinámica de la consulta SQL basada en los campos proporcionados
      const updateFields = [];
      const values = [id];
  
      if (nombre_de_la_bebida) {
        updateFields.push(`nombre_de_la_bebida = $${values.length + 1}`);
        values.push(nombre_de_la_bebida);
      }
  
      if (descripcion_de_bebida) {
        updateFields.push(`descripcion_de_bebida = $${values.length + 1}`);
        values.push(descripcion_de_bebida);
      }
  
      if (precio) {
        updateFields.push(`precio = $${values.length + 1}`);
        values.push(precio);
      }
  
      if (categoria) {
        updateFields.push(`categoria = $${values.length + 1}`);
        values.push(categoria);
      }
  
      // Construye la consulta SQL completa
      const updateQuery = `UPDATE bebida SET ${updateFields.join(', ')} WHERE id = $1 RETURNING *`;
  
      // Ejecuta la consulta SQL para editar el platillo
      const result = await pool.query(updateQuery, values);
  
      // Verifica si se encontró un platillo con el ID proporcionado
      if (result.rows.length === 0) {
        return res.status(404).send('Platillo no encontrado.');
      }
  
      // Devuelve el platillo editado en la respuesta
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error al editar platillo', error);
      res.status(500).send('Error interno del servidor');
    }
  };

  
    bebidaCtrl.deleteBebida= async (req, res) => {
    try {
      const { id } = req.params; // Suponiendo que el ID del platillo está en los parámetros de la solicitud
  
      // Verifica si el ID está presente en la solicitud
      if (!id) {
        return res.status(400).send('ID de la bebida es requerido.');
      }
  
      // Ejecuta la consulta SQL para eliminar el platillo
      const result = await pool.query('DELETE FROM bebida WHERE id = $1 RETURNING *', [id]);
  
      // Verifica si se encontró un platillo con el ID proporcionado
      if (result.rows.length === 0) {
        return res.status(404).send('Bebida no encontrado.');
      }
  
      // Devuelve el platillo eliminado en la respuesta
      res.json({ message: 'Bebida  eliminada correctamente.', deletedPlatillo: result.rows[0] });
    } catch (error) {
      console.error('Error al eliminar la bebida', error);
      res.status(500).send('Error interno del servidor');
    }
  };


module.exports = bebidaCtrl