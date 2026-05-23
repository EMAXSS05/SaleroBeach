import React, { useState } from 'react';
import styles from './Login.module.css';

const Login = ({ onLoginSuccess }) => {
    const [credenciales, setCredenciales] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);

    const handleChange = (e) => {
        setCredenciales({
            ...credenciales,
            [e.target.name]: e.target.value
        });
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);
        setError('');
        setCargando(true);

        try {
            const respuesta = await fetch(`${import.meta.env.VITE_API_URL}/api/usuarios/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credenciales)
            });
            console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);

            const datos = await respuesta.json();

            if (respuesta.ok) {
                localStorage.setItem('token', datos.token);
                localStorage.setItem('usuario', JSON.stringify(datos.usuario));
                onLoginSuccess(datos.usuario);
            } else {
                // Login fallido: mostramos el mensaje del servidor
                setError(datos.mensaje || 'Error al iniciar sesión');
            }
        } catch (err) {
            console.error("Error en login:", err);
            setError('No se pudo conectar con el servidor');
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className={styles.loginContainer}>
            <form className={styles.loginForm} onSubmit={handleSubmit}>
                {/* El Logo 'S' de Salero Beach */}
                <div className={styles.logo}>S</div>

                <p className={styles.subtitle}>Utilice los datos proporcionados por el administrador de su cuenta.</p>

                <div className={styles.inputGroup}>
                    <label htmlFor="username">Nombre Usuario</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={credenciales.username}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="password">Contraseña</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={credenciales.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                {error && <p className={styles.errorMessage}>{error}</p>}

                <button type="submit" className={styles.loginBtn} disabled={cargando}>
                    {cargando ? 'Conectando...' : 'Iniciar sesión'}
                </button>
            </form>
        </div>
    );
};

export default Login;