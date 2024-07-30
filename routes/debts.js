const express = require('express');
const axios = require('axios');
const router = express.Router();
const { apiUrl, apiKeyPrivate } = require('../config/urls');
const { Debt } = require('../models/Debt');

router.post('/', async (req, res) => {
    const { idDeuda, label, amount, validPeriod } = req.body;
    
    try {
        // Hora DEBE ser en UTC!
        const now = new Date().toISOString();
        const expires = new Date(Date.now() + validPeriod * 24 * 60 * 60 * 1000).toISOString();

        // Crear modelo de la deuda
        const deuda = {
            docId: idDeuda,
            label: label,
            amount: { currency: 'PYG', value: amount },
            validPeriod: {
                start: now,
                end: expires
            }
        };

        console.log("esta es la deuda",deuda);
        
        // Crear JSON para el post
        const postData = JSON.stringify({ debt: deuda });
        
        // Hacer el POST
        const response = await axios.post(apiUrl, postData, {
            headers: {
                /* 'apikey': apiKeyPrivate, */
                'Content-Type': 'application/json',
                'x-if-exists': 'update'
            }
        });
        
        const data = response.data;
        
        const payUrl = data.debt ? data.debt.payUrl : null;

        if (payUrl) {
            res.json({ message: 'Deuda creada exitosamente', url: payUrl });
        } else {
            res.status(400).json({ message: 'No se pudo crear la deuda', details: data.meta });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear la deuda', error: error.message });
    }
});


router.get('/status/:docId', async (req, res) => {
    const docId = req.params.docId;
    try {
        const debt = await Debt.findOne({ where: { docId } });
        if (!debt) {
            return res.status(404).send('Deuda no encontrada');
        }
        res.status(200).json(debt);
    } catch (error) {
        console.error('Error al obtener el estado de la deuda:', error);
        res.status(500).send('Error al obtener el estado de la deuda');
    }
});

module.exports = router;
