const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

app.set("port", process.env.PORT || 3000);

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/employees", require("./routes/employes.routes"));
app.use("/api/usuario", require("./routes/usuarios.routes"));
app.use("/api/pedido", require("./routes/pedido.routes"));
app.use("/api/mesero", require("./routes/mesero.routes"));
app.use("/api/bebida", require("./routes/bebida.routes"));
app.use("/api/user", require("./routes/user.routes"));
app.use("/api/reservacion", require("./routes/reservacion.routes"));

module.exports = app;
