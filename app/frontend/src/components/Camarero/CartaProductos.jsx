import React, { useState, useEffect } from 'react';
import styles from './CartaProductos.module.css';
import DetalleProducto from './DetalleProductos'; 

const CartaProductos = ({ mesa, alVolver }) => {
    const [productos, setProductos] = useState([]);
    const [filtro, setFiltro] = useState('');
    const [cargando, setCargando] = useState(true);
    const [productoEdicion, setProductoEdicion] = useState(null);
    const [pedidoActual, setPedidoActual] = useState([]);

    // 1. Cargar productos de tu API real
    useEffect(() => {
        const obtenerProductos = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/productos');
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

    // Lógica de selección
    const manejarClickProducto = (p) => {
    // "Barra" son bebidas (directo)
    // "Cocina" son platos (abren modal para notas)
    
    if (p.categoria === 'Barra') {
        // Se añade directamente al pedido con cantidad 1 y sin nota
        añadirAlPedido(p, 1, "");
    } else if (p.categoria === 'Cocina') {
        // Abrimos el modal para especificar punto de cocción, alérgicos, notas, etc.
        setProductoEdicion(p);
    } else {
        // Por si acaso tienes otras categorías, puedes elegir un comportamiento por defecto
        setProductoEdicion(p);
    }
};

    const añadirAlPedido = (producto, cantidad, nota) => {
        const nuevoItem = { 
            ...producto, 
            cantidad, 
            nota, 
            idTemporal: Date.now() // Para poder borrarlo luego si te equivocas
        };
        setPedidoActual([...pedidoActual, nuevoItem]);
        setProductoEdicion(null);
    };

    const productosFiltrados = productos.filter(p => 
        p.nombre.toLowerCase().includes(filtro.toLowerCase())
    );

    if (cargando) return <div className={styles.loader}>Cargando carta...</div>;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <button onClick={alVolver} className={styles.btnBack}>
                    <span className="material-icons">arrow_back</span>
                </button>
                <h2>Mesa {mesa}</h2>
                <div className={styles.cartStatus}>
                    <span className="material-icons">shopping_bag</span>
                    <span className={styles.badge}>{pedidoActual.length}</span>
                </div>
            </header>

            <div className={styles.searchBox}>
                <span className="material-icons">search</span>
                <input 
                    type="text" 
                    placeholder="¿Qué busca el cliente?" 
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                />
            </div>

            <div className={styles.grid}>
                {productosFiltrados.map(p => (
                    <div key={p._id} className={styles.card} onClick={() => manejarClickProducto(p)}>
                        {/* Aquí asumo que guardas la URL de la imagen en el modelo */}
                        <div className={styles.imgContainer}>
                            {p.imagen ? (
                                <img src={p.imagen} alt={p.nombre} />
                            ) : (
                                <span className="material-icons">restaurant</span>
                            )}
                            <div className={styles.priceTag}>{p.precio.toFixed(2)}€</div>
                        </div>
                        <div className={styles.cardInfo}>
                            <h4>{p.nombre}</h4>
                            <span className={styles.cat}>{p.categoria}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* El modal de notas que implementamos antes */}
            {productoEdicion && (
                <DetalleProducto 
                    producto={productoEdicion} 
                    alConfirmar={añadirAlPedido}
                    alCerrar={() => setProductoEdicion(null)}
                />
            )}

            {pedidoActual.length > 0 && (
                <div className={styles.footerAction}>
                    <button className={styles.btnComanda}>
                        ENVIAR COMANDA • {pedidoActual.reduce((acc, item) => acc + (item.precio * item.cantidad), 0).toFixed(2)}€
                    </button>
                </div>
            )}
        </div>
    );
};

export default CartaProductos;