import React, { useState, useEffect } from 'react';
import styles from './GestionUsuarios.module.css';

const GestionUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [nuevoUsuario, setNuevoUsuario] = useState({
        username: '',
        password: '',
        nombreReal: '',
        rol: 'camarero'
    });

    const obtenerUsuarios = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/usuarios');
            const data = await res.json();
            setUsuarios(data);
        } catch (error) {
            console.error("Error al obtener usuarios:", error);
        }
    };

    useEffect(() => { obtenerUsuarios(); }, []);

    const handleCrear = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/usuarios', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoUsuario)
            });
            if (res.ok) {
                setNuevoUsuario({ username: '', password: '', nombreReal: '', rol: 'camarero' });
                obtenerUsuarios();
            } else {
                alert("Error al crear usuario (quizás el username ya existe)");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const eliminarUsuario = async (id, nombre) => {
        if (window.confirm(`¿Seguro que quieres eliminar a ${nombre}?`)) {
            await fetch(`http://localhost:5000/api/usuarios/${id}`, { method: 'DELETE' });
            obtenerUsuarios();
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>PERSONNEL MANAGEMENT</h1>

            {/* FORMULARIO SUPERIOR */}
            <form className={styles.form} onSubmit={handleCrear}>
                <input 
                    type="text" 
                    placeholder="Usuario (Login)" 
                    value={nuevoUsuario.username}
                    onChange={(e) => setNuevoUsuario({...nuevoUsuario, username: e.target.value})}
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Contraseña" 
                    value={nuevoUsuario.password}
                    onChange={(e) => setNuevoUsuario({...nuevoUsuario, password: e.target.value})}
                    required 
                />
                <input 
                    type="text" 
                    placeholder="Nombre Real" 
                    value={nuevoUsuario.nombreReal}
                    onChange={(e) => setNuevoUsuario({...nuevoUsuario, nombreReal: e.target.value})}
                />
                <select 
                    value={nuevoUsuario.rol} 
                    onChange={(e) => setNuevoUsuario({...nuevoUsuario, rol: e.target.value})}
                >
                    <option value="camarero">Camarero</option>
                    <option value="barra">Barra (Admin)</option>
                    <option value="cocina">Cocina</option>
                </select>
                <button type="submit" className={styles.btnAdd}>+ Crear Usuario</button>
            </form>

            {/* TABLA DE USUARIOS */}
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Username</th>
                        <th>Rol</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map(u => (
                        <tr key={u._id}>
                            <td className={styles.nombreReal}>{u.nombreReal || '---'}</td>
                            <td>@{u.username}</td>
                            <td>
                                <span className={`${styles.badge} ${styles[u.rol]}`}>
                                    {u.rol.toUpperCase()}
                                </span>
                            </td>
                            <td>
                                <button 
                                    className={styles.btnDelete}
                                    onClick={() => eliminarUsuario(u._id, u.username)}
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default GestionUsuarios;