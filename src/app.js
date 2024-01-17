const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.set('port', process.env.PORT || 4000);

app.use(cors())
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false}));

app.use("/api/employees", require('./routes/employes.routes'))

app.use("/api/comandas", require('./routes/comandas.routes'))

app.use("/api/pedidos", require('./routes/pedidos.routes'))

app.use("/api/meseros", require('./routes/mesero.routes'))

app.use("/api/ultima", require('./routes/ultima.routes'))

app.use("/api/platillos", require('./routes/platillo.routes'))
app.use("/api/bebidas", require('./routes/bebidas.routes'))
app.use("/api/completo", require('./routes/completo.routes'))
app.use("/api/pagos", require('./routes/pagos.routes'))

module.exports = app;
