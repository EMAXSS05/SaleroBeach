const mongoose = require('mongoose');
//tabla mesa
const MesaSchema = new mongoose.Schema({
    numero: { type: String, required: true, unique: true },
    zona: { type: String, required: true },
    activa: { type: Boolean, default: true },
    estado: { type: String, default: 'libre' } 
});

module.exports = mongoose.model('Mesa', MesaSchema);