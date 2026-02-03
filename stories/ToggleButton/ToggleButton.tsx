'use client';
import { useState, useRef } from 'react';
import styles from './ToggleButton.module.css';

interface ToggleButtonProps {
    label: string;
    onChange?: (value: number) => void;
    size?: number;
}

export const ToggleButton = ({ label = 'Toggle', onChange, size = 1 }: ToggleButtonProps) => {

    const [state, setState] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    function handleClick() {
        const currState = state;
        setState(!currState);
        if (audioRef.current) {
            audioRef.current.src = currState ? '/toggle-off.ogg' : '/toggle-on.ogg';
            audioRef.current.play().catch(err => console.error('Audio playback failed:', err));
        }
        setTimeout(() => {
            onChange?.(!currState ? 1 : 0);
        }, 300)
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
        }
    }

    return (
        <>
            <div className={`${styles.toggleButtonWrapper} ${state ? styles.active : ''}`}
                onClick={handleClick}
                onKeyDown={handleKeyDown}
                role="switch"
                aria-checked={state}
                aria-label={label}
                tabIndex={0}
                style={{ '--size': size } as React.CSSProperties}
            >
                <div className={styles.toggleButtonTrack}>
                    <div className={styles.orangeLine}></div>
                    {/* <div className={styles.blackLine}></div> */}
                    <div className={styles.toggleButtonHandle}></div>
                </div>
            </div>
            <audio ref={audioRef} preload="auto" />
        </>
    );
}