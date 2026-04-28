import React, { useState, useEffect } from 'react';
import styles from './TerminalCocina.module.css';

const TerminalCocina = () => {
    const [pedidos, setPedidos] = useState([]);

    // Función para obtener pedidos del backend
    const obtenerPedidos = async () => {
        const res = await fetch('http://localhost:5000/api/pedidos');
        const data = await res.json();
        const soloComida = data.filter(p => 
            p.estadoGeneral !== 'pagado' && 
            p.items.some(item => item.sub === 'Food')
        );
        setPedidos(soloComida);
    };

    useEffect(() => {
        obtenerPedidos();
        const intervalo = setInterval(obtenerPedidos, 6000); 
        return () => clearInterval(intervalo);
    }, []);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>KITCHEN COMMANDS</h1>
            <div className={styles.grid}>
                {pedidos.map((pedido) => (
                    <div key={pedido._id} className={styles.ticket}>
                        <div className={styles.ticketHeader}>
                            <span className={styles.mesaNum}>MESA {pedido.mesa}</span>
                            <span className={styles.hora}>{new Date(pedido.fecha_apertura).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>

                       
                        {pedido.alertas && pedido.alertas.length > 0 && (
                            <div className={styles.alertaMesa}>
                                ⚠️ {pedido.alertas.join(', ')}
                            </div>
                        )}

                        <div className={styles.itemsList}>
                            {pedido.items.filter(i => i.sub === 'Food').map((item, idx) => (
                                <div key={idx} className={styles.itemRow}>
                                    <span className={styles.cantidad}>{item.cantidad}x</span>
                                    <div className={styles.itemInfo}>
                                        <span className={styles.nombre}>{item.nombre}</span>
                                        {item.nota && <span className={styles.nota}>"{item.nota}"</span>}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button className={styles.btnListo}>MARCAR LISTO</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TerminalCocina;