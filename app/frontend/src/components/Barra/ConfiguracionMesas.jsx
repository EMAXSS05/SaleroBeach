import React, { useState, useEffect } from 'react';
import styles from './ConfiguracionMesas.module.css';

const ConfiguracionMesas = () => {
    const [mesas, setMesas] = useState([]);
    const [nuevaMesa, setNuevaMesa] = useState({ numero: '', zona: 'Terraza', capacidad: 4 });

    const obtenerMesas = async () => {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/mesas`);
        const data = await res.json();
        setMesas(data);
    };

    useEffect(() => { obtenerMesas(); }, []);

    //Crear mesa
    const handleCrear = async (e) => {
        e.preventDefault();
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/mesas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevaMesa)
        });
        if (res.ok) {
        setNuevaMesa({ numero: '', zona: 'Terraza', capacidad: 4 }); 
        obtenerMesas();
    }
    };

    //Toggle Activa/Desactivada
    const toggleActiva = async (id) => {
        await fetch(`${import.meta.env.VITE_API_URL}/api/mesas/${id}/activa`, { method: 'PATCH' });
        obtenerMesas();
    };

    // Eliminar
    const eliminarMesa = async (id, numero) => {
        if (window.confirm(`¿Seguro que quieres eliminar la Mesa ${numero}?`)) {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/mesas/${id}`, { method: 'DELETE' });
            if (res.ok) obtenerMesas();
            else alert("No se pudo eliminar (quizás está ocupada)");
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>GESTIÓN DE MESAS</h1>

            {/* FORMULARIO PARA AÑADIR */}
            <form className={styles.form} onSubmit={handleCrear}>
                <input
                    type="text"
                    placeholder="Nº Mesa"
                    value={nuevaMesa.numero}
                    onChange={(e) => setNuevaMesa({ ...nuevaMesa, numero: e.target.value })}
                    required
                />
                <select
                    value={nuevaMesa.zona}
                    onChange={(e) => setNuevaMesa({ ...nuevaMesa, zona: e.target.value })}
                >
                    <option value="Terraza">Terraza</option>
                    <option value="Interior">Salón</option>
                </select>

                <input
                    type="number"
                    placeholder="Capacidad"
                    min="1"
                    value={nuevaMesa.capacidad}
                    onChange={(e) => setNuevaMesa({ ...nuevaMesa, capacidad: e.target.value })}
                    required
                    style={{ width: '80px' }}
                />
                <button type="submit" className={styles.btnAdd}>+ Añadir Mesa</button>
            </form>

            {/* TABLA DE MESAS */}
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Mesa</th>
                        <th>Zona</th>
                        <th>Capacidad</th>
                        <th>Estado Visible</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {mesas.map(mesa => (
                        <tr key={mesa._id}>
                            <td className={styles.numeroMesa}>Mesa {mesa.numero}</td>
                            <td>{mesa.zona}</td>
                            <td>{mesa.capacidad} pax</td>
                            <td>
                                <span className={mesa.activa ? styles.badgeActive : styles.badgeInactive}>
                                    {mesa.activa ? 'Habilitada' : 'Deshabilitada'}
                                </span>
                            </td>
                            <td>
                                <div className={styles.actions}>
                                    <button
                                        className={styles.btnToggle}
                                        onClick={() => toggleActiva(mesa._id)}
                                    >
                                        {mesa.activa ? 'Desactivar' : 'Activar'}
                                    </button>
                                    <button
                                        className={styles.btnDelete}
                                        onClick={() => eliminarMesa(mesa._id, mesa.numero)}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ConfiguracionMesas;