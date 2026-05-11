require('dotenv').config();
const express = require('express');
const conectarDB = require('./config/db'); 
const cors = require('cors');
const app = express();
const cajaRoutes = require('./routes/caja');


// Llamo a la conexión
conectarDB(); 
app.use(cors({
  origin: ['http://localhost:5173', 'https://salerobeach-1.onrender.com']
}));
app.use(express.json());
const PORT = process.env.PORT || 5000; 

app.get('/', (req, res) => {
    res.send('Servidor del Bar de Carnota funcionando en Docker');
});

//para usar las rutas
app.use('/api/productos', require('./routes/productos'));
app.use('/api/pedidos', require('./routes/pedidos'));
app.use('/api/mesas', require('./routes/mesas'));
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/imgMenu', express.static('uploads/imgMenu'));
app.use('/api/caja', cajaRoutes);

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});