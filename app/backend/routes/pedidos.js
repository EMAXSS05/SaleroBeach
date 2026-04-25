const express = require('express');
const router = express.Router();
const Pedido = require('../models/Pedido');
const Mesa = require('../models/Mesa'); 

// Obtiene todos los pedidos (para barra/cocina e historial)
router.get('/', async (req, res) => {
    try {
        const pedidos = await Pedido.find();
        res.json(pedidos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Crea un nuevo pedido verificando si la mesa está libre u ocupada.
router.post('/', async (req, res) => {
   try {
        const { mesa, items, camarero } = req.body;

        //Buscamos si ya existe un pedido abierto para esa mesa
        let pedidoExistente = await Pedido.findOne({ 
            mesa: mesa, 
            estadoGeneral: { $in: ['pendiente', 'en_curso', 'preparado'] } 
        });

        if (pedidoExistente) {
            items.forEach(nuevoItem => {
                // Buscamos si el producto ya estaba en el pedido
                const itemEnPedido = pedidoExistente.items.find(i => i.nombre === nuevoItem.nombre);
                if (itemEnPedido) {
                    itemEnPedido.cantidad += nuevoItem.cantidad;
                } else {
                    pedidoExistente.items.push(nuevoItem);
                }
            });

            // Recalculamos el total del pedido existente
            pedidoExistente.total = pedidoExistente.items.reduce((acc, item) => {
                return acc + (item.precio * (item.cantidad || 1));
            }, 0);

            const pedidoActualizado = await pedidoExistente.save();
            return res.status(200).json(pedidoActualizado);
        }

        const totalCalculado = items.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
        const nuevoPedido = new Pedido({ ...req.body, total: totalCalculado });
        
        await nuevoPedido.save();
        await Mesa.findOneAndUpdate({ numero: mesa }, { estado: 'ocupada' });

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