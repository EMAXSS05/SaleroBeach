const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');

//Obtener todos los usuarios
router.get('/', async (req, res) => {
    try {
        const usuarios = await Usuario.find().select('-password'); 
        res.json(usuarios);
    } catch (err) {
        res.status(500).json({ mensaje: "Error al obtener usuarios" });
    }
});

//Crear un nuevo usuario
router.post('/', async (req, res) => {
    const usuario = new Usuario(req.body);
    try {
        const nuevoUsuario = await usuario.save();
        res.status(201).json(nuevoUsuario);
    } catch (err) {
        res.status(400).json({ mensaje: "Error al crear usuario", detalle: err.message });
    }
});

//Actualizar usuario
router.patch('/:id', async (req, res) => {
    try {
        // Si en el body viene una password, se actualizará directamente
        const usuarioActualizado = await Usuario.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).select('-password');

        if (!usuarioActualizado) return res.status(404).json({ mensaje: "Usuario no encontrado" });
        
        res.json({ mensaje: "Usuario actualizado correctamente", usuario: usuarioActualizado });
    } catch (err) {
        res.status(400).json({ mensaje: "Error al actualizar usuario" });
    }
});

// ELlimar usuario
router.delete('/:id', async (req, res) => {
    try {
        const usuarioEliminado = await Usuario.findByIdAndDelete(req.params.id);
        if (!usuarioEliminado) return res.status(404).json({ mensaje: "Usuario no encontrado" });
        
        res.json({ mensaje: "Usuario eliminado del sistema" });
    } catch (err) {
        res.status(500).json({ mensaje: "Error al eliminar usuario" });
    }
});

module.exports = router;