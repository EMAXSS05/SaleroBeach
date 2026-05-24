const express = require('express');
const router = express.Router();
const Producto = require('../models/Producto');
const multer = require('multer');
const path = require('path');

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
      try {
        // Genera el id automáticamente si no viene
        if (!req.body.id) {
            const count = await Producto.countDocuments();
            req.body.id = `p${count + 1}`;
        }
        const producto = new Producto(req.body);
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
            { $set: req.body }, 
            { new: true, runValidators: true }
        );
        if (!productoActualizado) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }
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

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/imgMenu/'); // carpeta donde se guardan
    },
    filename: (req, file, cb) => {
        const nombre = Date.now() + path.extname(file.originalname);
        cb(null, nombre);
    }
});

const upload = multer({ storage });

// Ruta para subir imagen
router.post('/upload-imagen', upload.single('imagen'), (req, res) => {
    if (!req.file) return res.status(400).json({ mensaje: "No se subió ningún archivo" });
    res.json({ nombreArchivo: req.file.filename });
});

module.exports = router;