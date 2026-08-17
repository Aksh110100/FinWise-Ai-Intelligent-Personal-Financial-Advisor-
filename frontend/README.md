# FinWise AI - Frontend

This is the React.js + TypeScript frontend for **FinWise AI**, built on top of **Vite** and configured with key assets and placeholders for animation stacks.

## Tech Stack
- **Framework:** React 18 (TypeScript)
- **Build Tool:** Vite
- **Styling:** CSS variables custom theme design system (Dark Mode primary HSL color palette, Glassmorphism elements)
- **Key Libraries Included (Placeholder Dev Setup):**
  - **GSAP (GreenSock Animation Platform):** For timeline animations and triggers
  - **Lenis Scroll:** For modern smooth inertia scrolling
  - **Lucide React:** Icon set for clean visual cues

---

## Folder Structure

```text
frontend/
├── public/
│   └── vite.svg           # Brand favicon
├── src/
│   ├── assets/            # Static image assets
│   ├── components/        # Shared components
│   ├── sections/          # Core landing page block sections
│   ├── animations/        # GSAP / Lenis animation setups
│   ├── hooks/             # Custom React hooks
│   ├── styles/
│   │   └── variables.css  # Sleek dark mode design tokens & colors
│   ├── App.tsx            # Setup verification component
│   ├── main.tsx           # Mount entrypoint
│   └── index.css          # Global styles & scrolls
├── vite.config.ts         # Vite options
├── tsconfig.json          # TS config reference parent
├── tsconfig.app.json      # App sources compiling rules
├── tsconfig.node.json     # Node-level compiling rules
├── .gitignore             # Ignored directories
└── package.json           # Scripts & modules metadata
```

---

## Getting Started

### Prerequisites
Make sure you have Node.js and npm installed on your system. Recommended:
- **Node.js:** `v18.x` or later
- **npm:** `v9.x` or later

### Installation
From the `frontend/` directory, install all required dependencies:
```bash
npm install
```

### Run Local Development Server
Start Vite's fast development server (runs by default at `http://localhost:3000` with automatic browser open):
```bash
npm run dev
```

### Build for Production
Verify that compiling works and package the application into static production assets:
```bash
npm run build
```
Compiled assets will be outputted to `/dist`.
