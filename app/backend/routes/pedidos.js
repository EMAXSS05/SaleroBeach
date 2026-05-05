const express = require('express');
const router = express.Router();
const Pedido = require('../models/Pedido');
const Mesa = require('../models/Mesa');

// GET Pedidos con alertas de mesa
router.get('/', async (req, res) => {
    try {
        const pedidos = await Pedido.find().lean();
        const mesas = await Mesa.find().lean();

        const pedidosConAlertas = pedidos.map(pedido => {
            const alertasDeMesa = (pedido.mesas || [])
                .map(numMesa => mesas.find(m => m.numero === numMesa))
                .filter(Boolean)
                .flatMap(m => m.alertas || []);
            return {
                ...pedido,
                alertas: alertasDeMesa
            };
        });

        res.json(pedidosConAlertas);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener pedidos" });
    }
});

// PATCH para el ítem individual (Tiempos de cocina)
router.patch('/:pedidoId/item/:itemId', async (req, res) => {
    try {
        const { pedidoId, itemId } = req.params;
        const { nuevoEstado } = req.body;
        
        const updateData = { "items.$.estadoItem": nuevoEstado };
        
        if (nuevoEstado === 'en preparación') {
            updateData["items.$.hora_inicio_cocina"] = new Date();
        } 
        else if (nuevoEstado === 'listo') {
            updateData["items.$.hora_fin_cocina"] = new Date();
        }

        const pedido = await Pedido.findOneAndUpdate(
            { _id: pedidoId, "items._id": itemId },
            { $set: updateData },
            { new: true }
        );

        if (!pedido) return res.status(404).json({ message: "Ítem o pedido no encontrado" });
        res.json(pedido);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


// CREAR O ACTUALIZAR PEDIDO
router.post('/', async (req, res) => {
    try {
        const { mesas, items, camarero } = req.body;
        
        // Buscamos si ya hay un pedido abierto para esa mesa
        let pedidoExistente = await Pedido.findOne({ 
            mesas: { $in: mesas },
            estadoGeneral: { $in: ['en_curso', 'preparado'] } 
        });

        if (pedidoExistente) {
            items.forEach(nuevoItem => {
                const itemEnPedido = pedidoExistente.items.find(i => i.nombre === nuevoItem.nombre);
                if (itemEnPedido) {
                    itemEnPedido.cantidad += nuevoItem.cantidad;
                } else {
                    pedidoExistente.items.push(nuevoItem);
                }
            });

           
            pedidoExistente.total = pedidoExistente.items.reduce((acc, item) => {
                return acc + (item.precio * (item.cantidad || 1));
            }, 0);

            const pedidoActualizado = await pedidoExistente.save();
            return res.status(200).json(pedidoActualizado);
        }

        // Si no existe, crear uno nuevo
        const totalCalculado = items.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
        const nuevoPedido = new Pedido({ 
            ...req.body, 
            total: totalCalculado,
            estadoGeneral: 'en_curso' 
        });
        
        await nuevoPedido.save();
        
        // Cambiar estado de la mesa a ocupada
        await Mesa.findOneAndUpdate({ numero: { $in: mesas } }, { estado: 'ocupada' });

        res.status(201).json(nuevoPedido);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const pedidoActualizado = await Pedido.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        );

        if (req.body.estadoGeneral === 'pagado') { 
            console.log("Liberando mesa..."); 
            await Mesa.findOneAndUpdate(
                { numero: { $in: pedidoActualizado.mesas }},
                { estado: 'libre', alertas: "" } 
            );
        }
        
        res.json(pedidoActualizado);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;