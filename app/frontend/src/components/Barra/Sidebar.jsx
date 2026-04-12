import React from 'react';
import { FaHome, FaHistory, FaUsers, FaGlassMartiniAlt, FaTable } from 'react-icons/fa';
import logoImg from '../.././assets/logoSalero.png'; 
import styles from './Sidebar.module.css';

const Sidebar = () => {
    const menuItems = [
        { name: 'HOME', icon: <FaHome />, active: true },
        { name: 'ORDER HISTORY', icon: <FaHistory /> },
        { name: 'TABLES', icon: <FaTable /> },
        { name: 'USERS', icon: <FaUsers /> },
        { name: 'PRODUCTS', icon: <FaGlassMartiniAlt /> },
    ];

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logoContainer}>
                <img src={logoImg} alt="Logo" className={styles.logo} />
            </div>

            <nav className={styles.nav}>
                {menuItems.map((item, index) => (
                    <div 
                        key={index} 
                        className={`${styles.menuItem} ${item.active ? styles.menuItemActive : ''}`}
                    >
                        <div className={styles.icon}>{item.icon}</div>
                        {item.name}
                    </div>
                ))}
            </nav>

            <div className={styles.statusContainer}>
                <div className={styles.statusOnline}></div>
                Restaurant Open
            </div>
        </aside>
    );
};

export default Sidebar;