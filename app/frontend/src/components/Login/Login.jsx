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
        setError('');
        setCargando(true);

        try {
            const respuesta = await fetch('http://localhost:5000/api/usuarios/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credenciales)
            });

            const datos = await respuesta.json();

            if (respuesta.ok) {
                // Login correcto: pasamos los datos del usuario al componente padre
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
                
                <p className={styles.subtitle}>Use the details provided by your account administrator.</p>

                <div className={styles.inputGroup}>
                    <label htmlFor="username">Username</label>
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
                    <label htmlFor="password">Password</label>
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
                    {cargando ? 'Connecting...' : 'Login'}
                </button>
            </form>
        </div>
    );
};

export default Login;