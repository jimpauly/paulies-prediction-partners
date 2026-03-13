# Helpful Open Repos (Resources + Inspiration)

This is a curated list of open-source repositories, toolkits, and projects that can help us build out the UI and functionality for `paulies-prediction-partners`. It includes component libraries (especially tiny/compact UI), utility toolkits, and trading/bot/market connectors.

## 1) UI Components & Design Systems (tiny / cockpit style)

- **Radix UI** — accessible, unstyled primitives for building custom components.
  - Repo: https://github.com/radix-ui/primitives
  - Why: Provides all the accessible building blocks (switches, sliders, tabs, tooltips, dialogs) without imposing styles.

- **Headless UI** — unstyled, accessible UI components for React.
  - Repo: https://github.com/tailwindlabs/headlessui
  - Why: Great for building custom UIs where you control styling and want good keyboard/ARIA behavior.

- **shadcn/ui** — collection of ready-to-use components built on Radix + Tailwind.
  - Repo: https://github.com/shadcn/ui
  - Why: Provides real-world component implementations (buttons, switches, cards, tabs) that we can copy/adapt.

- **Tailwind UI** (not open-source, but inspiration): components for compact dashboards (use as design reference).

- **Blueprint.js** — desktop-style UI components (good for dense tooling interfaces).
  - Repo: https://github.com/palantir/blueprint
  - Why: Has lots of compact controls, sliders, knobs, toggle groups, toolbars.

- **Bonsai (css-graphics)** — tiny UI/graphics controls for retro style (inspiration for “tiny cockpit”).
  - Repo: https://github.com/bonsai-css/bonsai

## 2) Tiny / Micro UI Layout & Utilities

- **clsx / classnames** — small utilities for class string composition.
  - Repo: https://github.com/lukeed/clsx

- **Tailwind CSS** — utility-first CSS framework (very useful for rapid prototyping of small layouts). 
  - Repo: https://github.com/tailwindlabs/tailwindcss

- **UnoCSS** — on-demand utility CSS, can produce extremely small output.
  - Repo: https://github.com/unocss/unocss

## 3) Trading / Market APIs + Bots (Kalshi-related exploration)

- **Kalshi API docs** (not a repo, but essential): https://developers.kalshi.com/
  - Why: Official API reference for building market access, placing orders, streaming.

- **ccxt** — cryptocurrency trading API library for many exchanges.
  - Repo: https://github.com/ccxt/ccxt
  - Why: Reference for how to structure exchange adapters + order execution from JS.

- **freqtrade** — open-source crypto trading bot (Python).
  - Repo: https://github.com/freqtrade/freqtrade
  - Why: Shows how to structure strategies, backtest, and connect to exchange APIs.

- **Hummingbot** — open-source trading bot framework.
  - Repo: https://github.com/hummingbot/hummingbot
  - Why: Example of modular strategy architecture, connectors, risk controls.

- **kalshi-api** (community libraries) — search for community wrappers; if none exist, we can fork or build our own.

## 4) Helpful Tools / Utilities

- **esbuild** — super-fast bundler (Vite uses it), good for building small web UIs.
  - Repo: https://github.com/evanw/esbuild

- **vite-plugin-ssr / vite** — fast dev server + build for modern apps.
  - Repo: https://github.com/vitejs/vite

- **react-spring / framer-motion** — animation libraries for small, smooth UI transitions.
  - Repo (framer-motion): https://github.com/framer/motion

## 5) Inspiration (retro / graphic / tiny UI)

- **Terminal.css** — old-school terminal UI theme (useful for retro palette).
  - Repo: https://github.com/chesterhow/tachyons-terminal

- **Photon** — desktop-style UI components (Electron-style) for inspiration.
  - Repo: https://github.com/connors/photon

---

## How to use this list

1. **Pick a target** (e.g., tiny toggle switch, compact tabs, or a trading API wrapper).
2. Open the repo and search for the component/feature you want to replicate.
3. Copy the relevant implementation patterns (especially markup + accessibility) into our code.

If you want, I can also generate a short “starter checklist” for building a Kalshi trading bot module (API wrapper + order helpers + sample state machine) based on these resources.