const nodemailer = require ('nodemailer');

// Exporta la función enviarMail para que esté disponible fuera de este archivo
async function enviarMail(correo, datos) {

    
  const config = {
      host : 'smtp.gmail.com',
      port : 587,
      auth : {
          user :'mikeyjaime99@gmail.com',
          pass : 'blyemhetcacieosr'
      }
  }

  const mensaje= {
      from : 'mikeyjaime99@gmail.com',
      to : correo,
      subject : 'Recibo',
      html : 
      `
      <div class="recibo">
  <div class="encabezado">
  <img src="https://userscontent2.emaze.com/images/eb0d2e9e-5ea2-483a-9725-f0d5bb4172db/20d39708287cd512ee6eed32b22c8fbb.png" width="90"
  height="90" alt="Logo de la tienda" class="logo">
    <h1>Recibo de Compra</h1>
    <p>Fecha: 24 de noviembre de 2023</p>
  </div>
  <hr>
  <div class="contenido">
    <p><strong>No. Comanda:</strong> ${datos.idcomanda}</p>
    <p><strong>No.pedido:</strong> ${datos.idpedido}</p>
    <p><strong>Nombre del cliente:</strong> ${datos.nombrecliente}</p> 
    <p><strong>Nombre del mesero:</strong> ${datos.nombremesero}</p>
    <p><strong>Platillo:</strong> ${datos.alimentoconsumir}</p>
    <p><strong>Bebida:</strong> ${datos.bebida}</p>
    <p><strong>Forma de pago:</strong> ${datos.tipopago}</p>
    <p><strong>Propina:</strong> ${datos.propina} %</p>
  </div>
  <hr>
  <div class="total">
    <p><strong>Total a Pagar:</strong> ${datos.total}</p>
  </div>
  <div class="agradecimiento">
    <p>¡Gracias por tu compra!</p>
    <p>Vuelve pronto.</p>
  </div>
</div>

<style>
.recibo {
  width: 300px;
  margin: 20px auto;
  border: 1px solid #ccc;
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.encabezado h1 {
  font-size: 24px;
  margin-bottom: 5px;
}

.encabezado p {
  font-size: 12px;
  color: #666;
}

hr {
  border: 0.5px solid #ccc;
  margin: 10px 0;
}

.contenido p {
  font-size: 14px;
  margin-bottom: 5px;
}

.total p {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
}

.agradecimiento p {
  font-size: 14px;
  margin-bottom: 5px;
  text-align: center;
}

.encabezado {
  text-align: center; /* Centrar el contenido del encabezado */
}

.logo {
  display: block;
  margin: 0 auto; /* Esto centrará el logo horizontalmente */
}

</style>
      `
  }

  const transport = nodemailer.createTransport(config);

  const info = await transport.sendMail(mensaje);

  }

module.exports = {
  enviarMail
}
