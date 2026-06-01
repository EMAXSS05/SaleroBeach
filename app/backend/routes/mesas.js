const express = require('express');
const router = express.Router();
const Mesa = require('../models/Mesa');

// Obtiene todas las mesas
router.get('/', async (req, res) => {
    try {
        const mesas = await Mesa.find().sort({ numero: 1 });
        res.json(mesas);
    } catch (err) {
        res.status(500).json({ mensaje: "Error al obtener mesas" });
    }
});

//Crea una nueva mesa
router.post('/', async (req, res) => {
    const mesa = new Mesa({
        numero: req.body.numero,
        zona: req.body.zona,
        capacidad: req.body.capacidad || 4,
        activa: req.body.activa ?? true,
        estado: 'libre',
        alertas:[] 
    });

    try {
        const nuevaMesa = await mesa.save();
        res.status(201).json(nuevaMesa);
    } catch (err) {
        res.status(400).json({ message: "Error al crear la mesa" });
    }
});

//Cambia de estado de la mesa libre a ocupado 
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

// Cambiar el estado 'activa' 
router.patch('/:id/toggle', async (req, res) => {
    try {
        const mesa = await Mesa.findById(req.params.id);
        if (!mesa) return res.status(404).json({ message: "No existe la mesa" });

        mesa.activa = !mesa.activa;
        await mesa.save();
        res.json(mesa);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Ruta corregida para activar/desactivar mesa
router.patch('/:id/activa', async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Buscamos la mesa por ID
        const mesa = await Mesa.findById(id);
        
        if (!mesa) {
            return res.status(404).json({ mensaje: "Mesa no encontrada" });
        }

        // 2. Cambiamos el estado al opuesto del que tenga (Toggle)
        mesa.activa = !mesa.activa;
        
        // 3. Guardamos los cambios
        await mesa.save();

        res.json({ 
            mensaje: `Mesa ${mesa.numero} ${mesa.activa ? 'habilitada' : 'deshabilitada'}`, 
            mesa 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al actualizar activación de mesa" });
    }
});
//Elimina una mesa
router.delete('/:id', async (req, res) => {
    try {
        const mesa = await Mesa.findById(req.params.id);
        
        if (!mesa) {
            return res.status(404).json({ message: "Mesa no encontrada" });
        }

        if (mesa.estado === 'ocupada') {
            return res.status(400).json({ 
                message: "No puedes eliminar una mesa que está ocupada actualmente." 
            });
        }

        await Mesa.findByIdAndDelete(req.params.id);
        res.json({ message: "Mesa eliminada con éxito" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// Ruta para añadir una alerta
router.patch('/:numero/alerta', async (req, res) => {
    try {
        const { numero } = req.params;
        const { nuevaAlerta } = req.body;
        const nuevoContenidoAlertas = nuevaAlerta && nuevaAlerta.trim() !== "" ? [nuevaAlerta] : [];

        const mesaActualizada = await Mesa.findOneAndUpdate(
            
            { numero: numero }, 
            { $set: { alertas: nuevoContenidoAlertas } }, 
            { new: true }
        );

        if (!mesaActualizada) {
            return res.status(404).json({ mensaje: "Mesa no encontrada" });
        }

        res.json(mesaActualizada);
    } catch (error) {
        console.error("Error en el servidor:", error); 
        res.status(500).json({ mensaje: "Error interno al guardar la alerta" });
    }
});

// Limpiar alertas (útil cuando la mesa se libera y se paga)
router.patch('/:numero/limpiar-alertas', async (req, res) => {
    try {
        const { numero } = req.params;
        const mesa = await Mesa.findOneAndUpdate(
            { numero: numero },
            { $set: { alertas: [] } }, // Vacía el array
            { new: true }
        );
        res.json(mesa);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al limpiar alertas" });
    }
});

module.exports = router;