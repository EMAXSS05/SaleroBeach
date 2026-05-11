const mongoose = require('mongoose');
 
const CajaSessionSchema = new mongoose.Schema({
    fechaApertura: {
        type: Date,
        default: Date.now
    },
    saldoInicial: {
        type: Number,
        required: true
    },
    fechaCierre: {
        type: Date,
        default: null
    },
    abierta: {
        type: Boolean,
        default: true
    }
});
 
module.exports = mongoose.model('CajaSession', CajaSessionSchema);