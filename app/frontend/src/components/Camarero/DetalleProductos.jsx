import React, { useState } from 'react';
import styles from './DetalleProductos.module.css';

const DetalleProductos = ({ producto, alConfirmar, alCerrar }) => {
    const [nota, setNota] = useState("");
    const [cant, setCant] = useState(1);

    // Función para manejar el cambio manual en el input
    const manejarCambioManual = (e) => {
        const valor = parseInt(e.target.value);
        if (isNaN(valor) || valor < 1) {
            setCant(1); 
        } else {
            setCant(valor);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h3>{producto.nombre}</h3>
                
                <div className={styles.selector}>
                    <button onClick={() => setCant(Math.max(1, cant - 1))}>-</button>
                    <input 
                        type="number" 
                        value={cant} 
                        onChange={manejarCambioManual}
                        className={styles.inputCantidad}
                        min="1"
                    />
                    <button onClick={() => setCant(cant + 1)}>+</button>
                </div>

                <textarea 
                    placeholder="Ej: Poco picante, sin hielo..." 
                    value={nota}
                    onChange={(e) => setNota(e.target.value)}
                />

                <div className={styles.acciones}>
                    <button onClick={alCerrar} className={styles.btnCerrar}>Cancelar</button>
                    <button 
                        onClick={() => alConfirmar(producto, cant, nota)} 
                        className={styles.btnOk}
                    >
                        Añadir
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DetalleProductos;