# Paulie's Prediction Partners 🤖

Desktop trading app. Three AI agents trade prediction markets on [Kalshi](https://kalshi.com) so you don't have to stare at screens all day.

**Status:** In development. Not ready for real money yet.

## Run It

```bash
git clone https://github.com/jimpauly/paulies-prediction-partners.git
cd paulies-prediction-partners/copilot-opus

pip install -r backend/requirements.txt
python -m uvicorn backend.main:main --host 127.0.0.1 --port 8000 &

# Open the frontend
python -m http.server 3000
# Visit http://localhost:3000/copilot-opus/index.html
```

Or grab a desktop build from [Releases](https://github.com/jimpauly/paulies-prediction-partners/releases) (when available).

## What's In Here

```
copilot-opus/          Main app (frontend + backend)
  backend/             Python/FastAPI — agents, risk, execution
  css/                 Themes, illumination, layout
  js/                  Vanilla JS — no framework
  index.html           The app
electron/              Desktop wrapper
DOCUMENTS/             PRD, reference material, dev logs
index.html             GitHub Pages landing page
```

## Stack

- **Frontend:** HTML, CSS, vanilla JS, Tailwind (CDN)
- **Backend:** Python 3.12+, FastAPI, Uvicorn
- **Desktop:** Electron
- **Agents:** Prime (volume), Praxis (sports), Peritia (candlestick patterns)

## Build Desktop Installers

```bash
npm install
npm run build:win    # .exe
npm run build:mac    # .dmg
npm run build:linux  # .AppImage
```

## License

MIT
