import React from 'react';
import styles from './DetalleMesa.module.css';

const DetalleMesa = ({ mesa, pedido, alAñadir, alCobrar, alVolver }) => {
    // se calcula el total de lo que ya hayan consumido
    const totalConsumido = pedido.items.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <button onClick={alVolver} className={styles.btnBack}>←</button>
                <h2>Mesa {mesa}</h2>
            </header>

            <div className={styles.atendidoPor}>
                <span>Atendido por TI</span>
            </div>

            <div className={styles.listaConsumo}>
                {pedido.items.map((item, idx) => (
                    <div key={idx} className={styles.item}>
                        <div className={styles.itemInfo}>
                            <span className={styles.nombre}>{item.nombre} x{item.cantidad}</span>
                            <span className={styles.precio}>{(item.precio * item.cantidad).toFixed(2)}€</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.totalBox}>
                <span>TOTAL ACTUAL:</span>
                <span className={styles.montoTotal}>{totalConsumido.toFixed(2)}€</span>
            </div>

            <div className={styles.acciones}>
                <button className={styles.btnAñadir} onClick={alAñadir}>
                    + Añadir
                </button>
                <button className={styles.btnCobrar} onClick={alCobrar}>
                    Cobrar
                </button>
            </div>
        </div>
    );
};

export default DetalleMesa;