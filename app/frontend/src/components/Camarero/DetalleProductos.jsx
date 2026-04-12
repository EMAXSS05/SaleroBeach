import React, { useState } from 'react';
import styles from './DetalleProductos.module.css';

const DetalleProductos = ({ producto, alConfirmar, alCerrar }) => {
    const [nota, setNota] = useState("");
    const [cant, setCant] = useState(1);

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h3>{producto.nombre}</h3>
                
                <div className={styles.selector}>
                    <button onClick={() => setCant(Math.max(1, cant - 1))}>-</button>
                    <span>{cant}</span>
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