import React, { useState, useEffect } from 'react';
import styles from './HistorialPedidos.module.css';

const HistorialPedidos = ({ pedidosFinalizados,sesionCaja,setSesionCaja }) => {
    const [filtroFecha, setFiltroFecha] = useState('');
    const [filtroMesa, setFiltroMesa] = useState('');
    const [pedidosFiltrados, setPedidosFiltrados] = useState(pedidosFinalizados);
    const [mostrarZ, setMostrarZ] = useState(false);


     // Si hay sesión de caja se usa fechaApertura
    const fechaApertura = sesionCaja?.fechaApertura
        ? new Date(sesionCaja.fechaApertura)
        : new Date(new Date().setHours(0, 0, 0, 0));

    const ahora = new Date();
     // Pedidos desde la apertura de caja hasta ahora
    const pedidosJornada = pedidosFinalizados.filter(p =>
        new Date(p.fecha) >= fechaApertura
    );
     const formatoTicket = (fecha) => {
        const d = new Date(fecha);
        const hora = d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        const dia = d.toLocaleDateString('es-ES');
        return `${hora} ${dia}`;
    };
    //Cálculos para el Z
    const hoy = new Date().toLocaleDateString('es-ES');
    const pedidosHoy = pedidosFinalizados.filter(p =>
        new Date(p.fecha).toLocaleDateString('es-ES') === hoy
    );

    const pedidosPagados = pedidosJornada.filter(p => p.estadoGeneral === 'pagado');
    const pedidosCancelados = pedidosJornada.filter(p => p.estadoGeneral === 'cancelado');
    

    const totalEfectivo = pedidosPagados
        .filter(p => p.metodoPago === 'efectivo')
        .reduce((acc, p) => acc + p.total, 0);

    const totalTarjeta = pedidosPagados
        .filter(p => p.metodoPago === 'tarjeta')
        .reduce((acc, p) => acc + p.total, 0);
    const cantidadEfectivo = pedidosPagados.filter(p => p.metodoPago === 'efectivo').length;
    const cantidadTarjeta = pedidosPagados.filter(p => p.metodoPago === 'tarjeta').length;
    const totalVentas = pedidosPagados.reduce((acc, p) => acc + p.total, 0);
    const totalCancelaciones = pedidosCancelados.reduce((acc, p) => acc + p.total, 0);
    const impuestos = totalVentas - (totalVentas / 1.10);
    const saldoInicial = sesionCaja?.saldoInicial ?? 0;
    const saldoFinal = saldoInicial + totalEfectivo;
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

     const cerrarCaja = async () => {
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/api/caja/cerrar`, { method: 'POST' });
            setSesionCaja(null);
            setMostrarZ(false);
        } catch (err) {
            console.error('Error al cerrar la caja:', err);
        }
    };

    const calcularRecaudacionTotal = () => {
        return pedidosFiltrados
            .filter(p => p.estadoGeneral === 'pagado')
            .reduce((acc, p) => acc + p.total, 0)
            .toFixed(2);
    };


    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h2>HISTORIAL DE VENTAS</h2>
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
                <button className={styles.btnZ} onClick={() => setMostrarZ(true)}>
                Z — Cierre de Caja
            </button>
            </div>
            
            {mostrarZ && (
    <div className={styles.modalOverlay}>
        <div className={styles.modalZ} id="cierre-z">
<pre className={styles.zContent}>
{`
================================================
        Z - INFORME DE CAJA GLOBAL - Z
================================================
             Mercedes Arcce Romero
                    32973715H
------------------------------------------------
Punto de Venta:                            TPV
Fecha de Negocio:                    ${ahora.toLocaleDateString('es-ES')}
Inicio de Jornada:             ${formatoTicket(fechaApertura)}
Hasta:                         ${formatoTicket(ahora)}
------------------------------------------------
Saldo Inicial:                        ${saldoInicial.toFixed(2)} €
================================================

Cobros Registrados:
Efectivo                        ${String(cantidadEfectivo).padStart(3)}    ${totalEfectivo.toFixed(2)} €
Tarjeta                         ${String(cantidadTarjeta).padStart(3)}     ${totalTarjeta.toFixed(2)} €
-----------------------------------------------
Saldo Final:                          ${saldoFinal.toFixed(2)} €
-----------------------------------------------
Total Facturas:                 ${String(pedidosPagados.length).padStart(3)}    ${totalVentas.toFixed(2)} €
- Ventas:                       ${String(pedidosPagados.length).padStart(3)}    ${totalVentas.toFixed(2)} €
- Cancelaciones:                ${String(pedidosCancelados.length).padStart(3)}     ${totalCancelaciones.toFixed(2)} €
Impuestos Totales:                      ${impuestos.toFixed(2)} €
-----------------------------------------------
Cobros Totales:                        ${totalVentas.toFixed(2)} €

===============================================`}
</pre>

<div className={styles.modalAcciones}>
<button
className={styles.btnImprimir}
onClick={() => {
const contenido = document.getElementById('cierre-z').innerHTML;
const ventana = window.open('', '_blank');
ventana.document.write(`
<html><head><title>Cierre Z</title>
<style>
    body { font-family: monospace; padding: 20px; }
    button { display: none; }
</style>
</head><body>${contenido}</body></html>
`);
ventana.document.close();
ventana.print();
}}
>
🖨️ Imprimir
</button>
<button className={styles.btnCerrarZ} onClick={cerrarCaja}>Cerrar Caja</button>
<button className={styles.btnCerrarZ} onClick={() => setMostrarZ(false)}>
Cerrar
</button>
</div>
</div>
</div>
    )}
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