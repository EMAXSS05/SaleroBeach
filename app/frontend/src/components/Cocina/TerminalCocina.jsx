import React, { useState, useEffect } from 'react';
import styles from './TerminalCocina.module.css';

const TerminalCocina = () => {
    const [pedidos, setPedidos] = useState([]);

    /**
   * Obtiene pedidos desde el backend
   * Filtra:
   *  - Solo pedidos en curso
   *  - Solo aquellos que contienen items de tipo "Food"
   */
    const obtenerPedidos = async () => {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/pedidos`);
        const data = await res.json();
        const soloComida = data.filter(p =>
            p.estadoGeneral === 'en_curso' &&
            p.items.some(item => item.sub === 'Food')
        );
        setPedidos(soloComida);
    };
    /**
    * Marca un pedido completo como "preparado"
    * Esto hace que desaparezca de la vista de cocina
    */
    const finalizarTicket = async (pedidoId) => {
        await fetch(`${import.meta.env.VITE_API_URL}/api/pedidos/${pedidoId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estadoGeneral: 'preparado' })
        });
        //Refresca los pedidos
        obtenerPedidos();
    };


    const actualizarEstadoItem = async (pedidoId, itemId, nuevoEstado) => {
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/api/pedidos/${pedidoId}/item/${itemId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nuevoEstado })
            });
            obtenerPedidos();
        } catch (error) {
            console.error("Error actualizando estado del plato:", error);
        }
    };

    useEffect(() => {
        obtenerPedidos();
        const intervalo = setInterval(obtenerPedidos, 6000);
        return () => clearInterval(intervalo);
    }, []);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>COMANDAS DE COCINA</h1>
            <div className={styles.grid}>
                {pedidos.map((pedido) => (
                    <div key={pedido._id} className={styles.ticket}>
                        <div className={styles.ticketHeader}>
                            <span className={styles.mesaNum}>
                                MESA {pedido.mesas ? pedido.mesas.join(' + ') : 'S/N'}
                            </span>
                            <span className={styles.hora}>
                                {new Date(pedido.fecha_apertura).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                        {pedido.alertas && pedido.alertas.length > 0 && (
                            <div className={styles.alertaMesa}>
                                {[...new Set(pedido.alertas)].map((alerta, idx) => (
                                    <span key={idx} className={styles.alertaBadge}>
                                        ⚠️ {alerta}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className={styles.itemsList}>
                            {pedido.items.filter(i => i.sub === 'Food').map((item, idx) => (
                                <div key={item._id || idx} className={styles.itemRow}>
                                    <div className={styles.itemMain}>
                                        <span className={styles.cantidad}>{item.cantidad}x</span>
                                        <div className={styles.itemInfo}>
                                            <span className={styles.nombre}>{item.nombre}</span>
                                            <span className={`${styles.badge} ${styles[item.estadoItem.replace(' ', '')]}`}>
                                                {item.estadoItem.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>

                                    <div className={styles.itemActions}>
                                        {item.estadoItem === 'pendiente' && (
                                            <button
                                                className={styles.btnStart}
                                                onClick={() => actualizarEstadoItem(pedido._id, item._id, 'en preparación')}
                                            >
                                                EMPEZAR
                                            </button>
                                        )}
                                        {item.estadoItem === 'en preparación' && (
                                            <button
                                                className={styles.btnFinish}
                                                onClick={() => actualizarEstadoItem(pedido._id, item._id, 'listo')}
                                            >
                                                TERMINAR
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            className={styles.btnNotificar}
                            onClick={() => finalizarTicket(pedido._id)}
                            // Si algún ítem de comida NO está 'listo', deshabilitamos el aviso
                            disabled={pedido.items.filter(i => i.sub === 'Food').some(i => i.estadoItem !== 'listo')}
                        >
                            AVISAR CAMARERO
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TerminalCocina;