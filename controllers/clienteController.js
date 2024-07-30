const bcrypt = require('bcrypt');
const Client = require('../models/Cliente');

// Crear un nuevo cliente
exports.createClient = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el cliente en la base de datos
    const newClient = await Client.create({
      username,
      password: hashedPassword,
    });

    res.status(201).json(newClient);
  } catch (error) {
    console.error('Error creando cliente:', error);
    res.status(500).json({ error: 'Error creando cliente' });
  }
};

// Autenticar cliente
exports.authenticateClient = async (req, res) => {
  const { username, password } = req.body;

  try {
    const client = await Client.findOne({ where: { username } });

    if (client && await bcrypt.compare(password, client.password)) {
      res.status(200).json({username: client.username, message: 'Autenticación exitosa' });
    } else {
      res.status(401).json({ message: 'Credenciales inválidas' });
    }
  } catch (error) {
    console.error('Error autenticando cliente:', error);
    res.status(500).json({ error: 'Error autenticando cliente' });
  }
};
