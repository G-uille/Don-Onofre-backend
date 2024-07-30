const Deuda = require('../models/Deuda');
/* const { generarURLPago } = require('../utils/pago'); // Función para generar URL de pago */

const crearDeuda = async (req, res) => {
    try {
        const { monto, ventaId } = req.body;
        
        // Crear deuda
        const deuda = await Deuda.create({
            monto,
            /* urlPago: generarURLPago(), // Generar la URL de pago única */
            ventaId,
        });

        res.status(201).json(deuda);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear la deuda' });
    }
};

module.exports = { crearDeuda };
