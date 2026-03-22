'use client';

import { useState, useMemo } from 'react';
import { Suspense } from 'react';
import type { ComponentMetadata, PropControl } from '@/lib/components';
import styles from './Playground.module.css';

// Props that only take effect on mount — changing them requires a remount
const INIT_PROPS = new Set(['initVal', 'initialState']);

interface PlaygroundProps {
  component: ComponentMetadata;
}

export function Playground({ component }: PlaygroundProps) {
  const controls = component.playgroundProps;
  if (!controls || controls.length === 0) return null;

  return (
    <PlaygroundInner component={component} controls={controls} />
  );
}

function PlaygroundInner({ component, controls }: { component: ComponentMetadata; controls: PropControl[] }) {
  const Component = component.component;

  const [values, setValues] = useState<Record<string, number | boolean | string>>(() => {
    const initial: Record<string, number | boolean | string> = {};
    for (const ctrl of controls) {
      initial[ctrl.name] = ctrl.defaultValue;
    }
    return initial;
  });

  function handleChange(name: string, value: number | boolean | string) {
    setValues(prev => ({ ...prev, [name]: value }));
  }

  // Key includes init-style props so the component remounts when they change
  const mountKey = controls
    .filter(c => INIT_PROPS.has(c.name))
    .map(c => `${c.name}=${values[c.name]}`)
    .join(',');

  // Build the props object to pass to the component
  const liveProps = useMemo(() => {
    const props: Record<string, number | boolean | string> = {};
    for (const ctrl of controls) {
      props[ctrl.name] = values[ctrl.name];
    }
    return props;
  }, [values, controls]);

  // Generate the code string
  const codeString = useMemo(() => {
    const componentName = component.name.replace(/\s+/g, '');
    const propStrings = controls.map(ctrl => {
      const val = values[ctrl.name];
      if (typeof val === 'boolean') {
        return val ? `  ${ctrl.name}` : `  ${ctrl.name}={false}`;
      }
      if (typeof val === 'string') {
        return `  ${ctrl.name}="${val}"`;
      }
      return `  ${ctrl.name}={${val}}`;
    });

    const hasProps = propStrings.length > 0;
    const importLine = `import { ${componentName} } from '@/stories/${componentName}/${componentName}';`;
    const jsxOpen = hasProps
      ? `<${componentName}\n${propStrings.join('\n')}\n/>`
      : `<${componentName} />`;

    return `${importLine}\n\n${jsxOpen}`;
  }, [values, controls, component.name]);

  return (
    <section className={styles.playground}>
      <h2 className={styles.sectionTitle}>Playground</h2>

      <div className={styles.layout}>
        <div className={styles.preview}>
          <Suspense fallback={<div role="status" aria-live="polite" className={styles.loading}>Loading...</div>}>
            <Component key={mountKey} {...liveProps} />
          </Suspense>
        </div>

        <div className={styles.panel}>
          <div className={styles.controls}>
            {controls.map(ctrl => (
              <div key={ctrl.name} className={styles.controlRow}>
                <label htmlFor={ctrl.name} className={styles.controlLabel}>{ctrl.label}</label>
                {ctrl.type === 'range' ? (
                  <div className={styles.rangeRow}>
                    <input
                      id={ctrl.name}
                      type="range"
                      className={styles.rangeInput}
                      min={ctrl.min}
                      max={ctrl.max}
                      step={ctrl.step}
                      value={values[ctrl.name] as number}
                      onChange={e => handleChange(ctrl.name, parseFloat(e.target.value))}
                    />
                    <span className={styles.rangeValue}>{values[ctrl.name] as number}</span>
                  </div>
                ) : ctrl.type === 'text' ? (
                  <input
                    id={ctrl.name}
                    type="text"
                    className={styles.textInput}
                    value={values[ctrl.name] as string}
                    onChange={e => handleChange(ctrl.name, e.target.value)}
                  />
                ) : (
                  <button
                    id={ctrl.name}
                    aria-pressed={!!values[ctrl.name]}
                    className={`${styles.toggleBtn} ${values[ctrl.name] ? styles.toggleOn : ''}`}
                    onClick={() => handleChange(ctrl.name, !values[ctrl.name])}
                  >
                    {values[ctrl.name] ? 'On' : 'Off'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.codeBlock}>
        <div className={styles.codeHeader}>
          <span className={styles.codeLabel}>Code</span>
          <button
            className={styles.copyBtn}
            onClick={() => navigator.clipboard.writeText(codeString)}
          >
            Copy
          </button>
        </div>
        <pre><code>{codeString}</code></pre>
      </div>
    </section>
  );
}
