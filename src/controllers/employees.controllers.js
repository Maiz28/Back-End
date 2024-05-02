const pool = require("../database");

const employeesCtrl = {};

employeesCtrl.getEmployees = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM platillo"); // Reemplaza 'tu_tabla' con el nombre de tu tabla
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener empleados", error);
    res.status(500).send("Error interno del servidor");
  }
};

employeesCtrl.createEmployee = async (req, res) => {
  try {
    const {
      id,
      nombre_del_platillo,
      descripcion_del_platillo,
      precio,
      categoria,
      url
    } = req.body;

    // Verificar la presencia de campos obligatorios
    if (
      !id ||
      !nombre_del_platillo ||
      !descripcion_del_platillo ||
      !precio ||
      !categoria ||
      !url
    ) {
      return res
        .status(400)
        .json({
          error:
            "id, nombre_del_platillo, descripcion_del_platillo, precio y categoria son campos requeridos.",
        });
    }

    // Verificar si el precio es un número positivo
    if (typeof precio !== "number" || precio <= 0) {
      return res
        .status(400)
        .json({ error: "El precio debe ser un número positivo." });
    }

    // Ejecutar la consulta SQL para insertar un nuevo empleado
    const result = await pool.query(
      "INSERT INTO platillo (id, nombre_del_platillo, descripcion_del_platillo, precio, categoria,url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [id, nombre_del_platillo, descripcion_del_platillo, precio, categoria, url]
    );

    // Devolver el nuevo empleado creado en la respuesta
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error al crear platillo:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

employeesCtrl.getEmployee = async (req, res) => {
  try {
    const { id } = req.params; // Suponiendo que el ID del platillo está en los parámetros de la solicitud

    // Verifica si el ID está presente en la solicitud
    if (!id) {
      return res.status(400).send("ID del platillo es requerido.");
    }

    // Ejecuta la consulta SQL para obtener un platillo por su ID
    const result = await pool.query("SELECT * FROM platillo WHERE id = $1", [
      id,
    ]);

    // Verifica si se encontró un platillo con el ID proporcionado
    if (result.rows.length === 0) {
      return res.status(404).send("Platillo no encontrado.");
    }

    // Devuelve el platillo encontrado en la respuesta
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener platillo", error);
    res.status(500).send("Error interno del servidor");
  }
};

employeesCtrl.editEmployee = async (req, res) => {
  try {
    const { id } = req.params; // Suponiendo que el ID del platillo está en los parámetros de la solicitud
    const { nombre_del_platillo, descripcion_del_platillo, precio, categoria } =
      req.body;

    // Verifica si el ID y al menos uno de los campos a editar están presentes en la solicitud
    if (
      !id ||
      (!nombre_del_platillo &&
        !descripcion_del_platillo &&
        !precio &&
        !categoria)
    ) {
      return res
        .status(400)
        .send(
          "ID del platillo y al menos uno de los campos a editar son requeridos."
        );
    }

    // Construye la parte dinámica de la consulta SQL basada en los campos proporcionados
    const updateFields = [];
    const values = [id];

    if (nombre_del_platillo) {
      updateFields.push(`nombre_del_platillo = $${values.length + 1}`);
      values.push(nombre_del_platillo);
    }

    if (descripcion_del_platillo) {
      updateFields.push(`descripcion_del_platillo = $${values.length + 1}`);
      values.push(descripcion_del_platillo);
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
    const updateQuery = `UPDATE platillo SET ${updateFields.join(
      ", "
    )} WHERE id = $1 RETURNING *`;

    // Ejecuta la consulta SQL para editar el platillo
    const result = await pool.query(updateQuery, values);

    // Verifica si se encontró un platillo con el ID proporcionado
    if (result.rows.length === 0) {
      return res.status(404).send("Platillo no encontrado.");
    }

    // Devuelve el platillo editado en la respuesta
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al editar platillo", error);
    res.status(500).send("Error interno del servidor");
  }
};

employeesCtrl.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params; // Suponiendo que el ID del platillo está en los parámetros de la solicitud

    // Verifica si el ID está presente en la solicitud
    if (!id) {
      return res.status(400).send("ID del platillo es requerido.");
    }

    // Ejecuta la consulta SQL para eliminar el platillo
    const result = await pool.query(
      "DELETE FROM platillo WHERE id = $1 RETURNING *",
      [id]
    );

    // Verifica si se encontró un platillo con el ID proporcionado
    if (result.rows.length === 0) {
      return res.status(404).send("Platillo no encontrado.");
    }

    // Devuelve el platillo eliminado en la respuesta
    res.json({
      message: "Platillo eliminado correctamente.",
      deletedPlatillo: result.rows[0],
    });
  } catch (error) {
    console.error("Error al eliminar platillo", error);
    res.status(500).send("Error interno del servidor");
  }
};

module.exports = employeesCtrl;
