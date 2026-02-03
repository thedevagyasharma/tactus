'use client';

import { getFeaturedComponents } from '@/lib/components';
import { ComponentCard } from '@/components/ui/ComponentCard';
import { Oscilloscope } from '@/components/Oscilloscope/Oscilloscope';
import styles from './page.module.css';

export default function Home() {
  const featuredComponents = getFeaturedComponents();

  return (
    <div className={styles.page}>
      {/* Hero Section - Oscilloscope */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              Digital controls that feel physical.
            </h1>
            <p className={styles.heroDescription}>
              An experiment in recreating tactile feedback through code, sound, and motion.
            </p>
          </div>
          <div className={styles.heroDemo}>
            <Oscilloscope />
          </div>
        </div>
      </section>

      {/* Manifesto */}
      <section className={styles.manifesto}>
        <p className={styles.manifestoText}>
          Experiences become richer when more senses are involved. Physical controls engage you through <span className={styles.manifestoHighlight}>sound, motion, and resistance</span>, but digital controls only give you sight and a click. Adding even one of those missing senses back changes how an interaction feels.
        </p>
      </section>

      {/* Components Grid */}
      {featuredComponents.length > 0 && (
        <section className={styles.componentsSection}>
          <h2 className={styles.sectionTitle}>Components</h2>
          <div className={styles.grid}>
            {featuredComponents.map(component => (
              <ComponentCard key={component.id} component={component} />
            ))}
          </div>
        </section>
      )}

      {/* About Section */}
      <section className={styles.aboutSection}>
        <div className={styles.aboutContent}>
          <div className={styles.aboutColumn}>
            <h3 className={styles.aboutTitle}>Why</h3>
            <p className={styles.aboutText}>
              Digital interfaces lost the feedback of physical objects. I wanted to bring
              back tactile quality through sound and motion — making pixels feel real.
            </p>
          </div>
          <div className={styles.aboutColumn}>
            <h3 className={styles.aboutTitle}>How</h3>
            <p className={styles.aboutText}>
              React + Web Audio API + FL Studio. Timing is everything.
            </p>
          </div>
          <div className={styles.aboutColumn}>
            <h3 className={styles.aboutTitle}>What I Learned</h3>
            <p className={styles.aboutText}>
              Motion sells it, sound confirms it. Sound must reinforce action, not decorate
              it. Timing is the craft — a millisecond off and it feels wrong. The best
              interactions disappear.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <a
            href="https://www.devagyasharma.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footerLink}
          >
            Created by Dev Sharma
          </a>
          <span className={styles.footerDivider}>·</span>
          <span className={styles.footerYear}>2026</span>
        </div>
      </footer>
    </div>
  );
}
