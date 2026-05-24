import React, { useState, useEffect } from 'react';
import { FaExclamationCircle, FaClock } from 'react-icons/fa';
import { MdPrint } from 'react-icons/md';
import styles from './PedidoCard.module.css';
import { formatDistanceToNow } from 'date-fns';
import iconoTarjeta from '../../assets/iconos/tarjetaBancaria.png'
import iconoEfectivo from '../../assets/iconos/dineroEfectivo.png'
import iconoEliminar1 from '../../assets/iconos/boton-menoss.png'
import { es } from 'date-fns/locale/es';

const PedidoCard = ({ pedido, onCobrar, onCancelar, onEliminarItem }) => {
    const totalProductos = pedido.items.reduce((acc, item) => acc + item.cantidad, 0);
    const [metodoPagado, setMetodoPagado] = useState(null);
    const [efectivoEntregado, setEfectivoEntregado] = useState('');
    const [cobrado, setCobrado] = useState(false);
    const [, setTick] = useState(0);
    useEffect(() => {
        const timer = setInterval(() => {
            setTick(tick => tick + 1);
        }, 60000);
        return () => clearInterval(timer);
    }, []);

    const fechaPedido = pedido.fecha ? new Date(pedido.fecha) : null;
    const [mostrarModalCobro, setMostrarModalCobro] = useState(false);

    const itemsAgrupados = pedido.items.reduce((acc, item) => {
        // Buscamos si el producto ya está en nuestro acumulador
        const existente = acc.find(i => i.nombre === item.nombre && i.nota === item.nota);

        if (existente) {
            // Si ya existe (y tiene la misma nota), sumamos la cantidad
            existente.cantidad += item.cantidad;
        } else {
            // Si no existe, lo añadimos como nuevo objeto (copiándolo para no mutar el original)
            acc.push({ ...item });
        }
        return acc;
    }, []);

    const handleCobrar = (metodo) => {
        setMetodoPagado(metodo);
        setCobrado(true);
    };
    const imprimirTicketCobro = (metodo) => {
        const ahora = new Date();
        const fecha = ahora.toLocaleString('es-ES');
        const cambio = metodo === 'efectivo' && efectivoEntregado
            ? Math.max(0, parseFloat(efectivoEntregado) - pedido.total).toFixed(2)
            : null;

        const ventana = window.open('', '_blank');
        ventana.document.write(`
            <html><head><title>Ticket Cobro</title>
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
                .nota { font-size: 10px; font-style: italic; margin-left: 26px; }
                .pago-row { display: flex; justify-content: space-between; margin: 3px 0; }
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
                ${i.nota ? `<div class="nota">(${i.nota})</div>` : ''}
            `).join('')}
            <div class="separator-solid"></div>
            <div class="total-row">
                <span>Total (Impuestos Incl.)</span>
                <span>${pedido.total?.toFixed(2)} €</span>
            </div>
            <div class="separator"></div>
            <div class="pago-row"><span>${metodo === 'efectivo' ? 'Efectivo' : 'Tarjeta'}</span><span>${metodo === 'efectivo' ? (efectivoEntregado || pedido.total?.toFixed(2)) + ' €' : pedido.total?.toFixed(2) + ' €'}</span></div>
            ${cambio !== null ? `<div class="pago-row"><span>Cambio</span><span>${cambio} €</span></div>` : ''}
            <div class="separator"></div>
            <div class="center" style="margin-top: 8px; font-size: 11px;">GRACIAS POR SU VISITA</div>
            </body></html>
        `);
        ventana.document.close();
        ventana.print();
    };

    const cerrarModal = () => {
        setMostrarModalCobro(false);
        setMetodoPagado(null);
        setEfectivoEntregado('');
        setCobrado(false);
    };


    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <div className={styles.orderTitle}>
                    <span className={styles.orderNumber}>Pedido #...{pedido._id?.slice(-3)}</span>
                    <div className={styles.waiterInfo}>
                        <FaClock className={styles.clockIcon} />
                        <span>
                            Hace {formatDistanceToNow(fechaPedido, { locale: es })} • Por {pedido.camarero || 'Camarero'}
                        </span>
                    </div>
                </div>
                {pedido.alertas && pedido.alertas.filter(a => a && a.trim() !== '').length > 0 && (
                <FaExclamationCircle className={styles.alertIcon} />
                )}
            </div>

            <div className={styles.itemList}>
                {/* IMPORTANTE: Ahora mapeamos 'itemsAgrupados' en lugar de 'pedido.items' */}
                {itemsAgrupados.map((item, index) => (
                    <div key={index} className={styles.itemRow}>
                        <div className={styles.itemDetails}>
                            <p className={styles.itemName}>
                                {item.nombre}
                                {item.nota && <span className={styles.notaItem}> ({item.nota})</span>}
                            </p>
                            <p className={styles.itemQty}>x {item.cantidad}</p>
                        </div>
                        <span className={styles.itemPrice}>
                            {(item.precio * item.cantidad).toFixed(2)}€
                        </span>
                        {/* Botón eliminar item */}
                        <button
                            className={styles.btnEliminarItem}
                            onClick={() => onEliminarItem(pedido._id, item._id)}
                        >
                            <img src={iconoEliminar1} alt="eliminar" width={18} />
                        </button>
                    </div>
                ))}
            </div>

            <div className={styles.divider}></div>

            <div className={styles.cardFooter}>
                <div className={styles.totalBlock}>
                    <span className={styles.totalLabel}>Total a cobrar</span>
                    <span className={styles.totalAmount}>{pedido.total?.toFixed(2)}€</span>
                </div>
                <div className={styles.tableBadge}>
                    MESA {pedido.mesas ? pedido.mesas.join(' + ') : 'S/N'}
                </div>
            </div>

            <div className={styles.actions}>
                <button
                    className={styles.btnCancelar}
                    onClick={() => {
                        if (window.confirm(`¿Estás seguro de que quieres CANCELAR el pedido de la mesa ${pedido.mesas?.join(' + ')}?`)) {
                            onCancelar();
                        }
                    }}
                >
                    CANCELAR
                </button>
                <button
                    className={styles.btnCobrar}
                    onClick={() => setMostrarModalCobro(true)}
                >
                    COBRAR
                </button>

                {mostrarModalCobro && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modal}>

                            {/* PASO 1: elegir método de pago */}
                            {!metodoPagado && (
                                <>
                                    <h3>Total a cobrar</h3>
                                    <span className={styles.modalTotal}>{pedido.total?.toFixed(2)}€</span>
                                    <p>¿Cómo paga el cliente?</p>
                                    <div className={styles.modalBotones}>
                                        <button className={styles.btnEfectivo} onClick={() => setMetodoPagado('efectivo')}>
                                            <img src={iconoEfectivo} alt="efectivo" width={35} />Efectivo
                                        </button>

                                        <button className={styles.btnTarjeta} onClick={() => { setMetodoPagado('tarjeta'); setCobrado(true); }}>
                                            <img src={iconoTarjeta} alt="tarjeta" width={38} />Tarjeta
                                        </button>
                                    </div>
                                    <button className={styles.btnCancelarModal} onClick={cerrarModal}>Cancelar</button>
                                </>
                            )}

                            {/* Pide la cantidad entregada */}
                            {metodoPagado === 'efectivo' && !cobrado && (
                                <>
                                    <h3>Efectivo recibido</h3>
                                    <span className={styles.modalTotal}>{pedido.total?.toFixed(2)}€</span>
                                    <div className={styles.efectivoInput}>
                                        <label>Cantidad entregada</label>
                                        <div className={styles.inputEuroWrapper}>
                                            <span>€</span>
                                            <input
                                                type="number"
                                                min={pedido.total}
                                                step="0.01"
                                                placeholder={pedido.total?.toFixed(2)}
                                                value={efectivoEntregado}
                                                onChange={e => setEfectivoEntregado(e.target.value)}
                                                autoFocus
                                                className={styles.inputEfectivo}
                                            />
                                        </div>
                                        {efectivoEntregado && parseFloat(efectivoEntregado) >= pedido.total && (
                                            <div className={styles.cambioBox}>
                                                Cambio: <strong>{(parseFloat(efectivoEntregado) - pedido.total).toFixed(2)} €</strong>
                                            </div>
                                        )}
                                    </div>
                                    <div className={styles.modalBotones}>
                                        <button className={styles.btnCancelarModal} onClick={() => setMetodoPagado(null)}>← Volver</button>
                                        <button
                                            className={styles.btnConfirmarCobro}
                                            disabled={!efectivoEntregado || parseFloat(efectivoEntregado) < pedido.total}
                                            onClick={() => handleCobrar('efectivo')}
                                        >
                                            Confirmar Cobro
                                        </button>
                                    </div>
                                </>
                            )}

                            {/* PASO 2: cobrado — ofrecer imprimir */}
                            {cobrado && (
                                <>
                                    <div className={styles.cobradoIcon}>✓</div>
                                    <h3>¡Cobrado!</h3>
                                    <p>¿Desea imprimir el ticket?</p>
                                    <div className={styles.modalBotones}>
                                        <button className={styles.btnCancelarModal} onClick={() => {
                                            onCobrar(metodoPagado);
                                            cerrarModal();
                                        }}>
                                            Sin ticket
                                        </button>
                                        <button className={styles.btnImprimirCobro} onClick={() => {
                                            imprimirTicketCobro(metodoPagado);
                                            onCobrar(metodoPagado);
                                            cerrarModal();
                                        }}>
                                            <MdPrint /> Imprimir ticket
                                        </button>
                                    </div>
                                </>
                            )}

                        </div>
                    </div>)

                }
            </div>
        </div>
    )
}
export default PedidoCard;