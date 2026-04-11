const express = require('express');
const router = express.Router();
const Mesa = require('../models/Mesa');

// Obtiene todas las mesas
router.get('/', async (req, res) => {
    try {
        const mesas = await Mesa.find();
        res.json(mesas);
    } catch (err) {
        res.status(500).json({ mensaje: "Error al obtener mesas" });
    }
});

//Cambia de estado
router.patch('/:numero/estado', async (req, res) => {
    try {
        const { numero } = req.params;
        const { estado } = req.body;

        const mesa = await Mesa.findOneAndUpdate(
            { numero: numero },
            { estado: estado },
            { new: true }
        );
        res.json(mesa);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar estado de la mesa" });
    }
});

// Activar o desactivar
router.patch('/:numero/activar', async (req, res) => {
    try {
        const { numero } = req.params;
        const { activa } = req.body; 

        const mesa = await Mesa.findOneAndUpdate(
            { numero: numero },
            { activa: activa },
            { new: true }
        );

        res.json({ mensaje: `Mesa ${numero} ${activa ? 'habilitada' : 'deshabilitada'}`, mesa });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar activación de mesa" });
    }
});

module.exports = router;