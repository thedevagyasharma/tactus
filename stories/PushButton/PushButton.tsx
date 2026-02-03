'use client';
import { useState } from 'react';
import styles from './PushButton.module.css';

export interface PushButtonProps {
    onChange?: (value: number) => void;
    size?: number;
}

export const PushButton = ({ onChange, size = 1 }: PushButtonProps) => {
    const [isEnabled, setIsEnabled] = useState(false);
    const [isPressed, setIsPressed] = useState(false);
    const [isReleasing, setIsReleasing] = useState(false);
    const [isKeyPressed, setIsKeyPressed] = useState(false);

    function playSound(filename: string) {
        const audio = new Audio(filename);
        audio.play();
    }

    function handleMouseDown() {
        if (isReleasing) return;

        setIsPressed(true);

        if (!isEnabled) {
            // Turning ON
            setIsEnabled(true);
            playSound('/1.ogg');
            onChange?.(1);
        } else {
            // Turning OFF
            setIsEnabled(false);
            playSound('/2.ogg');
            onChange?.(0);
        }
    }

    function handleMouseUp() {
        if (!isPressed || isReleasing) return;

        setIsReleasing(true);
        setTimeout(() => {
            setIsPressed(false);
            setIsReleasing(false);
            if (isEnabled) {
                playSound('/2.ogg');
            } else {
                playSound('/1.ogg');
            }
        }, 100);
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            if (!isKeyPressed) {
                setIsKeyPressed(true);
                handleMouseDown();
            }
        }
    }

    function handleKeyUp(e: React.KeyboardEvent) {
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            setIsKeyPressed(false);
            handleMouseUp();
        }
    }

    return (
        <>
            <div
                className={`${styles.pushButtonWrapper} ${isEnabled ? styles.enabled : ''}`}
                style={{ '--size': size } as React.CSSProperties}>
                <button
                    className={`${styles.pushButton} ${isPressed ? styles.pressed : ''} ${isEnabled ? styles.enabled : ''}`}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onKeyDown={handleKeyDown}
                    onKeyUp={handleKeyUp}
                    onMouseLeave={handleMouseUp}
                >
                </button>
                <div className={styles.pushButtonShadow}></div>
            </div>
        </>
    )
};