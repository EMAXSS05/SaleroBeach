import React, { useState, useEffect } from 'react';
import styles from './HistorialPedidos.module.css';
import iconoOjo from '../../assets/iconos/ojo.png'
import iconoImprimir from '../../assets/iconos/imprimir.png'

const HistorialPedidos = ({ pedidosFinalizados,sesionCaja,setSesionCaja, onCerrarSesion }) => {
    const [filtroFecha, setFiltroFecha] = useState('');
    const [filtroMesa, setFiltroMesa] = useState('');
    const [pedidosFiltrados, setPedidosFiltrados] = useState(pedidosFinalizados);
    const [mostrarZ, setMostrarZ] = useState(false);
    const [pedidoDetalle, setPedidoDetalle] = useState(null);

    


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
            resultado = resultado.filter(p => p.mesas.includes(filtroMesa));
        }

        setPedidosFiltrados(resultado);
    }, [filtroFecha, filtroMesa, pedidosFinalizados]);

     const cerrarCaja = async () => {
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/api/caja/cerrar`, { method: 'POST' });
            setSesionCaja(null);
            setMostrarZ(false);
            onCerrarSesion();
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
    const reimprimirTicket = (pedido) => {
    const itemsAgrupados = pedido.items.reduce((acc, item) => {
        const existe = acc.find(i => i.nombre === item.nombre && i.nota === item.nota);
        if (existe) { existe.cantidad += item.cantidad; }
        else { acc.push({ ...item }); }
        return acc;
    }, []);

    const fecha = new Date(pedido.fecha).toLocaleString('es-ES');
    const ventana = window.open('', '_blank');
    ventana.document.write(`
        <html><head><title>Ticket</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Courier New', monospace; width: 80mm; padding: 8px; font-size: 12px; }
            .center { text-align: center; }
            .bold { font-weight: bold; }
            .separator { border-top: 1px dashed #000; margin: 6px 0; }
            .separator-solid { border-top: 2px solid #000; margin: 6px 0; }
            .header { text-align: center; margin-bottom: 8px; line-height: 1.6; }
            .item-row { display: flex; justify-content: space-between; margin: 3px 0; }
            .col-uds { width: 20px; }
            .col-nombre { flex: 1; padding: 0 6px; }
            .col-precio { width: 45px; text-align: right; }
            .col-importe { width: 50px; text-align: right; }
            .total-row { display: flex; justify-content: space-between; font-size: 15px; font-weight: bold; margin-top: 4px; }
            .th { font-size: 10px; color: #555; }
            .pago-row { display: flex; justify-content: space-between; margin: 3px 0; }
            @page {size: 80mm auto; margin: 0;}
        </style>
        </head><body>
        <div class="header">
            <div class="bold" style="font-size:14px">SALERO BEACH BAR</div>
            <div>CIF: 32973715H</div>
            <div>A Raña 35, 15293 Carnota</div>
            <div>Playa de Carnota</div>
        </div>
        <div class="separator-solid"></div>
        <div class="center bold" style="font-size:13px; margin: 4px 0;">FACTURA SIMPLIFICADA</div>
        <div class="separator"></div>
        <div style="display:flex; justify-content:space-between;">
            <span>Nº Op.: <b>T-${pedido._id?.slice(-5).toUpperCase()}</b></span>
            <span>Mesa ${pedido.mesas?.join('/')}</span>
        </div>
        <div>${fecha}</div>
        <div class="separator-solid"></div>
        <div class="item-row th">
            <span class="col-uds">Uds</span>
            <span class="col-nombre">Producto</span>
            <span class="col-precio">Precio</span>
            <span class="col-importe">Importe</span>
        </div>
        <div class="separator"></div>
        ${itemsAgrupados.map(i => `
            <div class="item-row">
                <span class="col-uds">${i.cantidad}</span>
                <span class="col-nombre">${i.nombre}</span>
                <span class="col-precio">${i.precio.toFixed(2)}</span>
                <span class="col-importe">${(i.precio * i.cantidad).toFixed(2)}</span>
            </div>
        `).join('')}
        <div class="separator-solid"></div>
        <div class="total-row">
            <span>Total (Impuestos Incl.)</span>
            <span>${pedido.total?.toFixed(2)} €</span>
        </div>
        <div class="separator"></div>
        <div class="pago-row">
            <span>${pedido.metodoPago === 'efectivo' ? 'Efectivo' : 'Tarjeta'}</span>
            <span>${pedido.total?.toFixed(2)} €</span>
        </div>
        <div class="separator"></div>
        <div class="center" style="margin-top: 8px; font-size: 11px;">GRACIAS POR SU VISITA</div>
        </body></html>
    `);
    ventana.document.close();
    ventana.print();
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
Efectivo                       ${String(cantidadEfectivo).padStart(3)}     ${totalEfectivo.toFixed(2)} €
Tarjeta                        ${String(cantidadTarjeta).padStart(3)}     ${totalTarjeta.toFixed(2)} €
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
<img src={iconoImprimir} width={20}/> Imprimir
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
                            <tr key={pedido._id} className={pedido.estadoGeneral === 'cancelado' ? styles.filaCancelada : ''}>
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
                                    <button className={styles.btnVerDetalle} onClick={() => setPedidoDetalle(pedido)}><img src={iconoOjo} width={20}/> Ver Ticket</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {pedidoDetalle && (
    <div className={styles.modalOverlay} onClick={() => setPedidoDetalle(null)}>
        <div className={styles.modalDetalle} onClick={e => e.stopPropagation()}>
            <div className={styles.detalleHeader}>
                <div>
                    <h3>Pedido #{pedidoDetalle._id.slice(-5)}</h3>
                    <span className={styles.detalleFecha}>{new Date(pedidoDetalle.fecha).toLocaleString('es-ES')}</span>
                </div>
                <span style={{
                    padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold',
                    backgroundColor: pedidoDetalle.estadoGeneral === 'pagado' ? 'rgba(0,255,0,0.1)' : 'rgba(255,0,0,0.1)',
                    color: pedidoDetalle.estadoGeneral === 'pagado' ? '#2ecc71' : '#e74c3c',
                    border: `1px solid ${pedidoDetalle.estadoGeneral === 'pagado' ? '#2ecc71' : '#e74c3c'}`
                }}>
                    {pedidoDetalle.estadoGeneral === 'pagado' ? 'COMPLETADO' : 'CANCELADO'}
                </span>
            </div>

            <div className={styles.detalleInfo}>
                <span>Mesa {pedidoDetalle.mesas.join(', ')}</span>
                <span>Camarero: {pedidoDetalle.camarero}</span>
                <span>Pago: {pedidoDetalle.metodoPago || 'N/A'}</span>
            </div>

            <div className={styles.detalleItems}>
                {pedidoDetalle.items.reduce((acc, item) => {
                    const existe = acc.find(i => i.nombre === item.nombre && i.nota === item.nota);
                    if (existe) { existe.cantidad += item.cantidad; }
                    else { acc.push({ ...item }); }
                    return acc;
                }, []).map((item, idx) => (
                    <div key={idx} className={styles.detalleItemRow}>
                        <span className={styles.detalleItemNombre}>
                            {item.nombre}
                            {item.nota && <small> ({item.nota})</small>}
                        </span>
                        <span className={styles.detalleItemQty}>x{item.cantidad}</span>
                        <span className={styles.detalleItemPrecio}>{(item.precio * item.cantidad).toFixed(2)}€</span>
                    </div>
                ))}
            </div>

            <div className={styles.detalleTotalRow}>
                <span>Total</span>
                <span className={styles.detalleTotalImporte}>{pedidoDetalle.total.toFixed(2)}€</span>
            </div>

            <div className={styles.detalleAcciones}>
                <button className={styles.btnCerrarDetalle} onClick={() => setPedidoDetalle(null)}>
                    Cerrar
                </button>
                {pedidoDetalle.estadoGeneral === 'pagado' && (
                    <button className={styles.btnReimprimir} onClick={() => reimprimirTicket(pedidoDetalle)}>
                        <img src={iconoImprimir} width={20}/>  Reimprimir ticket
                    </button>
                )}
            </div>
        </div>
    </div>
)}
        </div>
    );
};

export default HistorialPedidos;