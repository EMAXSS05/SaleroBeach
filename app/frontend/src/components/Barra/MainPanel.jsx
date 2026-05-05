import React, { useState, useEffect } from 'react';
import Header from './Header';
import PedidoCard from './PedidoCard';
import styles from './MainPanel.module.css';
import HistorialPedidos from './HistorialPedidos';
import GestionUsuarios from './GestionUsuarios';
import ConfiguracionMesas from './ConfiguracionMesas';

const MainPanel = ({ seccionActiva }) => {
    // Aquí se guardarám los pedidos que vengan de la base de datos
    const [pedidos, setPedidos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [filtroSeleccionado, setFiltroSeleccionado] = useState(null);

    const [historial, setHistorial] = useState([]);
    const pedidosFiltrados = filtroSeleccionado
        ? pedidos.filter(p => p._id === filtroSeleccionado)
        : pedidos;


    // Función para ir a buscar los pedidos al servidor
    const obtenerPedidos = async () => {
        try {
            const respuesta = await fetch('http://localhost:5000/api/pedidos');
            const datos = await respuesta.json();
            console.log("Datos brutos de la DB:", datos);
            console.log("Estados únicos:", [...new Set(datos.map(p => p.estadoGeneral))]);
            const pendientes = datos.filter(p => p.estadoGeneral === 'pendiente' ||
                p.estadoGeneral === 'preparado' ||
                p.estadoGeneral === 'en_curso');
            const historico = datos.filter(p =>
                p.estadoGeneral === 'finalizado' || p.estadoGeneral === 'cancelado'
            );
            console.log("Pendientes:", pendientes.length, "Finalizados:", historico.length);
            setPedidos(pendientes);
            setHistorial(historico)
            setCargando(false);
        } catch (error) {
            console.error("Error al traer pedidos:", error);
            setCargando(false);
        }
    };



    useEffect(() => {
        obtenerPedidos();
        const intervalo = setInterval(obtenerPedidos, 5000);
        return () => clearInterval(intervalo);
    }, []);

    // Función para cambiar el estado del pedido
    const actualizarEstadoPedido = async (id, nuevoEstado) => {
        try {
            const respuesta = await fetch(`http://localhost:5000/api/pedidos/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ estadoGeneral: nuevoEstado, metodoPago })
            });

            if (respuesta.ok) {
                obtenerPedidos();
                if (filtroSeleccionado === id) setFiltroSeleccionado(null);
            } else {
                console.error("No se pudo actualizar el pedido");
            }
        } catch (error) {
            console.error("Error en la petición:", error);
        }
    };

    //muestra la seccion que está activa
    const renderContent = () => {
        switch (seccionActiva) {
            case 'ORDER HISTORY':
                return <HistorialPedidos pedidosFinalizados={historial} />;

            case 'TABLES':
                return <ConfiguracionMesas />;

            case 'USERS':
                return <GestionUsuarios />;

            case 'HOME':
            default:
                return (
                    <>
                        <h1 className={styles.title}>POS - CASH REGISTER</h1>

                        <div className={styles.filterBar}>
                            <button
                                className={`${styles.filterBtn} ${!filtroSeleccionado ? styles.active : ''}`}
                                onClick={() => setFiltroSeleccionado(null)}
                            >
                                All
                            </button>
                            {pedidos.map(p => (
                                <button
                                    key={p._id}
                                    className={`${styles.filterBtn} ${filtroSeleccionado === p._id ? styles.active : ''}`}
                                    onClick={() => setFiltroSeleccionado(p._id)}
                                >
                                    #{p._id.slice(-3)}
                                </button>
                            ))}
                        </div>

                        {cargando ? (
                            <p style={{ color: '#a1a6b4' }}>Cargando comandas...</p>
                        ) : (
                            <div className={styles.ordersGrid}>
                                {pedidosFiltrados.map((pedido) => (
                                    <PedidoCard
                                        key={pedido._id}
                                        pedido={pedido}
                                        onCobrar={() => actualizarEstadoPedido(pedido._id, 'finalizado',metodoPago)}
                                        onCancelar={() => actualizarEstadoPedido(pedido._id, 'cancelado')}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                );
        }
    };

    return (
        <div className={styles.mainContainer}>
            <Header />
            <div className={styles.content}>
                {renderContent()}
            </div>
        </div>
    );
};

export default MainPanel;