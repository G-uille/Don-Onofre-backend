// routes/webhook.js
const express = require('express');
const crypto = require('crypto');
const {Debt} = require('../models/Debt');

const router = express.Router();

const SECRET_KEY = '080157bced87eef2f979a7f8a3b2d8e8';

router.post('/', async (req, res) => {
  const body = req.body;
  const receivedHmac = req.headers['x-adams-notify-hash'];
  const calculatedHmac = crypto.createHash('md5').update('adams' + JSON.stringify(body) + SECRET_KEY).digest('hex');

  if (calculatedHmac !== receivedHmac) {
    return res.status(400).send('Invalid HMAC');
  }

  const { notify, debt } = body;

  if (notify.type === 'debtStatus') {
    console.log('Estado de deuda actualizado:', debt);

    // Actualiza o crea el registro de la deuda en la base de datos
    await Debt.upsert({
      docId: debt.docId,
      objStatus: debt.objStatus.status,
      payStatus: debt.payStatus.status,
      updatedAt: new Date(debt.objStatus.time),
    });

    res.status(200).send('Notificación de estado de deuda procesada');
  } else {
    res.status(200).send('Evento no reconocido');
  }
});

module.exports = router;