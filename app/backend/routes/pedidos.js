const express = require('express');
const router = express.Router();
const Pedido = require('../models/Pedido');
const Mesa = require('../models/Mesa'); 

// Obtiene todos los pedidos activos para la Barra/Cocina
router.get('/', async (req, res) => {
    try {
        const pedidos = await Pedido.find({ estadoGeneral: 'en_curso' });
        res.json(pedidos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Crea un nuevo pedido
router.post('/', async (req, res) => {
    //  Calcula el total
    const totalCalculado = req.body.items.reduce((acc, item) => {
        return acc + (item.precio * (item.cantidad || 1));
    }, 0);

    const pedido = new Pedido({
        ...req.body,
        total: totalCalculado
    });

    try {
        //Guardamos el pedido
        const nuevoPedido = await pedido.save();
        // Buscamos la mesa por su número 
        await Mesa.findOneAndUpdate(
            { numero: req.body.mesa },
            { estado: 'ocupada' }
        );

        res.status(201).json(nuevoPedido);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Actualizar pedido (Para el cierre/cobro)
router.patch('/:id', async (req, res) => {
    try {
        const pedidoActualizado = await Pedido.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        );
        
        if (!pedidoActualizado) {
            return res.status(404).json({ message: "Pedido no encontrado" });
        }

        // Si el pedido se marca como 'pagado' o 'finalizado', liberamos la mesa
        if (req.body.estadoGeneral === 'finalizado') {
            await Mesa.findOneAndUpdate(
                { numero: pedidoActualizado.mesa },
                { estado: 'libre' }
            );
        }
        
        res.json(pedidoActualizado);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;