import React, { useState, useEffect } from 'react';
import styles from './CartaProductos.module.css';
import DetalleProducto from './DetalleProductos'; 

const CartaProductos = ({ mesa, alVolver, alFinalizarPedido }) => { 
    const [productos, setProductos] = useState([]);
    const [filtro, setFiltro] = useState('');
    const [cargando, setCargando] = useState(true);
    const [productoEdicion, setProductoEdicion] = useState(null);
    const [pedidoActual, setPedidoActual] = useState([]);
    const [enviando, setEnviando] = useState(false); 

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

    // Función para enviar a la DB
    const manejarEnvioComanda = async () => {
        if (pedidoActual.length === 0) return;
        
        setEnviando(true);
        const totalCalculado = pedidoActual.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

        try {
            const res = await fetch('http://localhost:5000/api/pedidos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mesa: mesa, 
                    camarero: "Juan",
                    items: pedidoActual.map(item => ({
                    nombre: item.nombre,
                    precio: item.precio,
                    cantidad: item.cantidad,
                    nota: item.nota || ""
                })),
                    total: totalCalculado,
                    estadoGeneral: 'en_curso'
                })
            });

            if (res.ok) {
                alFinalizarPedido(pedidoActual); 
            } else {
                alert("Hubo un error al enviar la comanda");
            }
        } catch (error) {
            console.error("Error en la petición:", error);
            alert("No se pudo conectar con el servidor");
        } finally {
            setEnviando(false);
        }
    };

    const añadirAlPedido = (producto, cantidad, nota) => {
        const nuevoItem = { 
            ...producto, 
            cantidad, 
            nota, 
            idTemporal: Date.now() 
        };
        setPedidoActual([...pedidoActual, nuevoItem]);
        setProductoEdicion(null);
    };

    const productosFiltrados = productos.filter(p => 
        p.nombre.toLowerCase().includes(filtro.toLowerCase())
    );

    if (cargando) return <div className={styles.loader}>Cargando carta de Salero...</div>;

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
                    <div key={p._id} className={styles.card} onClick={() => {
                        if (p.categoria === 'Barra') {
                            añadirAlPedido(p, 1, "");
                        } else {
                            setProductoEdicion(p);
                        }
                    }}>
                        <div className={styles.imgContainer}>
                            {p.imagen && p.imagen !== "ejemplo" ? (
                                <img src={`http://localhost:5000/uploads/${p.imagen}`} alt={p.nombre} />
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

            {productoEdicion && (
                <DetalleProducto 
                    producto={productoEdicion} 
                    alConfirmar={añadirAlPedido}
                    alCerrar={() => setProductoEdicion(null)}
                />
            )}

            {pedidoActual.length > 0 && (
                <div className={styles.footerAction}>
                    <button 
                        className={styles.btnComanda} 
                        onClick={manejarEnvioComanda} 
                        disabled={enviando}
                    >
                        {enviando ? 'ENVIANDO...' : `ENVIAR COMANDA • ${pedidoActual.reduce((acc, item) => acc + (item.precio * item.cantidad), 0).toFixed(2)}€`}
                    </button>
                </div>
            )}
        </div>
    );
};

export default CartaProductos;