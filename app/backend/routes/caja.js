const express = require('express');
const router = express.Router();
const CajaSession = require('../models/CajaSession');

// GET /api/caja/estado
// Comprueba si hay una caja abierta actualmente
router.get('/estado', async (req, res) => {
    try {
        const sesion = await CajaSession.findOne({ abierta: true }).sort({ fechaApertura: -1 });

        if (!sesion) {
            return res.json({ abierta: false });
        }

        res.json({
            abierta: true,
            sesion: {
                _id: sesion._id,
                fechaApertura: sesion.fechaApertura,
                saldoInicial: sesion.saldoInicial
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al consultar el estado de caja' });
    }
});

// POST /api/caja/abrir
// Abre una nueva sesión de caja con el saldo inicial
// Body: { saldoInicial: Number }
router.post('/abrir', async (req, res) => {
    try {
        const { saldoInicial } = req.body;

        if (saldoInicial === undefined || saldoInicial === null) {
            return res.status(400).json({ error: 'El saldo inicial es obligatorio' });
        }

        // Seguridad: no permitir abrir si ya hay una caja abierta
        const sesionExistente = await CajaSession.findOne({ abierta: true });
        if (sesionExistente) {
            return res.status(400).json({ error: 'Ya hay una caja abierta' });
        }

        const nuevaSesion = new CajaSession({
            saldoInicial,
            fechaApertura: new Date(),
            abierta: true
        });

        await nuevaSesion.save();

        res.status(201).json({
            mensaje: 'Caja abierta correctamente',
            sesion: {
                _id: nuevaSesion._id,
                fechaApertura: nuevaSesion.fechaApertura,
                saldoInicial: nuevaSesion.saldoInicial
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al abrir la caja' });
    }
});

// POST /api/caja/cerrar
// Cierra la sesión de caja activa
router.post('/cerrar', async (req, res) => {
    try {
        const sesion = await CajaSession.findOne({ abierta: true });

        if (!sesion) {
            return res.status(400).json({ error: 'No hay ninguna caja abierta' });
        }

        sesion.abierta = false;
        sesion.fechaCierre = new Date();
        await sesion.save();

        res.json({ mensaje: 'Caja cerrada correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al cerrar la caja' });
    }
});

module.exports = router;