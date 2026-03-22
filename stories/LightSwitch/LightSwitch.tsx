'use client';
import { useState, useRef } from 'react';

import styles from './LightSwitch.module.css';

export interface LightSwitchProps {
    label: string;
    initialState?: boolean;
    onChange?: (value: number) => void;
    size?: number;
}

export const LightSwitch = ({ label = 'Light Switch', initialState = false, onChange, size = 1 }: LightSwitchProps) => {
    const [state, setState] = useState(initialState);
    const audioRef = useRef<HTMLAudioElement>(null);

    function handleClick() {
        const currState = state
        setState(!currState);
        if (audioRef.current) {
            audioRef.current.src = currState ? '/switch-off.ogg' : '/switch-on.ogg';
            audioRef.current.play().catch(err => console.error('Audio playback failed:', err));
        }
        setTimeout(() => {
            onChange?.(!currState ? 1 : 0);
        }, 200)
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
        }
    }

    return (
        <>
            <div className={styles.lightSwitchWithLabel}>
                <button
                    onClick={handleClick}
                    role="switch"
                    aria-checked={state}
                    aria-label={label}
                    style={{ '--size': size } as React.CSSProperties}
                    className={`${styles.lightSwitchWrapper} ${state ? styles.active : ''}`}>
                    <div className={`${styles.lightSwitch}`}
                    ></div>
                    <div className={styles.switchLine}></div>
                    <div className={styles.switchIndicator}></div>
                </button>
                <div className={styles.lightSwitchLabel}>{label}</div>
            </div>
            <audio ref={audioRef} preload="auto" />
        </>
    )
};