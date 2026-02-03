# Tactus

A collection of interactive UI components that replicate the feel of physical controls — sound, motion, and resistance brought to the browser.

## Components

- **Radial Slider** — Rotary dial with audio feedback and smooth rotation. Supports keyboard navigation (arrow keys, Home/End).
- **Push Button** — Momentary button with press and release sounds.
- **Toggle Button** — Binary switch with distinct on/off audio.
- **Light Switch** — Flip switch that mimics a physical light switch.
- **Light Bulb** — Glowing visual indicator.

## Tech Stack

- Next.js 16 (App Router, static export)
- React 19 + TypeScript
- Tailwind CSS 4
- Web Audio API for sound effects
- Vitest + Playwright for testing
- Storybook for component documentation

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
```

Outputs a static site to the `out` directory.

## Testing

```bash
npm test
```

## Storybook

```bash
npm run storybook
```
