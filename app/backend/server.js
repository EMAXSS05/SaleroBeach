require('dotenv').config();
const express = require('express');
const conectarDB = require('./config/db'); 
const cors = require('cors');
const app = express();

// Llamo a la conexión
conectarDB(); 
app.use(cors());
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

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});