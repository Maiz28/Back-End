const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "restaurante",
  password: "linux",
  port: "5432",
});
pool.connect((err, client, done) => {
  if (err) {
    console.error("Error al conectar a la base de datos", err);
  } else {
    console.log("Conexión exitosa a la base de datos");
    // Puedes realizar consultas aquí
    // client.query('SELECT * FROM tu_tabla', (err, result) => {
    //   console.log(result.rows);
    //   done();
    //   pool.end(); // Cierra la conexión después de realizar las consultas necesarias
    // });
  }
});

module.exports = pool;
