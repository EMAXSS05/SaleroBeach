import React, { useState, useEffect } from 'react';
import CartaProductos from './CartaProductos';
import styles from './DetalleMesa.module.css';
import iconoPlato from '../../assets/iconos/cubiertos.png'

const DetalleMesa = ({ mesa, pedido,alVolver, alConfirmarPedido, alEnviarA_Cocina,alEliminarItem }) => {
    // Si el pedido no existe volvemos atrás
    if (!pedido) {
        setTimeout(() => alVolver(), 0);
        return null;
    }

    const [paso, setPaso] = useState(pedido.items.length > 0 ? 5 : 0);
    const [numComensales, setNumComensales] = useState(pedido.comensales || 1);
    const [alertaMesa, setAlertaMesa] = useState('');


    // si se cambia de mesa el estado se actualiza.
    useEffect(() => {
        if (pedido.items.length > 0) {
            setPaso(5);
        } else {
            setPaso(0); 
        }
    }, [mesa]);
    const guardarAlertaYContinuar = async () => {
    if (alertaMesa.trim() !== "") {
        const arrayMesas = String(mesa).includes('+')
            ? mesa.split('+')
            : [String(mesa)];

        // Envía la alerta a cada mesa por separado
        await Promise.all(
            arrayMesas.map(numMesa =>
                fetch(`${import.meta.env.VITE_API_URL}/api/mesas/${numMesa}/alerta`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nuevaAlerta: alertaMesa })
                })
            )
        );
    }
    setPaso(1);
};

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
                    <button className={styles.btnSiguiente} onClick={() => setPaso(0.5)}>
                        Empezar Pedido
                    </button>
                </div>
            </div>
        );
    }

    // VISTA 0.5: ALERTAS DE MESA
if (paso === 0.5) {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <button onClick={() => setPaso(0)} className={styles.btnBack}>←</button>
                <h2>Mesa {mesa} - Alertas</h2>
            </header>
            <div className={styles.selectorComensales}>
                <h3>¿Alguna alerta o necesidad?</h3>
                <p style={{fontSize: '0.9rem', color: '#666'}}>Ej: Alergias, bebés/niños, prisa...</p>
                
                <textarea 
                    className={styles.inputAlerta} 
                    placeholder="Escribe aquí (ej: 1 niño, prisa)..."
                    value={alertaMesa || ''}
                    onChange={(e) => setAlertaMesa(e.target.value)}
                    rows="4"
                />

                <div className={styles.botonesRapidos}>
                    {/* Botones para añadir texto rápido */}
                    <button onClick={() => setAlertaMesa("Todo Junto")}> <img src={iconoPlato} width={20}/> Junto</button>
                    <button onClick={() => setAlertaMesa("Mesa con prisa")}>⏱️ Prisa</button>
                    <button onClick={() => setAlertaMesa("niños en mesa")}>🧒peques</button>
                </div>

                <button className={styles.btnSiguiente} onClick={guardarAlertaYContinuar}>
                    Ir a la Carta →
                </button>
            </div>
        </div>
    );
}
   //VISTAS DEL PASO 1 AL 3
    if (paso >= 1 && paso <= 4) {
        const titulos = ["", "Bebidas","Entrantes","Segundos", "Postres"];
        return (
            <div className={styles.container}>
                <header className={styles.header}>
                    <button onClick={() => setPaso(paso - 1)} className={styles.btnBack}>←</button>
                    <h2>Mesa {mesa}</h2>
                </header>

                <div className={styles.infoPasos}>
                    <p style={{ color: '#f56a23', margin: '5px 0' }}>{titulos[paso]}</p>
                    <span style={{ color: '#888', fontSize: '0.8rem' }}>Paso {paso} de 4</span>
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
                        {paso === 4 ? "FINALIZAR Y VER RESUMEN" : "SIGUIENTE PASO →"}
                    </button>
                </div>
            </div>
        );
    }

    const itemsAgrupados = pedido.items.reduce((acc, item) => {
        // Buscamos si ya existe el producto con la misma nota
        const existente = acc.find(i => i.nombre === item.nombre && i.nota === item.nota);
        if (existente) {
            existente.cantidad += item.cantidad;
        } else {
            acc.push({ ...item });
        }
        return acc;
    }, []);

    // VISTA 4: RESUMEN
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <button onClick={alVolver} className={styles.btnBack}>←</button>
                <h2>Mesa {mesa} - Resumen</h2>
            </header>

            <div className={styles.listaConsumo}>
               {itemsAgrupados.map((item, idx) => (
    <div key={idx} className={styles.item}>
        {/* Este contenedor agrupa nombre y precio y los separa */}
        <div className={styles.itemMainInfo}>
            <span className={styles.nombre}>
                {item.nombre} x{item.cantidad}
                {item.nota && <small style={{ display: 'block', color: '#888', fontSize: '0.8rem' }}>({item.nota})</small>}
            </span>
            <span className={styles.precio}>
                {(item.precio * item.cantidad).toFixed(2)}€
            </span>
        </div>
        <button 
            className={styles.btnBorrarItem} 
            onClick={() => alEliminarItem(item.nombre, item.nota)}
        >
            <span className="material-icons">delete_outline</span>
        </button>
    </div>
))}
            </div>

            <div className={styles.totalBox}>
                <span>TOTAL:</span>
                <span className={styles.montoTotal}>{totalConsumido.toFixed(2)}€</span>
            </div>
                    
            <div className={styles.acciones}>
                <button className={styles.btnAñadir} onClick={() => setPaso(1)}>
                    Añadir más
                </button>
                <button className={styles.btnCobrar} onClick={()=>alEnviarA_Cocina(alertaMesa)}>
                    Confirmar y Enviar
                </button>
            </div>
        </div>
    );
};

export default DetalleMesa;