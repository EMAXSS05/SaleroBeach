const mongoose = require('mongoose');
//tabla prroducto
const ProductoSchema = new mongoose.Schema({
    id: { type: String, required: true },
    nombre: { type: String, required: true },
    precio: { type: Number, required: true },
    categoria: { type: String, required: true },
    sub: { type: String },        
    imagen:String,
    disponible: { type: Boolean, default: true }
});

module.exports = mongoose.model('Producto', ProductoSchema);