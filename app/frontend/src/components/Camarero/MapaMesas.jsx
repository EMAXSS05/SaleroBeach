import React, { useState, useEffect } from 'react';
import styles from './MapaMesas.module.css';
import iconoInterior from '../../assets/iconos/interior.png';
import iconoTerraza from '../../assets/iconos/terraza.png';

const MapaMesas = ({ alSeleccionarMesa, pedidos }) => {
    const [mesas, setMesas] = useState([]);
    const [terrazaAbierta, setTerrazaAbierta] = useState(true);
    const [interiorAbierto, setInteriorAbierto] = useState(true);
    // Función para saber si una mesa tiene pedido real
    const estaOcupada = (numeroMesa) => {
        // Si existe el objeto y tiene items, está ocupada
        return pedidos && pedidos[numeroMesa] && pedidos[numeroMesa].items.length > 0;
    };

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
    const mesasActivas = mesas.filter(m => m.activa !== false);


    const mesasTerraza = mesasActivas.filter(m => m.zona === 'Terraza');
    const mesasInterior = mesasActivas.filter(m => m.zona === 'Interior');
    const [menuAbierto, setMenuAbierto] = useState(false);

    const cerrarSesion = () => {
        console.log("Cerrando sesión...");
        if (confirm("¿Estás seguro de que quieres salir?")) {
            window.location.reload();
        }
    };

    return (
       <div className={styles.container}>
        <div className={styles.header}>
            <div className={styles.headerTop}>
                <h1>Salero <span className={styles.orangeText}>Beach</span></h1>

                <div className={styles.userControls}>
                    {/* Contenedor del menú relativo */}
                    <div className={styles.menuWrapper}>
                        <div 
                            className={styles.userAvatar} 
                            onClick={() => setMenuAbierto(!menuAbierto)}
                        >
                            J
                        </div>

                        {/* El menú desplegable */}
                        {menuAbierto && (
                            <div className={styles.dropdownMenu}>
                                <div className={styles.userInfo}>
                                    <span className={styles.userName}>Juan Pérez</span>
                                    <span className={styles.userRole}>Camarero</span>
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
                            const ocupada = estaOcupada(mesa.numero);
                            return (
                                <div
                                    key={mesa._id}
                                    className={`${styles.mesaCard} ${ocupada ? styles.ocupada : styles.libre}`}
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

                            return (
                                <div
                                    key={mesa._id}
                                    className={`${styles.mesaCard} ${ocupada ? styles.ocupada : styles.libre}`}
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