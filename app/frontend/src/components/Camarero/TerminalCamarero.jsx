import React, { useState, useEffect } from 'react';
import MapaMesas from './MapaMesas';
import CartaProductos from './CartaProductos';
import DetalleMesa from './DetalleMesa';
import styles from './TerminalCamarero.module.css';

const TerminalCamarero = () => {
    const [paso, setPaso] = useState(1);
    const [mesaSeleccionada, setMesaSeleccionada] = useState(null);
    const [pedidosActivos, setPedidosActivos] = useState({});

    // Al tocar una mesa en el mapa
    const manejarSeleccionMesa = (numMesa) => {
        setMesaSeleccionada(numMesa);
        if (pedidosActivos[numMesa]) {
            setPaso(3);
        } else {
            setPaso(2);
        }
    };

    // Función para guardar el pedido
    const confirmarPedido = (mesa, nuevosItems) => {
        const pedidoExistente = pedidosActivos[mesa]?.items || [];
        setPedidosActivos({
            ...pedidosActivos,
            [mesa]: { items: [...pedidoExistente, ...nuevosItems] }
        });
        setPaso(1); // Volvemos al mapa
    };

    // Función para cobrar y liberar la mesa
    const cobrarMesa = (mesa) => {
        const copiaPedidos = { ...pedidosActivos };
        delete copiaPedidos[mesa];
        setPedidosActivos(copiaPedidos);
        setPaso(1);
    };

    return (
        <div className={styles.mainContainer}>
            {paso === 1 && (
                <MapaMesas
                    alSeleccionarMesa={manejarSeleccionMesa}
                    pedidos={pedidosActivos}
                />
            )}

            {paso === 2 && (
                <CartaProductos
                    mesa={mesaSeleccionada}
                    alVolver={() => setPaso(1)}
                    // actualizamos el estado local aquí para que el detalle funcione
                    alFinalizarPedido={(itemsRecibidos) => {
                        confirmarPedido(mesaSeleccionada, itemsRecibidos);
                    }}
                />
            )}

            {paso === 3 && (
                <DetalleMesa
                    mesa={mesaSeleccionada}
                    pedido={pedidosActivos[mesaSeleccionada]}
                    alAñadir={() => setPaso(2)}
                    alCobrar={() => cobrarMesa(mesaSeleccionada)}
                    alVolver={() => setPaso(1)}
                />
            )}
        </div>
    );
};

export default TerminalCamarero;