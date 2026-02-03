'use client';
import Link from 'next/link';
import { ComponentMetadata } from '@/lib/components';
import { Suspense } from 'react';
import styles from './ComponentCard.module.css';

interface ComponentCardProps {
  component: ComponentMetadata;
}

export function ComponentCard({ component }: ComponentCardProps) {
  const Component = component.component;

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>{component.name}</h3>
        {component.hasSound && (
          <span className={styles.soundBadge}>Sound</span>
        )}
      </div>

      <div className={styles.preview}>
        <Suspense fallback={<div className={styles.previewLoading}>Loading...</div>}>
          <Component />
        </Suspense>
      </div>

      <Link href={`/components/${component.id}`} className={styles.button}>
        See More
      </Link>
    </div>
  );
}
