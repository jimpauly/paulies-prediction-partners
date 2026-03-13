# Paulie's Prediction Partners

> ⚠️ Front‑end work in progress: existing repo contains new `frontend/` folder with early layout.

Minimal backend remains deprecated. Most of our attention is on rebuilding the web UI from scratch in the `frontend/` directory.

---

## 📊 Front‑end Progress (Stage 1)

Current status is **Phase 1 complete, Phase 2 started**. Quadrant II regions are in place and a basic studio selector works via console.

#### Progress counters (component tree implementation)

- **Regions:** 7 out of 7 ( plus all quadrants created) - User 70% agrees, we will get better with more cards.

- **Cards:** 10 out of 13 defined in the registry (missing System Logs & Web Elements in Design studio).  Inspector panel now contains Notes and Send cards, both functional.  Hangar bay shapes added and Fly tab locked.  Quadrant‑II alignment fixed so all regions/cards reside in the single active quadrant.  

- **Borders:** every region now has a soft border; nav/HUD boundary is lighter to mimic the spreadsheet mockup.

- **Components:** ~8 implemented Out of how many element goups total for each card? of about how many? re-read component tree in DOCUMENTS\0-UI-UX-COMPONENT-TREE-AND-REQUEST-REGISTRY.md, User also says no more lists only numbers, User counted 12 buttons, theme-3 shouldnt exist, so only 11 buttons.

- **Elements:** ~28 individual UI elements (like down to the individual selector and aria stuff. dont list everything here just calculate the abouts after reading the full component tree.) 



| Phase | Description                                      | Status         |
| :---- | :----------------------------------------------- | :------------- |
| 1     | Skeleton – scaffolding, tooling, quad grid       | ✅ done        |
| 2     | Regions for Quadrant II (header/nav/sidebars)    | ✅ done        |
| 3     | Cards for Quadrant II (basic Card component)     | ⏳ upcoming    |
| 4‑9   | Components, polishes, first two themes           | ⏳ upcoming    |


## Quick Dev Guide

The front‑end is a static React app that can be consumed in one of two modes:

- **Instant static preview** – open `frontend/index.html` directly or serve it with Live Server (port 5500 by default). This version uses the pre‑built `src/main.js` bundle and pulls React/ReactDOM from a CDN. No tooling is required, making it perfect for fast layout work or quick UI experiments.

- **Full TypeScript development** – run `npm install` in the `frontend/` folder to install the build tooling (Vite, ts‑jest, etc.). After that you can use `npm run dev` to start a hot‑reloading dev server and `npm run test` to exercise the unit tests. Edit `src/main.tsx` and the compiler/bundler will handle JSX/TS conversion automatically.

`src/styles.css` is common to both workflows; it defines the quadrant grid and basic reset.

You only need to install npm packages if you intend to work on the TypeScript source. Otherwise, the CDN‑based static bundle continues to function independently.

Once the page is running you can click studio buttons or use arrow keys to change studios. Nav‑bar toggles hide/show the support regions.

Phase 3 has introduced a reusable `Card` component and scaffolded placeholder cards across *all* Quadrant II regions, along with subcomponents for studio tabs, visibility toggles, toggle switches, inspector tabs, and a telemetry strip. The ten‑component skeleton now closely mirrors the registry tree – only details and data remain to be filled.

---

## Repository Layout (front‑end only)

```
frontend/
├─ src/
│  ├─ main.js        # application logic using React from CDN (static bundle)
│  ├─ main.tsx       # TypeScript source (requires npm install)
│  ├─ components/    # reusable React components (Card, toggles, tabs, etc.)
│  └─ styles.css     # CSS reset and quadrant grid
├─ index.html        # entry point loaded by Live Server
```

Other folders remain from earlier versions and are not currently used.

---

## License

MIT

