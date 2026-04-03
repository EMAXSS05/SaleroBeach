require('dotenv').config();
const express = require('express');


const app = express();
const PORT = process.env.PORT || 3000;


app.get('/', (req, res) => {
    res.send('Servidor del Bar de Carnota funcionando');
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});