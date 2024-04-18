const pool = require('../database'); 

const pedidoCtrl= {}

pedidoCtrl.getPedido = async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM pedido join pago on pedido.id=pago.idpedido; '); // Reemplaza 'tu_tabla' con el nombre de tu tabla
      res.json(result.rows);
    } catch (error) {
      console.error('Error al obtener los pedidos', error);
      res.status(500).send('Error interno del servidor');
    }
  };

  // Agregar un pedido 
  pedidoCtrl.createPedido = async (req, res) => {
    try {
        const { alimentoconsumir, cantidad, precioalimento, bebida, cantidadbebida, preciobebida, tipopago, propina, numeromesa, estatus, total } = req.body;

        if (!alimentoconsumir || !cantidad || !precioalimento || !bebida || !cantidadbebida || !preciobebida || !tipopago || !propina || !numeromesa || !estatus || !total) {
            return res.status(400).send('alimentoconsumir, cantidad, precioalimento, bebida, cantidadbebida, preciobebida, tipopago, propina, numeromesa, estatus y total son campos requeridos.');
        }

        const result = await pool.query(
          'INSERT INTO pedido (alimentoconsumir, cantidad, precioalimento, bebida, cantidadbebida, preciobebida, tipopago, propina, numeromesa, estatus, total) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
          [alimentoconsumir, cantidad, precioalimento, bebida, cantidadbebida, preciobebida, tipopago, propina, numeromesa, estatus, total]
      );

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear pedido', error);
        res.status(500).send('Error interno del servidor');
    }
};

//Editar un platillo 

pedidoCtrl.editPedido = async (req, res) => {
  try {
    const { id } = req.params; // Suponiendo que el ID del platillo está en los parámetros de la solicitud
    const { alimentoconsumir, cantidad, precioalimento, bebida, cantidadbebida, preciobebida, tipopago, propina, numeromesa, estatus, fechapedido, horapedido, total } = req.body;

    // Verifica si el ID y al menos uno de los campos a editar están presentes en la solicitud
    if (!id || (!alimentoconsumir && !cantidad && !precioalimento && !bebida && !cantidadbebida && !preciobebida && !tipopago && !propina && !numeromesa && !estatus && !fechapedido && !horapedido && !total)) {
      return res.status(400).send('ID del platillo y al menos uno de los campos a editar son requeridos.');
    }

    // Construye la parte dinámica de la consulta SQL basada en los campos proporcionados
    const updateFields = [];
    const values = [id];

    if (alimentoconsumir) {
      updateFields.push(`alimentoconsumir = $${values.length + 1}`);
      values.push(alimentoconsumir);
    }

    if (cantidad) {
      updateFields.push(`cantidad = $${values.length + 1}`);
      values.push(cantidad);
    }

    if (precioalimento) {
      updateFields.push(`precioalimento = $${values.length + 1}`);
      values.push(precioalimento);
    }

    if (bebida) {
      updateFields.push(`bebida = $${values.length + 1}`);
      values.push(bebida);
    }
    if (cantidadbebida) {
        updateFields.push(`cantidadbebida= $${values.length + 1}`);
        values.push(cantidadbebida);
    }
    if (preciobebida) {
        updateFields.push(`preciobebida = $${values.length + 1}`);
        values.push(preciobebida);
    }
    if ( tipopago) {
        updateFields.push(` tipopago = $${values.length + 1}`);
        values.push( tipopago);
    }
    if (propina) {
        updateFields.push(`propina = $${values.length + 1}`);
        values.push(propina);
    }
    if (numeromesa) {
        updateFields.push(`numeromesa = $${values.length + 1}`);
        values.push(numeromesa);
    }
    if (estatus) {
        updateFields.push(`estatus = $${values.length + 1}`);
        values.push(estatus);
    }
    if (fechapedido) {
        updateFields.push(`fechapedido = $${values.length + 1}`);
        values.push(fechapedido);
    }
    if (horapedido) {
        updateFields.push(`horapedido = $${values.length + 1}`);
        values.push(horapedido);
    }
    if (total) {
        updateFields.push(`total = $${values.length + 1}`);
        values.push(total);
    }

    // Construye la consulta SQL completa
    const updateQuery = `UPDATE pedido SET ${updateFields.join(', ')} WHERE id = $1 RETURNING *`;

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

pedidoCtrl.deletePedido = async (req, res) => {
    try {
      const { id } = req.params; // Suponiendo que el ID del platillo está en los parámetros de la solicitud
  
      // Verifica si el ID está presente en la solicitud
      if (!id) {
        return res.status(400).send('ID del platillo es requerido.');
      }
  
      // Ejecuta la consulta SQL para eliminar el platillo
      const result = await pool.query('DELETE FROM pedido WHERE id = $1 RETURNING *', [id]);
  
      // Verifica si se encontró un platillo con el ID proporcionado
      if (result.rows.length === 0) {
        return res.status(404).send('Pedido no encontrado.');
      }
  
      // Devuelve el platillo eliminado en la respuesta
      res.json({ message: 'Platillo eliminado correctamente.', deletedPedido: result.rows[0] });
    } catch (error) {
      console.error('Error al eliminar platillo', error);
      res.status(500).send('Error interno del servidor');
    }
  };





  module.exports = pedidoCtrl