const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    nombreReal: String,
    rol: { type: String, enum: ['camarero', 'barra', 'cocina'], default: 'camarero' },
    fechaAlta: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Usuario', UsuarioSchema);