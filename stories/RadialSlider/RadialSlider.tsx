'use client';
import { useState, useMemo, useRef, useEffect } from "react";

import styles from './RadialSlider.module.css';

interface RadialSliderProps {
    minVal?: number;
    maxVal?: number;
    stepSize?: number;
    initVal?: number;
    onChange?: (value: number) => void;
}

type Tick = {
    size: boolean;
    value: number;
    angle: number;
}


export const RadialSlider = ({ minVal = 0, maxVal = 100, stepSize = 10, initVal = 0, onChange }: RadialSliderProps) => {

    const [value, setValue] = useState(initVal);
    const [isDragging, setIsDragging] = useState(false);
    const dragStartRef = useRef({ x: 0, y: 0, value: 0, touchId: null as number | null });

    const prevValueRef = useRef(value);
    const audioPoolRef = useRef<HTMLAudioElement[]>([]);
    const audioIndexRef = useRef(0);

    const svgDim = 96;
    const contentSize = ((svgDim / 4) + 5 + 10) * 2;

    useEffect(() => {
        // Create a pool of 5 audio instances
        for (let i = 0; i < 5; i++) {
            const audio = new Audio('/click.ogg');
            audio.volume = 0.5;
            audioPoolRef.current.push(audio);
        }
    }, []);

    useEffect(() => {
        const prevTick = Math.round((prevValueRef.current - minVal) / stepSize);
        const currentTick = Math.round((value - minVal) / stepSize);

        if (prevTick !== currentTick) {
            const audio = audioPoolRef.current[audioIndexRef.current];
            if (audio) {
                audio.currentTime = 0;
                audio.play().catch(() => { });
                audioIndexRef.current = (audioIndexRef.current + 1) % audioPoolRef.current.length;
            }
        }

        prevValueRef.current = value;
    }, [value, minVal, stepSize, maxVal]);

    useEffect(() => {
        const normalizedValue = (value - minVal) / (maxVal - minVal);
        onChange?.(normalizedValue);
    }, [value, minVal, maxVal]);

    const svgRef = useRef<SVGSVGElement>(null);

    const ticks = useMemo(() => {
        const range = maxVal - minVal;
        const tickCount = (range / stepSize) + 1;
        return Array.from({ length: tickCount }, (_, index): Tick => {
            return {
                size: index % 2 === 0,
                value: minVal + (index * stepSize),
                angle: (index / (tickCount - 1)) * 270
            }
        })
    }, [minVal, maxVal, stepSize]);

    function tickPos(vH = svgDim, vW = svgDim, tick: Tick) {
        const cX = vW / 2;
        const cY = vH / 2;

        const knobRad = (vW / 4) + 5;
        const tickLength = tick.size ? 10 : 5;
        const tickAngle = (tick.angle) * (Math.PI / 180);

        let x1 = cX + (knobRad * Math.cos(tickAngle));
        let y1 = cY + (knobRad * Math.sin(tickAngle));

        let x2 = x1 + (tickLength * Math.cos(tickAngle));
        let y2 = y1 + (tickLength * Math.sin(tickAngle));

        const r = (n: number) => Math.round(n * 1e6) / 1e6;
        return { x1: r(x1), y1: r(y1), x2: r(x2), y2: r(y2) };
    }

    const knobAngle = useMemo(() => {
        const ratio = (value - minVal) / (maxVal - minVal);
        return (ratio * 270);
    }, [value, minVal, maxVal]);

    // Helper to extract pointer position from mouse or touch events
    function getPointerPosition(e: MouseEvent | TouchEvent): { x: number; y: number } {
        if ('touches' in e && e.touches.length > 0) {
            return { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
        return { x: (e as MouseEvent).clientX, y: (e as MouseEvent).clientY };
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
            e.preventDefault();
            const newValue = Math.min(maxVal, value + stepSize);
            setValue(newValue);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
            e.preventDefault();
            const newValue = Math.max(minVal, value - stepSize);
            setValue(newValue);
        } else if (e.key === 'Home') {
            e.preventDefault();
            setValue(minVal);
        } else if (e.key === 'End') {
            e.preventDefault();
            setValue(maxVal);
        } else if (e.key === 'PageUp') {
            e.preventDefault();
            const newValue = Math.min(maxVal, value + stepSize * 10);
            setValue(newValue);
        } else if (e.key === 'PageDown') {
            e.preventDefault();
            const newValue = Math.max(minVal, value - stepSize * 10);
            setValue(newValue);
        }
    }

    useEffect(() => {
        if (!isDragging) return;
        document.body.style.cursor = 'grabbing';

        function handlePointerMove(e: MouseEvent | TouchEvent) {
            // For touch events, only track the original touch
            if ('touches' in e) {
                const touch = Array.from(e.touches).find(t => t.identifier === dragStartRef.current.touchId);
                if (!touch) return;
            }

            const { x, y } = getPointerPosition(e);
            const deltaX = x - dragStartRef.current.x;
            const deltaY = dragStartRef.current.y - y;
            const delta = deltaX + deltaY;

            const pixelsPerFullRange = 150;
            const deltaValue = (delta / pixelsPerFullRange) * (maxVal - minVal);
            const newValue = dragStartRef.current.value + deltaValue;

            const steppedVal = minVal + Math.round((newValue - minVal) / stepSize) * stepSize;
            const finalVal = Math.max(minVal, Math.min(maxVal, steppedVal));

            setValue(finalVal);
        }

        function handlePointerUp(e: MouseEvent | TouchEvent) {
            // For touch events, only end drag if the original touch ended
            if ('changedTouches' in e) {
                const touch = Array.from(e.changedTouches).find(t => t.identifier === dragStartRef.current.touchId);
                if (!touch) return;
            }

            document.body.style.cursor = '';
            dragStartRef.current.touchId = null;
            setIsDragging(false);
        }

        // Add both mouse and touch listeners
        window.addEventListener('mousemove', handlePointerMove as EventListener);
        window.addEventListener('mouseup', handlePointerUp as EventListener);
        window.addEventListener('touchmove', handlePointerMove as EventListener, { passive: false });
        window.addEventListener('touchend', handlePointerUp as EventListener);
        window.addEventListener('touchcancel', handlePointerUp as EventListener);

        return () => {
            window.removeEventListener('mousemove', handlePointerMove as EventListener);
            window.removeEventListener('mouseup', handlePointerUp as EventListener);
            window.removeEventListener('touchmove', handlePointerMove as EventListener);
            window.removeEventListener('touchend', handlePointerUp as EventListener);
            window.removeEventListener('touchcancel', handlePointerUp as EventListener);
        }
    }, [isDragging, minVal, maxVal, stepSize])

    function handlePointerStart(e: React.MouseEvent | React.TouchEvent) {
        // Prevent default to stop scrolling on touch devices
        if ('touches' in e) {
            e.preventDefault();
            const touch = e.touches[0];
            dragStartRef.current = {
                x: touch.clientX,
                y: touch.clientY,
                value: value,
                touchId: touch.identifier
            };
        } else {
            dragStartRef.current = {
                x: e.clientX,
                y: e.clientY,
                value: value,
                touchId: null
            };
        }
        setIsDragging(true);
    }


    return (
        <div className={styles.radialSliderWrapper}>
            <div className={styles.radialSlider}>
                <svg viewBox={`${(svgDim - contentSize) / 2} ${(svgDim - contentSize) / 2} ${contentSize} ${contentSize}`}
                    className={styles.ticks}
                    ref={svgRef}
                >
                    {ticks.map((tick, index) => {
                        const { x1, y1, x2, y2 } = tickPos(svgDim, svgDim, tick);
                        const isActive = tick.value <= value;
                        return (
                            <line
                                key={index}
                                x1={x1}
                                y1={y1}
                                x2={x2}
                                y2={y2}
                                className={isActive ? styles.activeTick : ''}
                            />
                        );
                    })}
                    <circle cx={svgDim / 2} cy={svgDim / 2} r={svgDim / 4}
                        onMouseDown={handlePointerStart}
                        onTouchStart={handlePointerStart}
                        className={styles.knob}
                        tabIndex={0}
                        onKeyDown={handleKeyDown}
                        role="slider"
                        aria-valuemin={minVal}
                        aria-valuemax={maxVal}
                        aria-valuenow={value}
                        aria-label="Radial Slider"
                    />
                    <line
                        x1={svgDim / 2 + svgDim / 8}
                        y1={svgDim / 2}
                        x2={svgDim / 2 + svgDim / 8 + 10}
                        y2={svgDim / 2}
                        transform={`rotate(${knobAngle}, ${svgDim / 2}, ${svgDim / 2})`}
                        className={styles.pointer}
                    />
                </svg >
            </div>
            <div className={styles.sliderValue}>
                {value}
            </div>
        </div>
    )
}