import React from 'react';
import { MdLogout } from 'react-icons/md'; 
import styles from './Header.module.css';

const Header = () => {
    return (
        <header className={styles.header}>
            <div className={styles.spacer}></div>
            
            <div className={styles.userSection}>
                <div className={styles.userInfo}>
                    <span className={styles.userName}>Staff_Barra</span>
                    <span className={styles.userRole}>Admin</span>
                </div>
                <div className={styles.userAvatar}>SB</div>
                
                <button className={styles.logoutBtn} title="Cerrar sesión">
                    <MdLogout />
                </button>
            </div>
        </header>
    );
};

export default Header;