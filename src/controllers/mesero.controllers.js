const pool = require('../database'); 

const meseroCtrl= {}

meseroCtrl.getMesero = async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM mesero'); // Reemplaza 'tu_tabla' con el nombre de tu tabla
      res.json(result.rows);
    } catch (error) {
      console.error('Error al obtener los meseros', error);
      res.status(500).send('Error interno del servidor');
    }
  };

  meseroCtrl.createMesero = async (req, res) => {
    try {
        const { id, nombre, email, edad } = req.body;

        // Verificar la presencia de campos obligatorios
        if (!id || !nombre || !email || !edad) {
            return res.status(400).json({ error: 'id, nombre, email y edad son campos requeridos.' });
        }

        // Ejecutar la consulta SQL para insertar un nuevo mesero
        const result = await pool.query(
            'INSERT INTO mesero (id, nombre, email, edad) VALUES ($1, $2, $3, $4) RETURNING *',
            [id, nombre, email, edad]
        );

        // Devolver el nuevo mesero creado en la respuesta
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear mesero:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};


 meseroCtrl.editMesero = async (req, res) => {
  try {
    const { id } = req.params; // Suponiendo que el ID del platillo está en los parámetros de la solicitud
    const { nombre, email, edad  } = req.body;

    // Verifica si el ID y al menos uno de los campos a editar están presentes en la solicitud
    if (!id || (!nombre && !email && !edad)) {
      return res.status(400).send('ID del meseroy al menos uno de los campos a editar son requeridos.');
    }

    // Construye la parte dinámica de la consulta SQL basada en los campos proporcionados
    const updateFields = [];
    const values = [id];

    if (nombre) {
      updateFields.push(`nombre = $${values.length + 1}`);
      values.push(nombre);
    }

    if (email) {
      updateFields.push(`email= $${values.length + 1}`);
      values.push(email);
    }

    if (edad) {
      updateFields.push(`edad = $${values.length + 1}`);
      values.push(edad);
    }

    // Construye la consulta SQL completa
    const updateQuery = `UPDATE mesero SET ${updateFields.join(', ')} WHERE id = $1 RETURNING *`;

    // Ejecuta la consulta SQL para editar el platillo
    const result = await pool.query(updateQuery, values);

    // Verifica si se encontró un platillo con el ID proporcionado
    if (result.rows.length === 0) {
      return res.status(404).send('Mesero no encontrado.');
    }

    // Devuelve el platillo editado en la respuesta
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al editar al mesero', error);
    res.status(500).send('Error interno del servidor');
  }
};

meseroCtrl.deleteMesero = async (req, res) => {
  try {
    const { id } = req.params; // Suponiendo que el ID del platillo está en los parámetros de la solicitud

    // Verifica si el ID está presente en la solicitud
    if (!id) {
      return res.status(400).send('ID del mesero es requerido.');
    }

    // Ejecuta la consulta SQL para eliminar el platillo
    const result = await pool.query('DELETE FROM mesero WHERE id = $1 RETURNING *', [id]);

    // Verifica si se encontró un platillo con el ID proporcionado
    if (result.rows.length === 0) {
      return res.status(404).send('Platillo no encontrado.');
    }

    // Devuelve el platillo eliminado en la respuesta
    res.json({ message: 'Mesero eliminado correctamente.', deletedPlatillo: result.rows[0] });
  } catch (error) {
    console.error('Error al eliminar platillo', error);
    res.status(500).send('Error interno del servidor');
  }
};



  module.exports = meseroCtrl