const express = require('express');
const { createClient, authenticateClient  } = require('../controllers/clienteController');

const router = express.Router();

router.post('/register', createClient);

router.post('/login', authenticateClient);

module.exports = router;
