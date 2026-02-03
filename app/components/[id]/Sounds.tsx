'use client';

import { useState, useRef } from 'react';
import type { ComponentMetadata } from '@/lib/components';
import styles from './Sounds.module.css';

interface SoundsProps {
  component: ComponentMetadata;
}

export function Sounds({ component }: SoundsProps) {
  const sounds = component.sounds;
  if (!sounds || sounds.length === 0) return null;

  return (
    <section className={styles.sounds}>
      <h2 className={styles.sectionTitle}>Sounds</h2>
      <div className={styles.grid}>
        {sounds.map(sound => (
          <SoundItem key={sound.path} label={sound.label} path={sound.path} />
        ))}
      </div>
    </section>
  );
}

function SoundItem({ label, path }: { label: string; path: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  function handlePlay() {
    if (!audioRef.current) {
      audioRef.current = new Audio(path);
      audioRef.current.onended = () => setIsPlaying(false);
    }
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
    setIsPlaying(true);
  }

  // Filename for the download attribute (strip leading slash)
  const filename = path.replace(/^\//, '');

  return (
    <div className={styles.item}>
      <div className={styles.itemLeft}>
        <button
          className={`${styles.playBtn} ${isPlaying ? styles.playing : ''}`}
          onClick={handlePlay}
          aria-label={`Play ${label}`}
        >
          {isPlaying ? (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <rect x="2" y="1" width="3" height="10" rx="1" />
              <rect x="7" y="1" width="3" height="10" rx="1" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <path d="M3 1.5l7 4.5-7 4.5V1.5z" />
            </svg>
          )}
        </button>
        <span className={styles.itemLabel}>{label}</span>
        <span className={styles.itemFile}>{filename}</span>
      </div>
      <a
        href={path}
        download={filename}
        className={styles.downloadBtn}
        aria-label={`Download ${label}`}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 1v8M4 6l3 3 3-3M2 11h10" />
        </svg>
        Download
      </a>
    </div>
  );
}
