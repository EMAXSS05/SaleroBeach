import React, { useState,useEffect } from 'react';
import CartaProductos from './CartaProductos';
import styles from './DetalleMesa.module.css';

const DetalleMesa = ({ mesa, pedido, alCobrar, alVolver, alConfirmarPedido, alEnviarA_Cocina }) => {
    // 1. SI EL PEDIDO NO EXISTE (fue cancelado o no hay datos), VOLVEMOS ATRÁS
    if (!pedido) {
        // Forzamos la salida si el pedido desaparece de repente
        setTimeout(() => alVolver(), 0);
        return null; 
    }
    
   const [paso, setPaso] = useState(pedido.items.length > 0 ? 4 : 0);
   const [numComensales, setNumComensales] = useState(pedido.comensales || 1);
   

   // si se cambia de mesa el estado se actualiza.
    useEffect(() => {
        if (pedido.items.length > 0) {
            setPaso(4); // Si ya hay comida, directo al resumen
        } else {
            setPaso(0); // Si está limpia, a preguntar cuántos son
        }
    }, [mesa]);

    // Cálculo del total acumulado
    const totalConsumido = pedido.items.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

    // VISTA 0: COMENSALES
    if (paso === 0) {
        return (
            <div className={styles.container}>
                <header className={styles.header}>
                    <button onClick={alVolver} className={styles.btnBack}>←</button>
                    <h2>Mesa {mesa}</h2>
                </header>
                <div className={styles.selectorComensales}>
                    <h3>¿Cuántas personas son?</h3>
                    <div className={styles.counter}>
                        <button onClick={() => setNumComensales(Math.max(1, numComensales - 1))}>-</button>
                        <span className={styles.comensalesLarge}>{numComensales}</span>
                        <button onClick={() => setNumComensales(numComensales + 1)}>+</button>
                    </div>
                    <button className={styles.btnSiguiente} onClick={() => setPaso(1)}>
                        Empezar Pedido
                    </button>
                </div>
            </div>
        );
    }

    if (paso >= 1 && paso <= 3) {
        const titulos = ["", "Bebidas y Entradas", "Segundos Platos", "Postres"];
        return (
            <div className={styles.container}>
                <header className={styles.header}>
                    <button onClick={() => setPaso(paso - 1)} className={styles.btnBack}>←</button>
                    <h2>Mesa {mesa}</h2>
                </header>

                <div className={styles.infoPasos}>
                    <p style={{ color: '#f56a23', margin: '5px 0' }}>{titulos[paso]}</p>
                    <span style={{ color: '#888', fontSize: '0.8rem' }}>Paso {paso} de 3</span>
                </div>

                <div className={styles.zonaScrollCarta}>
                    <CartaProductos
                        mesa={mesa}
                        pasoInterior={paso}
                        alVolver={() => setPaso(0)}
                        alFinalizarPedido={(itemNuevo) => {
                            console.log("Recibido en DetalleMesa:", itemNuevo);
                            alConfirmarPedido(itemNuevo);
                        }}
                    />
                </div>

                <div className={styles.accionesFlujo}>
                    <button className={styles.btnSaltar} onClick={() => setPaso(paso + 1)}>
                        {paso === 3 ? "FINALIZAR Y VER RESUMEN" : "SIGUIENTE PASO →"}
                    </button>
                </div>
            </div>
        );
    }

    // VISTA 4: RESUMEN
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <button onClick={() => setPaso(3)} className={styles.btnBack}>←</button>
                <h2>Mesa {mesa} (Resumen)</h2>
            </header>

            <div className={styles.listaConsumo}>
                {pedido.items.length > 0 ? (
                    pedido.items.map((item, idx) => (
                        <div key={idx} className={styles.item}>
                            <div className={styles.itemInfo}>
                                <span className={styles.nombre}>{item.nombre} x{item.cantidad}</span>
                                <span className={styles.precio}>{(item.precio * item.cantidad).toFixed(2)}€</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className={styles.vacio}>Sin productos seleccionados</p>
                )}
            </div>

            <div className={styles.totalBox}>
                <span>TOTAL:</span>
                <span className={styles.montoTotal}>{totalConsumido.toFixed(2)}€</span>
            </div>

            <div className={styles.acciones}>
                <button className={styles.btnAñadir} onClick={() => setPaso(1)}>
                    Añadir más
                </button>
                <button className={styles.btnCobrar} onClick={alCobrar} onClick={alEnviarA_Cocina}>
                    Cobrar y Cerrar
                </button>
            </div>
        </div>
    );
};

export default DetalleMesa;