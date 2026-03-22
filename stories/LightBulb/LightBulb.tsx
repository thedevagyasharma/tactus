'use client';

import { useEffect, useRef } from 'react';
import styles from './LightBulb.module.css';

export interface LightBulbProps {
    value: number;
    label?: string;
}

export const LightBulb = ({ value, label = '' }: LightBulbProps) => {
    const lightBulbRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (lightBulbRef.current) {
            const size = 8 + (value * 47); // Maps 0-1 to 16-110px
            lightBulbRef.current.style.width = `${size}px`;
            lightBulbRef.current.style.height = `${size}px`;
        }
    }, [value]);

    return (
        <div className={styles.lightBulbWithLabel}>
            <div className={styles.lightBulbWrapper} role="img" aria-label={label}>
                <div ref={lightBulbRef} className={styles.lightBulb}></div>
                <div className={styles.pattern}></div>
            </div>
            {label && <div className={styles.lightBulbLabel}>{label}</div>}
        </div>
    );
};
