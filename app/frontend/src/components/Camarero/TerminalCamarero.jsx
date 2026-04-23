import React, { useState, useEffect } from 'react';
import MapaMesas from './MapaMesas';
import DetalleMesa from './DetalleMesa';
import styles from './TerminalCamarero.module.css';

const TerminalCamarero = () => {
    const [mesaSeleccionada, setMesaSeleccionada] = useState(null);
    const [pedidosActivos, setPedidosActivos] = useState({});

    useEffect(() => {
        const sincronizarMesas = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/pedidos');
                const pedidosDB = await res.json();

                const pedidosSoloActivos = pedidosDB.filter(p => p.estadoGeneral === 'en_curso');

                const nuevoEstadoMesas = {};
                pedidosSoloActivos.forEach(p => {
                    nuevoEstadoMesas[p.mesa] = {
                        items: p.items,
                        comensales: p.comensales || 1,
                        dbId: p._id
                    };
                });

                setPedidosActivos(prev => {
                    if (mesaSeleccionada) {
                        // Mantenemos los datos locales de esa mesa para que no se borren
                        return {
                            ...nuevoEstadoMesas,
                            [mesaSeleccionada]: prev[mesaSeleccionada]
                        };
                    }
                    // Si no hay ninguna mesa abierta, actualizamos todo normal
                    return nuevoEstadoMesas;
                });

            } catch (error) {
                console.error("Error sincronizando mesas:", error);
            }
        };

        sincronizarMesas();
        const intervalo = setInterval(sincronizarMesas, 5000);
        return () => clearInterval(intervalo);
    }, [mesaSeleccionada]);
    // Manejar selección de mesa
    const manejarSeleccionMesa = (numMesa) => {
        setMesaSeleccionada(numMesa);
        if (!pedidosActivos[numMesa]) {
            setPedidosActivos(prev => ({
                ...prev,
                [numMesa]: { items: [], comensales: 1 }
            }));
        }
    };

    // Añadir items al pedido 
    const confirmarPedidoFinal = (mesa, nuevoItem) => {
        setPedidosActivos(prev => {
            const pedidoPrevio = prev[mesa] || { items: [], comensales: 1 };
            return {
                ...prev,
                [mesa]: {
                    ...pedidoPrevio,
                    items: [...pedidoPrevio.items, nuevoItem]
                }
            };
        });
    };

    // ENVIAR A LA DB 
    const enviarPedidoFinalABaseDeDatos = async (numMesa) => {
        const pedido = pedidosActivos[numMesa];
        if (!pedido || pedido.items.length === 0) return;

        try {
            const res = await fetch('http://localhost:5000/api/pedidos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mesa: numMesa,
                    camarero: "Juan",
                    items: pedido.items,
                    total: pedido.items.reduce((acc, item) => acc + (item.precio * item.cantidad), 0),
                    estadoGeneral: 'en_curso'
                })
            });

            if (res.ok) {
                alert("¡Pedido enviado a cocina!");
                setMesaSeleccionada(null); // Cerramos el detalle
            } else {
                alert("Error al guardar en base de datos");
            }
        } catch (error) {
            console.error("Error enviando pedido:", error);
            alert("No hay conexión con el servidor");
        }
    };

    // Cobrar y limpiar
    const cobrarMesa = (mesa) => {
        const copia = { ...pedidosActivos };
        delete copia[mesa];
        setPedidosActivos(copia);
        setMesaSeleccionada(null);
    };

    return (
        <div className={styles.mainContainer}>
            {!mesaSeleccionada ? (
                <MapaMesas
                    alSeleccionarMesa={manejarSeleccionMesa}
                    pedidos={pedidosActivos}
                />
            ) : (
                <DetalleMesa
                    mesa={mesaSeleccionada}
                    pedido={pedidosActivos[mesaSeleccionada]}
                    alVolver={() => setMesaSeleccionada(null)}
                    alConfirmarPedido={(item) => confirmarPedidoFinal(mesaSeleccionada, item)}
                    alEnviarA_Cocina={() => enviarPedidoFinalABaseDeDatos(mesaSeleccionada)}
                    alCobrar={() => cobrarMesa(mesaSeleccionada)}
                />
            )}
        </div>
    );
};

export default TerminalCamarero;