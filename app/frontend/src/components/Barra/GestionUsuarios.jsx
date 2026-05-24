import React, { useState, useEffect } from 'react';
import styles from './GestionUsuarios.module.css';
import iconoRestablecerContra from '../../assets/iconos/restablecer-contra.png'

const GestionUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [nuevoUsuario, setNuevoUsuario] = useState({
        username: '',
        password: '',
        nombreReal: '',
        rol: 'camarero'
    });
    // Estado para controlar qué usuario está siendo editado y la nueva contraseña
    const [editandoId, setEditandoId] = useState(null);
    const [nuevaPassword, setNuevaPassword] = useState('');

    const obtenerUsuarios = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/usuarios`);
            const data = await res.json();
            setUsuarios(data);
        } catch (error) {
            console.error("Error al obtener usuarios:", error);
        }
    };

    useEffect(() => { obtenerUsuarios(); }, []);
   // Cuando el formulario se envía, mando los datos del nuevo usuario al backend
    const handleCrear = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/usuarios`, {
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
            await fetch(`${import.meta.env.VITE_API_URL}/api/usuarios/${id}`, { method: 'DELETE' });
            obtenerUsuarios();
        }
    };
     // Aquí se envia la nueva contraseña al backend, que se encargará de encriptarla con bcrypt
    const cambiarPassword = async (id) => {
        if (!nuevaPassword.trim()) return alert("Escribe una contraseña nueva");
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/usuarios/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: nuevaPassword })
            });
            if (res.ok) {
                setEditandoId(null);
                setNuevaPassword('');
                alert("Contraseña actualizada correctamente");
            } else {
                alert("Error al actualizar la contraseña");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };


    return (
        <div className={styles.container}>
            <h1 className={styles.title}>GESTIÓN DE PERSONAL</h1>

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
                        <th>Fecha Alta</th>
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
                            {/* Muestra la fecha de alta formateada en español */}
                            <td>{new Date(u.fechaAlta).toLocaleDateString('es-ES')}</td>
                            <td>
                                <div className={styles.actions}>
                                    {/* Si estoy editando este usuario muestro el input de nueva contraseña */}
                                    {editandoId === u._id ? (
                                        <>
                                            <input
                                                type="password"
                                                placeholder="Nueva contraseña"
                                                value={nuevaPassword}
                                                onChange={(e) => setNuevaPassword(e.target.value)}
                                                className={styles.inputPassword}
                                            />
                                            <button
                                                className={styles.btnSave}
                                                onClick={() => cambiarPassword(u._id)}
                                            >
                                                Guardar
                                            </button>
                                            <button
                                                className={styles.btnCancel}
                                                onClick={() => { setEditandoId(null); setNuevaPassword(''); }}
                                            >
                                                Cancelar
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                className={styles.btnEdit}
                                                onClick={() => setEditandoId(u._id)}
                                            >
                                               <img src={iconoRestablecerContra} width={22}/>
                                            </button>
                                            <button
                                                className={styles.btnDelete}
                                                onClick={() => eliminarUsuario(u._id, u.username)}
                                            >
                                                Eliminar
                                            </button>
                                        </>)}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default GestionUsuarios;