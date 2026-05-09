import React, { useState, useEffect } from 'react';
import MapaMesas from './MapaMesas';
import DetalleMesa from './DetalleMesa';
import styles from './TerminalCamarero.module.css';

const TerminalCamarero = ({usuario}) => {
    console.log("Usuario recibido en TerminalCamarero:", usuario);
    const [mesaSeleccionada, setMesaSeleccionada] = useState(null);
    const [pedidosActivos, setPedidosActivos] = useState({});
    const [modoUnion, setModoUnion] = useState(false);
    const [mesasParaJuntar, setMesasParaJuntar] = useState([]);
    const [mesasListas, setMesasListas] = useState([]);

    useEffect(() => {
        const sincronizarMesas = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/pedidos');
                const pedidosDB = await res.json();

                const pedidosSoloActivos = pedidosDB.filter(p => p.estadoGeneral === 'en_curso' || p.estadoGeneral === 'preparado');


                const nuevoEstadoMesas = {};
                pedidosSoloActivos.forEach(p => {
                    if (p.mesas && Array.isArray(p.mesas)) {
                        p.mesas.forEach(numMesa => {
                            nuevoEstadoMesas[numMesa] = {
                                items: p.items,
                                comensales: p.comensales || 1,
                                dbId: p._id,
                                mesasDelPedido: p.mesas
                            };
                        });
                    }
                });
                // Detecta qué mesas tienen pedido en estado 'preparado'
                const listas = pedidosSoloActivos
                    .filter(p => p.estadoGeneral === 'preparado')
                    .flatMap(p => p.mesas);
                setMesasListas(listas);

                setPedidosActivos(prev => {
                    if (mesaSeleccionada) {
                        const mesaLocal = prev[mesaSeleccionada];
                        return {
                            ...nuevoEstadoMesas,
                            ...(mesaLocal ? { [mesaSeleccionada]: mesaLocal } : {})
                        };
                    }
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

     /**
     * Añade un item al pedido de una mesa
     */
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
    const enviarPedidoFinalABaseDeDatos = async (numMesa, alerta) => {
        const pedido = pedidosActivos[numMesa];
        console.log("dbId del pedido:", pedido?.dbId);
        if (!pedido || pedido.items.length === 0) return;

        const arrayMesas = String(numMesa).includes('+')
            ? numMesa.split('+')
            : [String(numMesa)];

        const total = pedido.items.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
        
        try {
            let res;
            if (pedido.dbId) {
            res = await fetch(`http://localhost:5000/api/pedidos/${pedido.dbId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: pedido.items,
                    total,
                    estadoGeneral: 'en_curso'
                })
            });
        } else{
              res = await fetch('http://localhost:5000/api/pedidos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mesas: arrayMesas,
                    camarero: usuario?.nombreReal?.trim() || usuario?.username || "Camarero",
                    items: pedido.items,
                    alertas: alerta,
                    total,
                    estadoGeneral: 'en_curso'
                })
            });
        }
        

            if (res.ok) {
                setPedidosActivos(prev => {
                    const nuevo = { ...prev };
                    delete nuevo[numMesa];
                    return nuevo;
                });
                alert("¡Pedido enviado a cocina!");
                setMesaSeleccionada(null);
            } else {
                const errorData = await res.json();
                console.error("Error del servidor:", errorData);
                alert("Error al guardar en base de datos");
            }
        } catch (error) {
            console.error("Error enviando pedido:", error);
            alert("No hay conexión con el servidor");
        }
    };

   /**
     * Elimina o reduce la cantidad de un item del pedido
     */
    const eliminarItemDelPedido = (numMesa, nombreItem, notaItem) => {
        setPedidosActivos(prev => {
            const pedidoActual = prev[numMesa];
            if (!pedidoActual) return prev;
            const nuevosItems = [...pedidoActual.items];
            const index = nuevosItems.findIndex(
                i => i.nombre === nombreItem && i.nota === notaItem
            );

            if (index !== -1) {
                if (nuevosItems[index].cantidad > 1) {
                    nuevosItems[index] = {
                        ...nuevosItems[index],
                        cantidad: nuevosItems[index].cantidad - 1
                    };
                } else {

                    nuevosItems.splice(index, 1);
                }

                return {
                    ...prev,
                    [numMesa]: { ...pedidoActual, items: nuevosItems }
                };
            }
            return prev;
        });
    };

    const manejarSeleccionMesa = (numMesa) => {
        if (modoUnion) {
            setMesasParaJuntar(prev =>
                prev.includes(numMesa)
                    ? prev.filter(m => m !== numMesa)
                    : [...prev, numMesa]
            );
        } else {
            setMesaSeleccionada(numMesa);
            if (!pedidosActivos[numMesa]) {
                setPedidosActivos(prev => ({
                    ...prev,
                    [numMesa]: { items: [], comensales: 1 }
                }));
            }
        }
    };
    /**
     * Confirma la unión de mesas seleccionadas
     */
    const confirmarUnion = () => {
        if (mesasParaJuntar.length < 2) return alert("Selecciona al menos 2 mesas");
        const nombreUnido = mesasParaJuntar.join('+');

        setMesaSeleccionada(nombreUnido);
        setPedidosActivos(prev => ({
            ...prev,
            [nombreUnido]: { items: [], comensales: 1 }
        }));

        setModoUnion(false);
        setMesasParaJuntar([]);
    };

    return (
        <div className={styles.mainContainer}>
            {!mesaSeleccionada ? (
                <>

                    <MapaMesas
                        alSeleccionarMesa={manejarSeleccionMesa}
                        pedidos={pedidosActivos}
                        mesasSeleccionadasParaUnion={mesasParaJuntar}
                        usuario={usuario}
                        mesasListas={mesasListas}
                        botonesUnion={
                            <div className={styles.unionControls}>
                                <button
                                    className={modoUnion ? styles.btnCancel : styles.btnUnion}
                                    onClick={() => { setModoUnion(!modoUnion); setMesasParaJuntar([]); }}
                                >
                                    {modoUnion ? '✕' : '🔗'}
                                </button>
                                {modoUnion && (
                                    <button
                                        className={styles.btnConfirmar}
                                        onClick={confirmarUnion}
                                        disabled={mesasParaJuntar.length < 2}
                                    >
                                        ✓ ({mesasParaJuntar.length})
                                    </button>
                                )}
                            </div>
                        }
                    />
                </>
            ) : (
                /* Si HAY mesa seleccionada, mostramos el DETALLE */
                <DetalleMesa
                    mesa={mesaSeleccionada}
                    pedido={pedidosActivos[mesaSeleccionada]}
                    alVolver={() => setMesaSeleccionada(null)}
                    alConfirmarPedido={(item) => confirmarPedidoFinal(mesaSeleccionada, item)}
                    alEnviarA_Cocina={(textoAlerta) => enviarPedidoFinalABaseDeDatos(mesaSeleccionada, textoAlerta)}
                    alEliminarItem={(nombre, nota) => eliminarItemDelPedido(mesaSeleccionada, nombre, nota)}
                />
            )}
        </div>
    );
};

export default TerminalCamarero;