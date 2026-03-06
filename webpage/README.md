# Web App Workspace

`webpage/` is structured as a modern full-stack workspace with explicit app boundaries.

## Structure

- `apps/desktop`: Electron desktop shell and runtime orchestration.
- `apps/web/public`: Frontend renderer assets served to Electron/browser.
- `services/api/backend`: FastAPI backend and domain services.
- `package.json`: Build/dev scripts for web, desktop, and packaging.

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start desktop app:
   ```bash
   npm start
   ```
3. Start backend only:
   ```bash
   npm run start:backend
   ```
4. Start web preview only:
   ```bash
   npm run start:web
   ```

## Notes

- CI workflows are defined at the repository root in `.github/workflows/`.
- Keep generated dependencies (`node_modules`) and build artifacts out of git.

## Packaging

Use electron-builder scripts from `package.json`:
- `npm run build:win`
- `npm run build:mac`
- `npm run build:linux`
- `npm run build:all`
