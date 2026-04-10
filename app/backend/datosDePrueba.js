const mongoose = require('mongoose');
const Producto = require('./models/Producto'); 


const MONGO_URI = "mongodb://database:27017/salero_beach";

//Se conecta a mongodb e inserta productos de prueba
const cargarDatos = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Conectado a MongoDB para cargar datos...");

        await Producto.deleteMany({});

        await Producto.insertMany([
            { 
                id:"d1",
                nombre: "Cerveza Estrella", 
                precio: 2.50, 
                categoria: "Barra", 
                sub: "Drinks", 
                imagen: "ejemplo", 
                disponible: true 
            },
            {  id: "f1",
                nombre: "Pulpo a la Feira", 
                precio: 23.00, 
                categoria: "Cocina", 
                sub: "Food", 
                imagen: "ejemplo", 
                disponible: true 
            },
            { id: "d2",
                nombre: "Aquarius de Naranja", 
                precio: 2.50, 
                categoria: "Barra", 
                sub: "Drinks", 
                imagen: "ejemplo", 
                disponible: true 
            }
        ]);

        console.log("Se cargaron los datos correctamente");
        mongoose.connection.close();
    } catch (error) {
        console.error("Error al cargar datos:", error);
    }
};

cargarDatos();