import React from 'react';
import Header from './Header';
import styles from './MainPanel.module.css';

const MainPanel = () => {
    return (
        <div className={styles.mainContainer}>
            <Header />
            <div className={styles.content}>
                <h1 className={styles.title}>POS - CASH REGISTER</h1>
                <div className={styles.ordersGrid}>
                    <p style={{ color: '#a1a6b4' }}>Esperando pedidos...</p>
                </div>
            </div>
        </div>
    );
};

export default MainPanel;