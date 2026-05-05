import React, { useState, useEffect } from 'react';
import styles from './HistorialPedidos.module.css';

const HistorialPedidos = ({ pedidosFinalizados }) => {
    const [filtroFecha, setFiltroFecha] = useState('');
    const [filtroMesa, setFiltroMesa] = useState('');
    const [pedidosFiltrados, setPedidosFiltrados] = useState(pedidosFinalizados);

    useEffect(() => {
        let resultado = pedidosFinalizados;

        if (filtroFecha) {
            resultado = resultado.filter(p => p.fecha.includes(filtroFecha));
        }
        if (filtroMesa) {
            resultado = resultado.filter(p => p.mesas === filtroMesa);
        }

        setPedidosFiltrados(resultado);
    }, [filtroFecha, filtroMesa, pedidosFinalizados]);

    const calcularRecaudacionTotal = () => {
        return pedidosFiltrados
            .filter(p => p.estadoGeneral === 'pagado')
            .reduce((acc, p) => acc + p.total, 0)
            .toFixed(2);
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h2>SALES HISTORY</h2>
                <div className={styles.statsCard}>
                    <span>Recaudación en vista:</span>
                    <span className={styles.totalAmount}>{calcularRecaudacionTotal()}€</span>
                </div>
            </header>

            {/* BARRA DE FILTROS */}
            <div className={styles.filterBar}>
                <div className={styles.filterGroup}>
                    <label>Fecha:</label>
                    <input
                        type="date"
                        onChange={(e) => setFiltroFecha(e.target.value)}
                    />
                </div>
                <div className={styles.filterGroup}>
                    <label>Mesa:</label>
                    <input
                        type="number"
                        placeholder="Ej: 5"
                        onChange={(e) => setFiltroMesa(e.target.value)}
                    />
                </div>
                <button className={styles.btnReset} onClick={() => { setFiltroFecha(''); setFiltroMesa(''); }}>
                    Limpiar Filtros
                </button>
            </div>

            {/* TABLA DE PEDIDOS */}
            <div className={styles.tableWrapper}>
                <table className={styles.tabla}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Fecha / Hora</th>
                            <th>Mesa</th>
                            <th>Camarero</th>
                            <th>Estado</th>
                            <th>Productos</th>
                            <th>Total</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pedidosFiltrados.map((pedido) => (
                            <tr key={pedido._id}>
                                <td className={styles.idText}>#{pedido._id.slice(-5)}</td>
                                <td>{new Date(pedido.fecha).toLocaleString('es-ES')}</td>
                                <td><span className={styles.mesaBadge}>{pedido.mesas.join(', ')}</span></td>
                                <td>{pedido.camarero}</td>
                                <td>
                                    <span style={{
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        fontSize: '12px',
                                        fontWeight: 'bold',
                                        backgroundColor: pedido.estadoGeneral === 'pagado' ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)',
                                        color: pedido.estadoGeneral === 'pagado' ? '#2ecc71' : '#e74c3c',
                                        border: `1px solid ${pedido.estadoGeneral === 'pagado' ? '#2ecc71' : '#e74c3c'}`
                                    }}>
                                        {pedido.estadoGeneral === 'pagado' ? 'COMPLETADO' : 'CANCELADO'}
                                    </span>
                                </td>
                                <td>
                                    <div className={styles.itemsResumen}>
                                        {pedido.items.length} productos
                                    </div>
                                </td>
                                <td className={styles.totalTd}>{pedido.total.toFixed(2)}€</td>
                                <td>
                                    <button className={styles.btnVerDetalle}>👁️ Ver Ticket</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HistorialPedidos;