const mongoose = require('mongoose');
//tabla de pedidos
const PedidoSchema = new mongoose.Schema({
    mesa: { type: String, required: true },
    camarero: { type: String, required: true }, 
    items: [{
        nombre: String,
        precio: Number,
        cantidad: { type: Number, default: 1 },
        nota: String, 
        estadoItem: { type: String, default: 'pendiente' } 
    }],
    total: { type: Number, default: 0 },
    estadoGeneral: { type: String, default: 'en_curso' },
    fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Pedido', PedidoSchema);