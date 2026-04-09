const mongoose = require('mongoose');

const conectarDB = async () => {
    try {
        const url = process.env.MONGO_URI || 'mongodb://localhost:27017/salero';
        await mongoose.connect(url);
        console.log('MongoDB Conectado');
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = conectarDB;