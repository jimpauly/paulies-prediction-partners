# Paulie's Prediction Partners

AI-assisted prediction market trading platform (web + desktop + API services).

## Repository Layout

- `index.html`: Root landing page.
- `README.md`, `SECURITY.md`: Project information files.
- `DOCUMENTS/`: Product requirements, references, and development logs.
- `webpage/`: Main code workspace.
  - `apps/web/public/`: Web UI assets and entrypoint.
  - `apps/desktop/`: Electron desktop shell.
  - `services/api/backend/`: FastAPI backend and trading services.

## Quick Start

```bash
git clone https://github.com/jimpauly/paulies-prediction-partners.git
cd paulies-prediction-partners/webpage
npm install
npm start
```

## Backend Only

```bash
cd webpage
npm run start:backend
```

## Web Preview Only

```bash
cd webpage
npm run start:web
```

## Build Desktop Installers

```bash
cd webpage
npm run build:win
npm run build:mac
npm run build:linux
```

## License

MIT
