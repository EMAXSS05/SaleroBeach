import React, { useState, useEffect } from 'react';
import styles from './CartaProductos.module.css';
import DetalleProducto from './DetalleProductos';

const CartaProductos = ({ mesa, alFinalizarPedido, pasoInterior }) => {
    const [productos, setProductos] = useState([]);
    const [filtro, setFiltro] = useState('');
    const [cargando, setCargando] = useState(true);
    const [productoEdicion, setProductoEdicion] = useState(null);

    useEffect(() => {
        const obtenerProductos = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/productos`);
                const datos = await res.json();
                setProductos(datos);
            } catch (error) {
                console.error("Error al conectar con la API:", error);
            } finally {
                setCargando(false);
            }
        };
        obtenerProductos();
    }, []);

    // FILTRADO POR PASOS
    const productosFiltrados = productos.filter(p => {
        if (p.disponible === false) return false;
        const coincideNombre = p.nombre.toLowerCase().includes(filtro.toLowerCase());
        if (!coincideNombre) return false;

        const pasoActual = Number(pasoInterior);
        const sub = p.sub ? p.sub : "";

        if (pasoActual === 1) return sub === 'Bebidas'
        if (pasoActual === 2) return sub === 'Entrantes';
        if (pasoActual === 3) return sub === 'Segundos';
        if (pasoActual === 4) return sub === 'Postres';
        return true;
    });

    // Ahora, al añadir un producto, avisamos directamente al padre
    const añadirAlPedido = (producto, cantidad, nota) => {
        const nuevoItem = {
            nombre: producto.nombre,
            precio: producto.precio,
            sub: producto.sub,
            cantidad,
            nota,
            idTemporal: Date.now()
        };

        // Enviamos el producto individual al TerminalCamarero
        console.log("Enviando item con categoría:", nuevoItem.sub);
        alFinalizarPedido(nuevoItem);
        setProductoEdicion(null);
    };

    if (cargando) return <div className={styles.loader}>Cargando carta...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.searchBox}>
                <span className="material-icons">search</span>
                <input
                    type="text"
                    placeholder="Buscar producto..."
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                />
            </div>

            <div className={styles.grid}>
                {productosFiltrados.map(p => (
                    <div key={p._id} className={styles.card} onClick={() => {
                        setProductoEdicion(p);
                    }}>
                        <div className={styles.imgContainer}>
                            {p.imagen && p.imagen !== "ejemplo" ? (
                                <img src={`${import.meta.env.VITE_API_URL}/imgMenu/${p.imagen}`} alt={p.nombre} />
                            ) : (
                                <span className="material-icons">restaurant</span>
                            )}
                            <div className={styles.priceTag}>{p.precio.toFixed(2)}€</div>
                        </div>
                        <div className={styles.cardInfo}>
                            <h4>{p.nombre}</h4>
                        </div>
                    </div>
                ))}
            </div>

            {productoEdicion && (
                <DetalleProducto
                    producto={productoEdicion}
                    alConfirmar={(prod, cant, nota) => añadirAlPedido(prod, cant, nota)}
                    alCerrar={() => setProductoEdicion(null)}
                />
            )}


        </div>
    );
};

export default CartaProductos;