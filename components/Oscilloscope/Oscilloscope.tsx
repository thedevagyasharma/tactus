'use client';

import { useEffect, useRef, useState } from 'react';
import { LightBulb } from '@/stories/LightBulb/LightBulb';
import { LightSwitch } from '@/stories/LightSwitch/LightSwitch';
import { RadialSlider } from '@/stories/RadialSlider/RadialSlider';
import { ToggleButton } from '@/stories/ToggleButton/ToggleButton';
import { PushButton } from '@/stories/PushButton/PushButton';
import styles from './Oscilloscope.module.css';

export const Oscilloscope = () => {
  const [isPowerOn, setIsPowerOn] = useState(true);
  const [phase, setPhase] = useState(0);
  const [frequency, setFrequency] = useState(2);
  const [isSquareWave, setIsSquareWave] = useState(false);
  const [doubleAmplitude, setDoubleAmplitude] = useState(false);
  const [isNarrow, setIsNarrow] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 560px)');
    setIsNarrow(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsNarrow(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const currentAmplitudeRef = useRef(60);
  const targetAmplitudeRef = useRef(60);
  const morphProgressRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Update target amplitude
    targetAmplitudeRef.current = doubleAmplitude ? 120 : 60;

    const draw = () => {
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;
      const centerX = width / 2;

      // Clear canvas
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, width, height);

      if (!isPowerOn) {
        // Draw dim flat line when off
        ctx.strokeStyle = 'rgba(255, 64, 0, 0.15)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        ctx.lineTo(width, centerY);
        ctx.stroke();
      } else {
        // Draw grid when on
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.lineWidth = 1;

        // Horizontal lines
        for (let i = 0; i < height; i += 30) {
          ctx.beginPath();
          ctx.moveTo(0, i);
          ctx.lineTo(width, i);
          ctx.stroke();
        }

        // Vertical lines
        for (let i = 0; i < width; i += 30) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i, height);
          ctx.stroke();
        }

        // Draw X and Y axes
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;

        // Y-axis (vertical center line)
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        ctx.lineTo(width, centerY);
        ctx.stroke();

        // X-axis (left edge)
        ctx.beginPath();
        ctx.moveTo(centerX, 0);
        ctx.lineTo(centerX, height);
        ctx.stroke();

        // Smooth amplitude transition
        const amplitudeDiff = targetAmplitudeRef.current - currentAmplitudeRef.current;
        if (Math.abs(amplitudeDiff) > 0.5) {
          currentAmplitudeRef.current += amplitudeDiff * 0.15;
        } else {
          currentAmplitudeRef.current = targetAmplitudeRef.current;
        }

        // Wave type morphing - animate towards target
        const targetMorph = isSquareWave ? 1 : 0;
        const morphDiff = targetMorph - morphProgressRef.current;

        if (Math.abs(morphDiff) > 0.01) {
          morphProgressRef.current += morphDiff * 0.15;
        } else {
          morphProgressRef.current = targetMorph;
        }

        // Draw static waveform
        ctx.strokeStyle = '#ff4000';
        ctx.lineWidth = 3;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ff4000';
        ctx.beginPath();

        const phaseOffset = (phase / 180) * Math.PI; // Convert -180 to 180 degrees to radians
        const amplitude = currentAmplitudeRef.current;

        // High resolution sampling to eliminate aliasing
        const samplesPerPixel = 4;
        const totalSamples = width * samplesPerPixel;

        // First, generate all sample points
        const samples: Array<{ x: number; sineY: number; squareY: number }> = [];

        for (let i = 0; i <= totalSamples; i++) {
          const progress = i / totalSamples;
          const x = progress * width;
          const angle = (progress * Math.PI * frequency * 2) - (Math.PI / 2) + phaseOffset;

          const sineY = Math.sin(angle) * amplitude;
          const squareY = sineY > 0 ? amplitude : (sineY < 0 ? -amplitude : 0);

          samples.push({ x, sineY, squareY });
        }

        // Draw based on current wave type
        ctx.beginPath();

        if (isSquareWave && morphProgressRef.current > 0.95) {
          // Pure square wave - draw with explicit vertical transitions
          ctx.moveTo(samples[0].x, centerY + samples[0].squareY);

          for (let i = 1; i < samples.length; i++) {
            const prev = samples[i - 1];
            const curr = samples[i];

            // Detect transition (zero crossing)
            if (Math.abs(curr.squareY - prev.squareY) > amplitude) {
              // Draw to transition point, then vertical line
              ctx.lineTo(curr.x, centerY + prev.squareY);
              ctx.lineTo(curr.x, centerY + curr.squareY);
            } else {
              // Horizontal line
              ctx.lineTo(curr.x, centerY + curr.squareY);
            }
          }
        } else {
          // Sine wave or morphing
          for (let i = 0; i < samples.length; i++) {
            const sample = samples[i];

            // Always interpolate based on morph progress
            // When morphProgressRef.current = 0: pure sine
            // When morphProgressRef.current = 1: pure square
            const y = sample.sineY + (sample.squareY - sample.sineY) * morphProgressRef.current;

            if (i === 0) {
              ctx.moveTo(sample.x, centerY + y);
            } else {
              ctx.lineTo(sample.x, centerY + y);
            }
          }
        }

        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPowerOn, phase, frequency, isSquareWave, doubleAmplitude]);


  return (
    <div className={styles.container}>
      <div className={styles.oscilloscope}>
        <div className={styles.display}>
          <canvas
            ref={canvasRef}
            width={900}
            height={350}
            className={styles.canvas}
          />
          <div className={styles.scanline} />
          {isPowerOn && <div className={styles.glow} />}
        </div>

        {/* Controls */}
        <div className={styles.controls}>
          {/* Top Row - Wave Parameters */}
          <div className={styles.topRow}>
            <div className={styles.waveParams}>
              <div className={styles.controlGroup}>
                <div className={styles.controlWrapper}>
                  <RadialSlider
                    minVal={-180}
                    maxVal={180}
                    stepSize={10}
                    initVal={0}
                    onChange={(normalizedValue) => {
                      const phaseValue = (normalizedValue * 360) - 180;
                      setPhase(phaseValue);
                    }}
                  />
                </div>
                <span className={styles.controlLabel}>Phase</span>
              </div>

              <div className={styles.controlGroup}>
                <div className={styles.controlWrapper}>
                  <RadialSlider
                    minVal={10}
                    maxVal={110}
                    stepSize={10}
                    initVal={10}
                    onChange={(normalizedValue) => {
                      const freqValue = Math.round(1 + normalizedValue * 10);
                      setFrequency(freqValue);
                    }}
                  />
                </div>
                <span className={styles.controlLabel}>Frequency</span>
              </div>
            </div>
          </div>

          {/* Bottom Row - Power and Amplitude Controls */}
          <div className={styles.bottomRow}>
            <div className={styles.powerControl}>
              <div className={styles.controlGroup}>
                <div className={styles.indicator}>
                  <LightBulb value={isPowerOn ? 1 : 0} />
                </div>
                <div className={styles.controlWrapper}>
                  <LightSwitch
                    size={0.5}
                    label="Power"
                    initialState={true}
                    onChange={(value) => setIsPowerOn(value === 1)}
                  />
                </div>
                <span className={styles.controlLabel}>Power</span>
              </div>
            </div>

            <div className={styles.amplitudeControls}>
              <div className={styles.controlGroup}>
                <span className={styles.controlLabel}>Gain</span>
                <div className={styles.controlWrapper}>
                  <ToggleButton
                    label="Gain"
                    onChange={(value) => setDoubleAmplitude(value === 1)}
                    size={1}
                  />
                </div>
              </div>

              <div className={styles.controlGroup}>
                <span className={styles.controlLabel}>Schmitt</span>
                <div className={styles.controlWrapper}>
                  <PushButton
                    onChange={(value) => setIsSquareWave(value === 1)} size={isNarrow ? 0.75 : 1}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
