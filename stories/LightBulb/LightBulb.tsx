'use client';

import { useEffect, useRef } from 'react';
import styles from './LightBulb.module.css';

export interface LightBulbProps {
    value: number;
}

export const LightBulb = ({ value }: LightBulbProps) => {
    const lightBulbRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (lightBulbRef.current) {
            const size = 8 + (value * 47); // Maps 0-1 to 16-110px
            lightBulbRef.current.style.width = `${size}px`;
            lightBulbRef.current.style.height = `${size}px`;
        }
    }, [value]);

    return (
        <div className={styles.lightBulbWrapper}>
            <div ref={lightBulbRef} className={styles.lightBulb}></div>
            <div className={styles.pattern}></div>
        </div>
    );
};