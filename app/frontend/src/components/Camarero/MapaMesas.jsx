import React, { useState, useEffect } from 'react';
import styles from './MapaMesas.module.css';
import iconoInterior from '../../assets/iconos/interior.png';
import iconoTerraza from '../../assets/iconos/terraza.png';

const MapaMesas = ({ alSeleccionarMesa }) => {
    const [mesas, setMesas] = useState([]);
    const [terrazaAbierta, setTerrazaAbierta] = useState(true);
    const [interiorAbierto, setInteriorAbierto] = useState(true);

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

    const mesasTerraza = mesas.filter(m => m.zona === 'Terraza');
    const mesasInterior = mesas.filter(m => m.zona === 'Interior');

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
                        {/* Círculo con la inicial */}
                        <div className={styles.userAvatar}>
                            J
                        </div>

                        <button className={styles.iconButton} onClick={cerrarSesion}>
                            <span className="material-icons">logout</span>
                        </button>
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
                        {mesasTerraza.map(mesa => (
                            <div
                                key={mesa._id}
                                className={`${styles.mesaCard} ${mesa.estado === 'ocupada' ? styles.ocupada : styles.libre}`}
                                onClick={() => alSeleccionarMesa(mesa.numero)}
                            >
                                <span className={styles.numeroMesa}>{mesa.numero}</span>
                                <span className={styles.estadoTexto}>{mesa.estado.toUpperCase()}</span>
                            </div>
                        ))}
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
                        {mesasInterior.map(mesa => (
                            <div
                                key={mesa._id}
                                className={`${styles.mesaCard} ${mesa.estado === 'ocupada' ? styles.ocupada : styles.libre}`}
                                onClick={() => alSeleccionarMesa(mesa.numero)}
                            >
                                <span className={styles.numeroMesa}>{mesa.numero}</span>
                                <span className={styles.estadoTexto}>{mesa.estado.toUpperCase()}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MapaMesas; 