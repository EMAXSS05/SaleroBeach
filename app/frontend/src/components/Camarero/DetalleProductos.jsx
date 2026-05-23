import React, { useState } from 'react';
import styles from './DetalleProductos.module.css';

const DetalleProductos = ({ producto, alConfirmar, alCerrar }) => {
    const [nota, setNota] = useState("");
    const [cant, setCant] = useState(1);
    const [notasSeleccionadas, setNotasSeleccionadas] = useState([]);
    const NOTAS_RAPIDAS = [
    'Sin sal', 'Sin gluten', 'Sin lactosa', 'Sin picante','poco picante',
    'Poco hecho', 'Muy hecho', 'Sin hielo', 'Con hielo',
    'Sin cebolla', 'Sin ajo', 'Para llevar', 'Alergia','sin aliñar'
];

    // Función para manejar el cambio manual en el input
    const manejarCambioManual = (e) => {
        const valor = parseInt(e.target.value);
        if (isNaN(valor) || valor < 1) {
            setCant(1); 
        } else {
            setCant(valor);
        }
    };
     const toggleNota = (notaRapida) => {
        setNotasSeleccionadas(prev =>
            prev.includes(notaRapida)
                ? prev.filter(n => n !== notaRapida)
                : [...prev, notaRapida]
        );
    };
    
  /*Combina las notas rápidas seleccionadas con cualquier texto manual,
    y formatea el resultado en un solo string para enviarlo al componente padre.*/
    const handleConfirmar = () => {
        const todasLasNotas = [
            ...notasSeleccionadas,
            ...(nota.trim() ? [nota.trim()] : [])
        ].join(', ');

        alConfirmar(producto, cant, todasLasNotas);
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
                  {/* Chips de notas rápidas */}
                                <div className={styles.chipsContainer}>
                                    {NOTAS_RAPIDAS.map(n => (
                                        <button
                                            key={n}
                                            className={`${styles.chip} ${notasSeleccionadas.includes(n) ? styles.chipActivo : ''}`}
                                            onClick={() => toggleNota(n)}
                                            type="button"
                                        >
                                            {n}
                                        </button>
                                    ))}
                                </div>

                <textarea 
                    placeholder="Nota adicional..." 
                    value={nota}
                    onChange={(e) => setNota(e.target.value)}
                />

                <div className={styles.acciones}>
                    <button onClick={alCerrar} className={styles.btnCerrar}>Cancelar</button>
                    <button 
                        onClick={handleConfirmar}
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