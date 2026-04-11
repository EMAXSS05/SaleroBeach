const express = require('express');
const router = express.Router();
const Producto = require('../models/Producto');

// Obtiene todos los productos
router.get('/', async (req, res) => {
    try {
        const productos = await Producto.find();
        res.json(productos);
    } catch (err) {
        res.status(500).json({ mensaje: "Error al obtener productos" });
    }
});

// Crea un producto
router.post('/', async (req, res) => {
    const producto = new Producto(req.body);
    try {
        const nuevoProducto = await producto.save();
        res.status(201).json(nuevoProducto);
    } catch (err) {
        res.status(400).json({ mensaje: "Error al crear el producto", detalle: err.message });
    }
});

//Actualiza un producto
router.patch('/:id', async (req, res) => {
    try {
        const productoActualizado = await Producto.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        );
        res.json(productoActualizado);
    } catch (err) {
        res.status(400).json({ mensaje: "Error al actualizar producto" });
    }
});

//Elimina un producto
router.delete('/:id', async (req, res) => {
    try {
        await Producto.findByIdAndDelete(req.params.id);
        res.json({ mensaje: "Producto eliminado correctamente" });
    } catch (err) {
        res.status(500).json({ mensaje: "Error al eliminar producto" });
    }
});

module.exports = router;