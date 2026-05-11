import React, { useState } from 'react';
import styles from './ModalAperturaCaja.module.css';
import caja from '../../assets/iconos/caja-registradora.png'

const ModalAperturaCaja = ({ onCajaAbierta }) => {
    const [saldoInicial, setSaldoInicial] = useState('');
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState('');

    const handleAbrir = async () => {
        const saldo = parseFloat(saldoInicial);
        if (isNaN(saldo) || saldo < 0) {
            setError('Introduce un saldo válido (puede ser 0)');
            return;
        }

        setCargando(true);
        setError('');

        try {
            const respuesta = await fetch(`${import.meta.env.VITE_API_URL}/api/caja/abrir`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ saldoInicial: saldo })
            });

            const datos = await respuesta.json();

            if (respuesta.ok) {
                onCajaAbierta(datos.sesion);
            } else {
                setError(datos.error || 'Error al abrir la caja');
            }
        } catch (err) {
            setError('No se pudo conectar con el servidor');
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.iconoCaja}> <img src={caja} width={52}/> </div>
                <h2 className={styles.titulo}>Apertura de Caja</h2>
                <p className={styles.subtitulo}>Introduce el efectivo inicial en caja para comenzar la jornada</p>

                <div className={styles.inputGroup}>
                    <label className={styles.label}>Saldo Inicial</label>
                    <div className={styles.inputWrapper}>
                        <span className={styles.euro}>€</span>
                        <input
                            className={styles.input}
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            value={saldoInicial}
                            onChange={(e) => {
                                setSaldoInicial(e.target.value);
                                if (error) setError('');
                            }}
                            onKeyDown={(e) => e.key === 'Enter' && handleAbrir()}
                            autoFocus
                        />
                    </div>
                </div>

                {error && <p className={styles.error}>{error}</p>}

                <button
                    className={styles.btnAbrir}
                    onClick={handleAbrir}
                    disabled={cargando}
                >
                    {cargando ? 'Abriendo...' : 'Iniciar Jornada'}
                </button>
            </div>
        </div>
    );
};

export default ModalAperturaCaja;
