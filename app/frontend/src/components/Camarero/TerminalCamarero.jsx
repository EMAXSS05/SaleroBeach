import React, { useState } from 'react';
import MapaMesas from './MapaMesas';
import CartaProductos from './CartaProductos';
import styles from './TerminalCamarero.module.css';

const TerminalCamarero = () => {
    const [mesaSeleccionada, setMesaSeleccionada] = useState(null);
    const [paso, setPaso] = useState(1); 

    // Función para cambiar de interfaz
    const manejarSeleccionMesa = (numeroMesa) => {
        console.log("Cambiando a la carta para la mesa:", numeroMesa);
        setMesaSeleccionada(numeroMesa);
        setPaso(2); 
    };

    return (
        <div className={styles.mainContainer}>
            {paso === 1 && (
                <MapaMesas 
                    alSeleccionarMesa={manejarSeleccionMesa} 
                />
            )}

            {paso === 2 && (
                <CartaProductos 
                    mesa={mesaSeleccionada} 
                    alVolver={() => setPaso(1)} 
                />
            )}
        </div>
    );
};

export default TerminalCamarero;