const mongoose = require('mongoose');
const Producto = require('./models/Producto'); 
const Mesa = require('./models/Mesa');
const Usuario = require('./models/Usuario');
const Pedido = require('./models/Pedido');
const MONGO_URI = "mongodb://database:27017/salero_beach";

const cargarDatos = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Conectado a MongoDB para la carga maestra...");

        // Limpiar todo
        await Producto.deleteMany({});
        await Mesa.deleteMany({});
        await Usuario.deleteMany({});

        // Insertar Productos 
        await Producto.insertMany([
            { id: "d1",nombre: "Cerveza Estrella", precio: 2.50, categoria: "Barra", sub: "Drinks", imagen: "ejemplo", disponible: true },
            { id: "f1",nombre: "Pulpo a la Feira", precio: 23.00, categoria: "Cocina", sub: "Food", imagen: "ejemplo", disponible: true },
            { id: "d2",nombre: "Aquarius de Naranja", precio: 2.50, categoria: "Barra", sub: "Drinks", imagen: "ejemplo", disponible: true }
        ]);

        //Insertar Mesas
        const mesas = [
            ...Array.from({ length: 9 }, (_, i) => ({
                numero: (i + 1).toString(),
                zona: 'Terraza',
                activa: true,
                estado: 'Libre'
            })),
            ...Array.from({ length: 3 }, (_, i) => ({
                numero: (i + 10).toString(),
                zona: 'Interior',
                activa: true,
                estado: 'Libre'
            }))
        ];
        await Mesa.insertMany(mesas);

        // Insertar Usuarios
        await Usuario.insertMany([
            { username: 'Emanuel_barra', password: '123', nombreReal: 'Emanuel', rol: 'barra' },
            { username: 'Juancarlos_cam', password: '123', nombreReal: 'Juan Carlos', rol: 'camarero' },
            { username: 'Chef_Salero', password: '123', nombreReal: 'Cocinero', rol: 'cocina' }
        ]);

        await Pedido.insertMany([
            {
                mesa: "4",
                camarero: "Juan Carlos",
                items: [
                    { nombre: "Cerveza Estrella", cantidad: 2, precio: 2.50 },
                    { nombre: "Pulpo a la Feira", precio: 23.00, cantidad: 1 }
                ],
                total: 28.00,
                estadoGeneral: "en_curso"
            },
            {
                mesa: "Terraza 1",
                camarero: "Juan Carlos",
                items: [
                    { nombre: "Aquarius de Naranja", precio: 2.50, cantidad: 1 }
                ],
                total: 2.50,
                estadoGeneral: "en_curso"
            }
        ]);

        console.log("Productos, Mesas,Usuarios y pedidos cargados correctamente.");
        mongoose.connection.close();
    } catch (error) {
        console.error("Error al cargar datos:", error);
    }
};

cargarDatos();