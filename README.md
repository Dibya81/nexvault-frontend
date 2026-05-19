# CyberCloud Frontend

A futuristic, cinematic, physics-based cloud storage interface built with Next.js, React Three Fiber, Framer Motion, and TailwindCSS.

## Features

- **Cinematic Login** — 3D crystal animation, particle rings, holographic form
- **Interactive Dashboard** — 3D storage globe, holographic stat cards, real-time activity graph
- **Physics Upload** — Magnetic drop zone, energy-style progress bars, drag & drop
- **3D Gallery** — Spiral layout, cinematic camera, lightbox with keyboard navigation
- **Cyberpunk UI** — Glassmorphism, neon glows, scan lines, holographic effects
- **Real API Integration** — Connects to your FastAPI backend

## Tech Stack

- Next.js 14 (App Router)
- React 18 + TypeScript
- TailwindCSS + Custom Cyber Theme
- Framer Motion (animations)
- React Three Fiber + Three.js (3D)
- Zustand (state management)
- Axios (API client)

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set your backend URL
# Edit .env.local:
NEXT_PUBLIC_API_URL=http://your-surface-pro-7:8000

# 3. Run development server
npm run dev

# 4. Open http://localhost:3000
```

## Project Structure

```
app/
  auth/login/         — Cinematic login page
  dashboard/          — Main command center
  upload/             — Physics-based upload
  gallery/            — 3D immersive gallery
  settings/           — System configuration
  page.tsx            — Landing page
  layout.tsx          — Root layout with effects
  globals.css         — Global styles + cyber utilities

components/
  3d/                 — Three.js components
    StorageGlobe.tsx  — 3D storage visualization
    FileCard3D.tsx    — Tiltable file cards
  effects/            — Visual effects
    CyberBackground.tsx   — Animated 3D background
    ScanLines.tsx         — CRT scan line overlay
    ParticleField.tsx     — Mouse-reactive particles
    HologramCard.tsx      — 3D tilt + sheen effect
    NeonText.tsx          — Glowing text with glitch
  layout/             — Layout components
    Navigation.tsx    — Cyber sidebar nav
    CyberLayout.tsx   — Main layout wrapper
    Providers.tsx     — Context providers
  ui/                 — UI components
    ActivityGraph.tsx — Real-time activity chart
    UploadEnergyBar.tsx — Energy-style progress

store/
  auth.ts             — Authentication state
  files.ts            — File management state
  ui.ts               — UI preferences state

lib/
  api.ts              — Axios API client + endpoints

types/
  index.ts            — TypeScript interfaces

utils/
  helpers.ts          — Formatting, utilities
```

## Backend Integration (FastAPI)

Your FastAPI backend should expose these endpoints:

```python
# Auth
POST /auth/login          — { username, password }
POST /auth/register       — { username, email, password }
GET  /auth/me             — Returns current user

# Files
GET  /files?parent_id=    — List files/folders
POST /files/upload        — Multipart file upload
DELETE /files/{id}        — Delete file
GET  /files/{id}/download — Download file
POST /folders             — Create folder { name, parent_id }
GET  /files/search?q=     — Search files

# Storage
GET  /storage/stats       — Storage statistics
GET  /storage/usage       — Usage breakdown
```

## Customization

### Colors
Edit `tailwind.config.js` → `theme.extend.colors.cyber`

### 3D Effects
Modify shaders in `components/3d/` and `components/effects/CyberBackground.tsx`

### Animation Speed
Adjust `transition` durations in Framer Motion components

## Performance Tips

- Use `will-change: transform` on animated elements
- Lazy load 3D scenes with `dynamic()` from Next.js
- Reduce particle count on mobile: `ParticleField count={100}`
- Use `React.memo()` for file cards in large lists

## License

MIT — Built for the cyber frontier.
