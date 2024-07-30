const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/database');
const debtsRouter = require('./routes/debts');
const productosRouter = require('./routes/producto');
const webhookRouter = require('./routes/webhook'); // Importar la nueva ruta del webhook
const clientRouter = require('./routes/cliente'); 

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/productos', productosRouter);

app.use('/api/debts', debtsRouter);

app.use('/api', webhookRouter);

app.use('/api/clients', clientRouter); 

sequelize.sync()
  .then(() => {
    console.log('Base de datos sincronizada');
  })
  .catch(err => {
    console.error('Error al sincronizar la base de datos:', err);
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`El server se encuentra corriendo en el puerto ${PORT}`);
});
