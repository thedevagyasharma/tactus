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
    const dragStartRef = useRef({ x: 0, y: 0, value: 0 });

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
        function handleMouseMove(e: MouseEvent) {
            const deltaX = e.clientX - dragStartRef.current.x;
            const deltaY = dragStartRef.current.y - e.clientY;
            const delta = deltaX + deltaY;

            const sensitivity = 1;
            const deltaValue = delta / sensitivity;
            const newValue = dragStartRef.current.value + deltaValue;

            const steppedVal = minVal + Math.round((newValue - minVal) / stepSize) * stepSize;
            const finalVal = Math.max(minVal, Math.min(maxVal, steppedVal));

            setValue(finalVal);
        }

        function handleMouseUp() {
            document.body.style.cursor = '';
            setIsDragging(false);
        }

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }
    }, [isDragging, minVal, maxVal, stepSize])

    function handleMouseDown(e: React.MouseEvent) {
        dragStartRef.current = { x: e.clientX, y: e.clientY, value: value };
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
                                filter="url(#tickGlow)"
                            />
                        );
                    })}
                    <circle cx={svgDim / 2} cy={svgDim / 2} r={svgDim / 4} onMouseDown={handleMouseDown} className={styles.knob}
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