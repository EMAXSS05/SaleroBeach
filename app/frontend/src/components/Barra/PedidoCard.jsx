import React, { useState, useEffect } from 'react';
import { FaExclamationCircle, FaClock } from 'react-icons/fa';
import styles from './PedidoCard.module.css';
import { formatDistanceToNow } from 'date-fns';
import iconoTarjeta from '../../assets/iconos/tarjetaBancaria.png'
import iconoEfectivo from '../../assets/iconos/dineroEfectivo.png'
import iconoEliminar1 from '../../assets/iconos/boton-menoss.png'
import { es } from 'date-fns/locale/es';

const PedidoCard = ({ pedido, onCobrar, onCancelar,onEliminarItem }) => {
    const totalProductos = pedido.items.reduce((acc, item) => acc + item.cantidad, 0);
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
                <FaExclamationCircle className={styles.alertIcon} />
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
                            <h3>Total a cobrar</h3>
                            <span className={styles.modalTotal}>{pedido.total?.toFixed(2)}€</span>
                            <p>¿Cómo paga el cliente?</p>
                            <div className={styles.modalBotones}>
                                <button
                                    className={styles.btnEfectivo}
                                    onClick={() => { onCobrar('efectivo'); setMostrarModalCobro(false); }}
                                >
                                    <img src={iconoEfectivo} alt="efectivo" width={35} />Efectivo
                                </button>
                                <button
                                    className={styles.btnTarjeta}
                                    onClick={() => { onCobrar('tarjeta'); setMostrarModalCobro(false); }}
                                >
                                    <img src={iconoTarjeta} alt="tarjeta" width={38} />Tarjeta
                                </button>
                            </div>
                            <button
                                className={styles.btnCancelarModal}
                                onClick={() => setMostrarModalCobro(false)}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PedidoCard;