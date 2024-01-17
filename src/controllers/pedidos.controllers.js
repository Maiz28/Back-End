const mail = require('./../mailer.service');
const pool = require('../database'); 

const pedidosctrl= {}

pedidosctrl.getPedidos = async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM pedido'); // Reemplaza 'tu_tabla' con el nombre de tu tabla
      res.json(result.rows);
    } catch (error) {
      console.error('Error al obtener los pedidos', error);
      res.status(500).send('Error interno del servidor');
    }
  };



  pedidosctrl.createPedido = async (req, res) => {
    try {
      const { idComanda, nombrecliente, alimentoconsumir, cantidad, bebida, cantidadbebida, status, tipopago, propina, correo} = req.body;
      console.log(req.body);  
      // Verifica si los campos necesarios están presentes en la solicitud
      if (!idComanda || !nombrecliente || !alimentoconsumir || !cantidad || !bebida || !cantidadbebida || !status || !tipopago || !propina || !correo) {
        return res.status(400).json({ error: 'Todos los campos son requeridos para crear un pedido.' });
      }
  
      // Ejecuta la consulta SQL para insertar un nuevo pedido
      const result = await pool.query(
        'INSERT INTO pedido (idcomanda, nombrecliente, alimentoconsumir, cantidad, bebida, cantidadbebida, status, tipopago, propina, correo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
        [idComanda, nombrecliente, alimentoconsumir, cantidad, bebida, cantidadbebida, status, tipopago, propina, correo]
      );
  
      // Devuelve el nuevo pedido creado en la respuesta
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error al crear pedido', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };

  pedidosctrl.getPedido = async (req, res) => {
    try {
      const { idcomanda } = req.params;
  
      if (!idcomanda) {
        return res.status(400).json({ error: 'ID de la comanda es requerido.' });
      }
  
      const result = await pool.query('SELECT * FROM pedido WHERE idcomanda = $1', [idcomanda]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'No se encontraron pedidos para la comanda especificada.' });
      }
  
      res.json(result.rows);
    } catch (error) {
      console.error('Error al obtener pedidos de la comanda', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };

  pedidosctrl.editPedido = async (req, res) => {
    try {
      const { idpedido } = req.params;
      const { idcomanda, nombrecliente, alimentoconsumir, cantidad, bebida, cantidadbebida, status, correo } = req.body;
      const datos = await req.body;
  
      // Verifica si el ID y al menos uno de los campos a editar están presentes en la solicitud
      if (!idpedido || (!idcomanda && !nombrecliente && !alimentoconsumir && !cantidad && !bebida && !cantidadbebida && !status)) {
        return res.status(400).json({ error: 'ID del pedido y al menos uno de los campos a editar son requeridos.' });
      }
  
      // Construye la parte dinámica de la consulta SQL basada en los campos proporcionados
      const updateFields = [];
      const values = [idpedido];
  
      if (idcomanda) {
        updateFields.push(`idcomanda = $${values.length + 1}`);
        values.push(idcomanda);
      }
  
      if (nombrecliente) {
        updateFields.push(`nombrecliente = $${values.length + 1}`);
        values.push(nombrecliente);
      }
  
      if (alimentoconsumir) {
        updateFields.push(`alimentoconsumir = $${values.length + 1}`);
        values.push(alimentoconsumir);
      }
  
      if (cantidad) {
        updateFields.push(`cantidad = $${values.length + 1}`);
        values.push(cantidad);
      }
  
      if (bebida) {
        updateFields.push(`bebida = $${values.length + 1}`);
        values.push(bebida);
      }
  
      if (cantidadbebida) {
        updateFields.push(`cantidadbebida = $${values.length + 1}`);
        values.push(cantidadbebida);
      }
      if (status) {
        updateFields.push(`status = $${values.length + 1}`);
        values.push(status);
        if(status === 'Pagado'){
          
          const pedidoCliente = await pool.query('SELECT * FROM pedido INNER JOIN comanda ON pedido.idcomanda = comanda.idcomanda WHERE idpedido = $1', [datos.idpedido]); 
          if(pedidoCliente.rows[0]){
            mail.enviarMail(correo, pedidoCliente.rows[0]).then(()=>{
              console.log('Correo enviado')
            });
          }
        }
      }
  
      // Construye la consulta SQL completa
      const updateQuery = `UPDATE pedido SET ${updateFields.join(', ')} WHERE idpedido = $1 RETURNING *`;
  
      // Ejecuta la consulta SQL para editar el pedido
      const result = await pool.query(updateQuery, values);
  
      // Verifica si se encontró un pedido con el ID proporcionado
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Pedido no encontrado.' });
      }
  
      // Devuelve el pedido editado en la respuesta
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error al editar pedido', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };

  pedidosctrl.deletePedido = async (req, res) => {
    try {
      const { idpedido } = req.params;
  
      // Verifica si el ID está presente en la solicitud
      if (!idpedido) {
        return res.status(400).json({ error: 'ID del pedido es requerido.' });
      }
  
      // Ejecuta la consulta SQL para eliminar el pedido
      const result = await pool.query('DELETE FROM pedido WHERE idpedido = $1 RETURNING *', [idpedido]);
  
      // Verifica si se encontró un pedido con el ID proporcionado
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Pedido no encontrado.' });
      }
  
      // Devuelve el pedido eliminado en la respuesta
      res.json({ message: 'Pedido eliminado correctamente.', deletedPedido: result.rows[0] });
    } catch (error) {
      console.error('Error al eliminar pedido', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };




  module.exports = pedidosctrl