import React from 'react';
import { FaExclamationCircle, FaClock } from 'react-icons/fa';
import styles from './PedidoCard.module.css';

const PedidoCard = ({ pedido, onCobrar, onCancelar }) => {
    const totalProductos = pedido.items.reduce((acc, item) => acc + item.cantidad, 0);

    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <div className={styles.orderTitle}>
                    <span className={styles.orderNumber}>Pedido #...{pedido._id?.slice(-3)}</span>
                    <div className={styles.waiterInfo}>
                        <FaClock className={styles.clockIcon} />
                        <span>Hace 5 min • Por {pedido.camarero || 'Camarero'}</span>
                    </div>
                </div>
                <FaExclamationCircle className={styles.alertIcon} />
            </div>

            <div className={styles.itemList}>
                {pedido.items.map((item, index) => (
                    <div key={index} className={styles.itemRow}>
                        <div className={styles.itemImage}>
                            {item.nombre.charAt(0)}
                        </div>
                        <div className={styles.itemDetails}>
                            <p className={styles.itemName}>{item.nombre}</p>
                            <p className={styles.itemQty}>Cantidad: {item.cantidad}</p>
                        </div>
                        <span className={styles.itemPrice}>{(item.precio * item.cantidad).toFixed(2)}€</span>
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
                    MESA {pedido.mesa}
                </div>
            </div>

            <div className={styles.actions}>
                <button
                    className={styles.btnCancelar}
                    onClick={() => {
                        if (window.confirm(`¿Estás seguro de que quieres CANCELAR el pedido de la mesa ${pedido.mesa}?`)) {
                            onCancelar();
                        }
                    }}
                >
                    CANCELAR
                </button>
                <button
                    className={styles.btnCobrar}
                    onClick={() => {
                        if (window.confirm(`¿Confirmas que has cobrado ${pedido.total}€ a la mesa ${pedido.mesa}?`)) {
                            onCobrar();
                        }
                    }}
                >
                    COBRAR
                </button>
            </div>
        </div>
    );
};

export default PedidoCard;