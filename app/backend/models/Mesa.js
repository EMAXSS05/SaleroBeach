const mongoose = require('mongoose');
//tabla mesa
const MesaSchema = new mongoose.Schema({
    numero: { type: String, required: true, unique: true },
    zona: { type: String, required: true },
    activa: { type: Boolean, default: true },
    capacidad:{type:Number},
    estado: { type: String, default: 'libre' },
    alertas: { type: Array, default: [] }
});

module.exports = mongoose.model('Mesa', MesaSchema);