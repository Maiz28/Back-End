const pool = require("../database");

const reservacionesCtrl = {};

// Obtener todas las reservaciones
reservacionesCtrl.getReservaciones = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM reservaciones");
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener reservaciones:", error);
    res.status(500).send("Error interno del servidor");
  }
};

// Crear una nueva reservación
reservacionesCtrl.createReservacion = async (req, res) => {
    try {
      const {
        fecha_reserva,
        numero_mesa,
        numero_personas,
        descripcion,
        id_usuario
      } = req.body;
  
      // Obtener el ID del usuario que inició sesión
  
      // Verificar la presencia de campos obligatorios
      if (!fecha_reserva || !numero_mesa || !numero_personas) {
        return res.status(400).json({
          error: "fecha_reserva, numero_mesa y numero_personas son campos requeridos."
        });
      }
  
      // Verificar si hay más de 3 reservaciones para la misma fecha
      const countResult = await pool.query(
        "SELECT COUNT(*) FROM reservaciones WHERE fecha_reserva = $1",
        [fecha_reserva]
      );
      const count = parseInt(countResult.rows[0].count, 10);
      if (count >= 3) {
        return res.status(400).json({
          error: "Ya hay 3 reservaciones para esta fecha."
        });
      }
  
      // Ejecutar la consulta SQL para insertar una nueva reservación
      const result = await pool.query(
        "INSERT INTO reservaciones (fecha_reserva, numero_mesa, numero_personas, descripcion, id_usuario) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [fecha_reserva, numero_mesa, numero_personas, descripcion, id_usuario]
      );
  
      // Devolver la nueva reservación creada en la respuesta
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error("Error al crear reservación:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };
  
  


// Obtener una reservación por su ID
reservacionesCtrl.getReservacion = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si el ID está presente en la solicitud
    if (!id) {
      return res.status(400).send("ID de la reservación es requerido.");
    }

    // Ejecutar la consulta SQL para obtener una reservación por su ID
    const result = await pool.query("SELECT * FROM reservaciones WHERE id = $1", [
      id,
    ]);

    // Verificar si se encontró una reservación con el ID proporcionado
    if (result.rows.length === 0) {
      return res.status(404).send("Reservación no encontrada.");
    }

    // Devolver la reservación encontrada en la respuesta
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener reservación", error);
    res.status(500).send("Error interno del servidor");
  }
};

// Actualizar una reservación por su ID
reservacionesCtrl.editReservacion = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      fecha_reserva,
      numero_mesa,
      numero_personas,
      descripcion
    } = req.body;

    // Verificar si el ID está presente en la solicitud
    if (!id) {
      return res.status(400).send("ID de la reservación es requerido.");
    }

    // Construir la parte dinámica de la consulta SQL basada en los campos proporcionados
    const updateFields = [];
    const values = [];

    if (fecha_reserva) {
      updateFields.push(`fecha_reserva = $${values.length + 1}`);
      values.push(fecha_reserva);
    }

    if (numero_mesa) {
      updateFields.push(`numero_mesa = $${values.length + 1}`);
      values.push(numero_mesa);
    }

    if (numero_personas) {
      updateFields.push(`numero_personas = $${values.length + 1}`);
      values.push(numero_personas);
    }

    if (descripcion) {
      updateFields.push(`descripcion_fecha_importante = $${values.length + 1}`);
      values.push(descripcion);
    }

    // Construir la consulta SQL completa
    const updateQuery = `UPDATE reservaciones SET ${updateFields.join(
      ", "
    )} WHERE id = $${values.length + 1} RETURNING *`;

    // Ejecutar la consulta SQL para editar la reservación
    const result = await pool.query(updateQuery, [...values, id]);

    // Verificar si se encontró una reservación con el ID proporcionado
    if (result.rows.length === 0) {
      return res.status(404).send("Reservación no encontrada.");
    }

    // Devolver la reservación editada en la respuesta
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al editar reservación", error);
    res.status(500).send("Error interno del servidor");
  }
};

// Eliminar una reservación por su ID
reservacionesCtrl.deleteReservacion = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si el ID está presente en la solicitud
    if (!id) {
      return res.status(400).send("ID de la reservación es requerido.");
    }

    // Ejecutar la consulta SQL para eliminar la reservación
    const result = await pool.query(
      "DELETE FROM reservaciones WHERE id = $1 RETURNING *",
      [id]
    );

    // Verificar si se encontró una reservación con el ID proporcionado
    if (result.rows.length === 0) {
      return res.status(404).send("Reservación no encontrada.");
    }

    // Devolver la reservación eliminada en la respuesta
    res.json({
      message: "Reservación eliminada correctamente.",
      deletedReservacion: result.rows[0],
    });
  } catch (error) {
    console.error("Error al eliminar reservación", error);
    res.status(500).send("Error interno del servidor");
  }
};

module.exports = reservacionesCtrl;
