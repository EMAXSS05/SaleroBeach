import React from 'react';
import { FaHome, FaHistory, FaUsers, FaGlassMartiniAlt, FaTable } from 'react-icons/fa';
import logoImg from '../.././assets/logoSalero.png'; 
import styles from './Sidebar.module.css';

const Sidebar = ({ seccionActiva, setSeccionActiva }) => {
    const menuItems = [
        { id: 'HOME',name: 'HOME', icon: <FaHome />, active: true },
        { id: 'ORDER HISTORY',name: 'ORDER HISTORY', icon: <FaHistory /> },
        { id: 'TABLES',name: 'TABLES', icon: <FaTable /> },
        { id:'USERS', name:'USERS', icon: <FaUsers /> },
        { id:'PRODUCTS',name: 'PRODUCTS', icon: <FaGlassMartiniAlt /> },
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
                        className={`${styles.menuItem} ${seccionActiva === item.id ? styles.menuItemActive : ''}`}
                        onClick={() => setSeccionActiva(item.id)}
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