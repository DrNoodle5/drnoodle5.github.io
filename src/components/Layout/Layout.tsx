import React from 'react';
import type { ReactNode } from 'react';
import styles from './Layout.module.css';

interface LayoutProps {
    children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className={styles.container}>
            {/* Background layer for RISK simulation / effects */}
            <div className={styles.background} id="background-layer">
                {/* Simulation component will be mounted here */}
            </div>

            {/* Main content layer (Graph + Overlays) */}
            <main className={styles.main}>
                {children}
            </main>

            {/* UI Overlay layer (HUD, Navigation controls) */}
            <div className={styles.uiLevel} id="ui-layer">
                {/* Global UI elements */}
            </div>
        </div>
    );
};
