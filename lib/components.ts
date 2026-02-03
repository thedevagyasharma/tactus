import { lazy, ComponentType } from 'react';

export type ComponentCategory = 'physical-controls' | 'animated-components';

export type PropControlType = 'range' | 'toggle';

export interface PropControl {
  name: string;
  label: string;
  type: PropControlType;
  defaultValue: number | boolean;
  // for type: 'range'
  min?: number;
  max?: number;
  step?: number;
}

export interface SoundFile {
  label: string;
  path: string;
}

export interface ComponentMetadata {
  id: string;
  name: string;
  category: ComponentCategory;
  tags: string[];
  hasSound: boolean;
  description: string;
  createdDate: string;
  featured: boolean;
  // Lazy-loaded component
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: ComponentType<any>;
  playgroundProps?: PropControl[];
  sounds?: SoundFile[];
}

export const COMPONENTS: ComponentMetadata[] = [
  {
    id: 'radial-slider',
    name: 'Radial Slider',
    category: 'physical-controls',
    tags: ['slider', 'dial', 'sound', 'interactive', 'rotary'],
    hasSound: true,
    description: 'A rotary dial slider with realistic click sounds and haptic-like feedback. Features smooth rotation and precise value control.',
    component: lazy(() => import('@/stories/RadialSlider/RadialSlider').then(m => ({ default: m.RadialSlider }))),
    createdDate: '2026-01-26',
    featured: true,
    playgroundProps: [
      { name: 'minVal', label: 'Min Value', type: 'range', defaultValue: 0, min: -180, max: 0, step: 10 },
      { name: 'maxVal', label: 'Max Value', type: 'range', defaultValue: 100, min: 10, max: 360, step: 10 },
      { name: 'stepSize', label: 'Step Size', type: 'range', defaultValue: 10, min: 1, max: 50, step: 1 },
      { name: 'initVal', label: 'Initial Value', type: 'range', defaultValue: 0, min: 0, max: 100, step: 10 },
    ],
    sounds: [
      { label: 'Tick', path: '/click.ogg' },
    ],
  },
  {
    id: 'push-button',
    name: 'Push Button',
    category: 'physical-controls',
    tags: ['button', 'sound', 'momentary', 'interactive'],
    hasSound: true,
    description: 'A momentary push button with satisfying click sound. Perfect for trigger actions and momentary inputs.',
    component: lazy(() => import('@/stories/PushButton/PushButton').then(m => ({ default: m.PushButton }))),
    createdDate: '2026-01-26',
    featured: true,
    playgroundProps: [
      { name: 'size', label: 'Size', type: 'range', defaultValue: 1, min: 0.5, max: 2, step: 0.1 },
    ],
    sounds: [
      { label: 'Press', path: '/1.ogg' },
      { label: 'Release', path: '/2.ogg' },
    ],
  },
  {
    id: 'toggle-button',
    name: 'Toggle Button',
    category: 'physical-controls',
    tags: ['toggle', 'switch', 'sound', 'binary', 'interactive'],
    hasSound: true,
    description: 'A toggle switch with distinct on/off sounds. Smooth animation and clear visual feedback for binary states.',
    component: lazy(() => import('@/stories/ToggleButton/ToggleButton').then(m => ({ default: m.ToggleButton }))),
    createdDate: '2026-01-26',
    featured: true,
    playgroundProps: [
      { name: 'size', label: 'Size', type: 'range', defaultValue: 1, min: 0.5, max: 2, step: 0.1 },
    ],
    sounds: [
      { label: 'On', path: '/toggle-on.ogg' },
      { label: 'Off', path: '/toggle-off.ogg' },
    ],
  },
  {
    id: 'light-switch',
    name: 'Light Switch',
    category: 'physical-controls',
    tags: ['switch', 'sound', 'flip', 'binary', 'interactive'],
    hasSound: true,
    description: 'A realistic flip switch mimicking a physical light switch. Complete with switch sounds and tactile feedback.',
    component: lazy(() => import('@/stories/LightSwitch/LightSwitch').then(m => ({ default: m.LightSwitch }))),
    createdDate: '2026-01-26',
    featured: true,
    playgroundProps: [
      { name: 'size', label: 'Size', type: 'range', defaultValue: 1, min: 0.5, max: 2, step: 0.1 },
      { name: 'initialState', label: 'Initial State', type: 'toggle', defaultValue: false },
    ],
    sounds: [
      { label: 'On', path: '/switch-on.ogg' },
      { label: 'Off', path: '/switch-off.ogg' },
    ],
  },
  {
    id: 'light-bulb',
    name: 'Light Bulb',
    category: 'physical-controls',
    tags: ['indicator', 'visual', 'feedback', 'glow'],
    hasSound: false,
    description: 'An animated light bulb component with glowing effect. Perfect for visual feedback and status indicators.',
    component: lazy(() => import('@/stories/LightBulb/LightBulb').then(m => ({ default: m.LightBulb }))),
    createdDate: '2026-01-26',
    featured: false,
    playgroundProps: [
      { name: 'value', label: 'Brightness', type: 'range', defaultValue: 1, min: 0, max: 1, step: 0.01 },
    ],
  },
];

// Category metadata
export const CATEGORIES = {
  'physical-controls': {
    name: 'Physical Controls',
    description: 'Components that mimic real-world physical interfaces with tactile feedback'
  },
  'animated-components': {
    name: 'Animated Components',
    description: 'Complex animated UI elements with rich motion and transitions'
  }
} as const;

// Helper functions
export function getComponentById(id: string): ComponentMetadata | undefined {
  return COMPONENTS.find(c => c.id === id);
}

export function getComponentsByCategory(category: ComponentCategory): ComponentMetadata[] {
  return COMPONENTS.filter(c => c.category === category);
}

export function getFeaturedComponents(): ComponentMetadata[] {
  return COMPONENTS.filter(c => c.featured);
}

export function searchComponents(query: string): ComponentMetadata[] {
  const lowerQuery = query.toLowerCase();
  return COMPONENTS.filter(c =>
    c.name.toLowerCase().includes(lowerQuery) ||
    c.description.toLowerCase().includes(lowerQuery) ||
    c.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

export function getAllTags(): string[] {
  const tagSet = new Set<string>();
  COMPONENTS.forEach(c => c.tags.forEach(tag => tagSet.add(tag)));
  return Array.from(tagSet).sort();
}
