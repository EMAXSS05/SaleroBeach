const mongoose = require('mongoose');
//tabla de pedidos
const PedidoSchema = new mongoose.Schema({
    mesas: [{ type: String, required: true }],
    camarero: { type: String, required: true }, 
    items: [{
        nombre: String,
        precio: Number,
        cantidad: { type: Number, default: 1 },
        sub: String,
        nota: String, 
        estadoItem: { type: String, default: 'pendiente' },
        hora_inicio_cocina: Date,  
        hora_fin_cocina: Date
    }],
    total: { type: Number, default: 0 },
    estadoGeneral: { type: String, default: 'en_curso' },
    metodoPago: { type: String, enum: ['efectivo', 'tarjeta'], default: null },
    fecha: { type: Date, default: Date.now },
    fecha_apertura: { type: Date, default: Date.now }, 
    fecha_cierre: Date
});

module.exports = mongoose.model('Pedido', PedidoSchema);