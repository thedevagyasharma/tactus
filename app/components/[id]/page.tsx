import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { COMPONENTS, getComponentById } from '@/lib/components';
import { Playground } from './Playground';
import { Sounds } from './Sounds';
import styles from './page.module.css';

interface ComponentPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  return COMPONENTS.map((component) => ({
    id: component.id,
  }));
}

export async function generateMetadata({ params }: ComponentPageProps) {
  const { id } = await params;
  const component = getComponentById(id);

  if (!component) {
    return {
      title: 'Component Not Found',
    };
  }

  return {
    title: `${component.name} - Tactus`,
    description: component.description,
  };
}

export default async function ComponentPage({ params }: ComponentPageProps) {
  const { id } = await params;
  const component = getComponentById(id);

  if (!component) {
    notFound();
  }

  const Component = component.component;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <Link href="/" className={styles.backLink}>
            ← Back
          </Link>
          <h1 className={styles.title}>{component.name}</h1>
          {component.hasSound && (
            <span className={styles.badge}>Sound</span>
          )}
          <p className={styles.description}>{component.description}</p>
        </header>

        <section className={styles.demoSection}>
          <div className={styles.demo}>
            <Suspense fallback={
              <div className={styles.loading}>Loading...</div>
            }>
              <Component />
            </Suspense>
          </div>
        </section>

        <Playground component={component} />
        <Sounds component={component} />
      </div>
    </div>
  );
}
