import React from 'react';
import { MdLogout } from 'react-icons/md'; 
import styles from './Header.module.css';

const Header = ({usuario,onCerrarSesion}) => {
    return (
        <header className={styles.header}>
            <div className={styles.spacer}></div>
            
            <div className={styles.userSection}>
                <div className={styles.userInfo}>
                    <span className={styles.userName}>{usuario?.nombreReal || usuario?.userName || 'Usuario'}</span>
                    <span className={styles.userRole}>{usuario?.rol || 'Admin'}</span>
                </div>
                <div className={styles.userAvatar}>
                    {usuario?.nombreReal?.charAt(0).toUpperCase() || 'S'}
                </div>
                
                <button className={styles.logoutBtn} title="Cerrar sesión" onClick={onCerrarSesion}>
                    <MdLogout />
                </button>
            </div>
        </header>
    );
};

export default Header;