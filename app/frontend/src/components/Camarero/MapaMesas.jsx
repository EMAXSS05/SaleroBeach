import React, { useState, useEffect } from 'react';
import styles from './MapaMesas.module.css';
import iconoInterior from '../../assets/iconos/interior.png';
import iconoTerraza from '../../assets/iconos/terraza.png';

const MapaMesas = ({ alSeleccionarMesa, pedidos, mesasSeleccionadasParaUnion = [], botonesUnion, mesasListas = [],usuario}) => {
     console.log("Usuario recibido en MapaMesas:", usuario);
    const [mesas, setMesas] = useState([]);
    const [terrazaAbierta, setTerrazaAbierta] = useState(true);
    const [interiorAbierto, setInteriorAbierto] = useState(true);
    const estaOcupada = (numeroMesa) => {
        if (!pedidos) return false;

        return pedidos[String(numeroMesa)] ? true : false;
    };
    // Al montar el componente, obtiene la lista de mesas desde la API y las guarda en el estado
    useEffect(() => {
        const obtenerMesas = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/mesas');
                const datos = await res.json();
                setMesas(datos);
            } catch (error) {
                console.error("Error al traer mesas:", error);
            }
        };
        obtenerMesas();
    }, []);
    // Filtra las mesas según su estado activo y su zona para mostrarlas en secciones separadas
    const mesasActivas = mesas.filter(m => m.activa !== false).sort((a, b) => Number(a.numero) - Number(b.numero));
    const mesasTerraza = mesasActivas.filter(m => m.zona === 'Terraza');
    const mesasInterior = mesasActivas.filter(m => m.zona === 'Interior');
    const [menuAbierto, setMenuAbierto] = useState(false);
    // Solicita confirmación al usuario antes de recargar la página y cerrar la sesión
    const cerrarSesion = () => {
        console.log("Cerrando sesión...");
        if (confirm("¿Estás seguro de que quieres salir?")) {
            window.location.reload();
        }
    };
    // Renderiza el mapa de mesas dividido en dos secciones (Terraza e Interior),
    // marcando cada mesa como libre u ocupada según los pedidos activos recibidos por props
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerTop}>
                    <h1>Salero <span className={styles.orangeText}>Beach</span></h1>

                    <div className={styles.userControls}>
                        {botonesUnion}
                        {/* Contenedor del menú relativo */}
                        <div className={styles.menuWrapper}>
                            <div
                                className={styles.userAvatar}
                                onClick={() => setMenuAbierto(!menuAbierto)}
                            >
                               {(usuario?.nombreReal || usuario?.username)?.charAt(0).toUpperCase() || 'U'}
                            </div>

                            {/* El menú desplegable */}
                            {menuAbierto && (
                                <div className={styles.dropdownMenu}>
                                    <div className={styles.userInfo}>
                                        <span className={styles.userName}> {usuario?.nombreReal || usuario?.username || 'Usuario'}</span>
                                        <span className={styles.userRole}>{usuario?.rol || 'Camarero'}</span>
                                    </div>
                                    <hr className={styles.divider} />
                                    <button className={styles.logoutBtn} onClick={cerrarSesion}>
                                        <span className="material-icons">logout</span>
                                        Cerrar Sesión
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <p>Panel de Sala</p>
            </div>

            {/* SECCIÓN TERRAZA */}
            <div className={styles.section}>
                <div
                    className={styles.sectionHeader}
                    onClick={() => setTerrazaAbierta(!terrazaAbierta)}
                >
                    <img src={iconoTerraza} alt="iconoTerraza" className={styles.iconoTerraza} />
                    <h3>TERRAZA</h3>
                    <span className={`${styles.arrow} ${terrazaAbierta ? styles.up : styles.down}`}>▼</span>
                </div>

                {terrazaAbierta && (
                    <div className={styles.gridMesas}>
                        {mesasTerraza.map(mesa => {
                            // Comprueba si una mesa tiene un pedido activo buscando su número en el estado de pedidos
                            const ocupada = estaOcupada(mesa.numero);
                            const estaLista = mesasListas.includes(String(mesa.numero));
                            const estaSiendoElegida = mesasSeleccionadasParaUnion.includes(mesa.numero);
                            return (
                                <div
                                    key={mesa._id}
                                    className={`
                ${styles.mesaCard} 
                ${ocupada ? styles.ocupada : styles.libre} 
                ${estaLista ? styles.lista : ''}
                ${estaSiendoElegida ? styles.seleccionadaUnion : ''}
            `}
                                    onClick={() => alSeleccionarMesa(mesa.numero)}
                                >
                                    <span className={styles.numeroMesa}>{mesa.numero}</span>
                                    <span className={styles.estadoTexto}>
                                        {estaLista ? '🔔 LISTO' : ocupada ? 'OCUPADA' : 'LIBRE'}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* SECCIÓN INTERIOR */}
            <div className={styles.section}>
                <div
                    className={styles.sectionHeader}
                    onClick={() => setInteriorAbierto(!interiorAbierto)}
                >
                    <img src={iconoInterior} alt="iconoInterior" className={styles.iconoInterior} />
                    <h3>INTERIOR</h3>
                    <span className={`${styles.arrow} ${interiorAbierto ? styles.up : styles.down}`}>▼</span>
                </div>

                {interiorAbierto && (
                    <div className={styles.gridMesas}>
                        {mesasInterior.map(mesa => {
                            const ocupada = estaOcupada(mesa.numero);
                            const estaSiendoElegida = mesasSeleccionadasParaUnion.includes(mesa.numero);

                            return (
                                <div
                                    key={mesa._id}
                                    className={`
                ${styles.mesaCard} 
                ${ocupada ? styles.ocupada : styles.libre} 
                ${estaSiendoElegida ? styles.seleccionadaUnion : ''}
            `}
                                    onClick={() => alSeleccionarMesa(mesa.numero)}
                                >
                                    <span className={styles.numeroMesa}>{mesa.numero}</span>

                                    <span className={styles.estadoTexto}>
                                        {ocupada ? 'OCUPADA' : 'LIBRE'}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MapaMesas; 