# Draft: Natural‑Language Component Tree (Webpage HTML Structure)

This document is the canonical component tree + requirement registry for the full app. It describes the entire page structure down to individual LEDs inside switches, and nests every item from quadrants → regions → cards → components → elements.

> Use this as the source of truth when coding and reviewing. If something isn't represented here, it likely isn't implemented.

---

## Global rules

- **Tiny by default**: all sizing is built-in (e.g., 3px where a normal design would use 12px).
- **No scaling transforms**: do not use `transform: scale()` or global zoom shortcuts; layout must be stable in all viewports.
- **Equal quadrants**: the 4 quadrants share equal width/height in the viewport (even in quad-split windows).
- **Theme tokens only**: no hardcoded hex values; use CSS variables like `--pp-illum-bg`, `--pp-glow-teal`, etc.
- **Accessibility first**: aria labels, roles, keyboard navigation, focus rings, and contrast ratios (WCAG) are mandatory.
- **No mock datasets**: use placeholders/empty states; do not hardcode fake data.
- **No overflow**: components must fit their region without clipping. Scroll only where explicitly intended.

---

## Component Tree (Region → Card → Component → Element)

### Quadrant II (fully built)

#### R01 · Header Bar

- [ ] **Header bar region**
  - [ ] Fixed height, fits within quadrant without overflow
  - [ ] Contains:
    - [ ] Brand / Studio title (left)
    - [ ] Illumination Switchboard (right)

- [ ] **Brand / Studio title**
  - [ ] "Paulie's Studios" (default / design studio)
  - [ ] "Paulie's Prediction Partners 🤖" (trade studio)
  - [ ] "Paulie's Flight Simulator" (flight studio)
  - [ ] "Paulie's File Converting Studio" (convert studio)

- [ ] **Illumination Switchboard (card)**
  - [ ] Top strip (thin blank header strip)
  - [ ] "ILLUMINATION" sticker label (vertical text bottom→top, left edge)
  - [ ] Illumination Groups (horizontal layout)

  - [ ] **DAY / NVG group**
    - [ ] Switch component (flip)
      - [ ] LED indicator (built into switch)
      - [ ] State: DAY (light) / NVG (night)
      - [ ] Behavior: toggles theme mode, synced with Left Sidebar light/dark toggle
      - [ ] Accessibility: `aria-label="Day/Night toggle"` + keyboard focus

  - [ ] **MASTER group**
    - [ ] Master control cluster (card component)
      - [ ] Flip switch (master)
        - [ ] LED indicator (beneath switch)
        - [ ] State: OFF (default) / ON
        - [ ] Behavior: when OFF, other channels dim; when ON, enables channels
        - [ ] Animation: 60ms toggle with end-bounce
      - [ ] Dimmer dial
        - [ ] Range: 2–10 (step 1)
        - [ ] Visual delta: dial knob + small tick marks
      - [ ] Nixie readout
        - [ ] Displays whole number (2–10)
        - [ ] Shows 10 when master is OFF (default)
      - [ ] Visual styling
        - [ ] Master ring (bronze)
        - [ ] Status LED: dim bronze off, `--pp-glow-teal` on

  - [ ] **TEXT channels (Primary + Secondary)**
    - [ ] Channel card (per channel)
      - [ ] Flip switch
        - [ ] LED indicator
      - [ ] Dimmer dial (2.5–10)
      - [ ] Nixie readout
      - [ ] Label (vertical, left of channel; bottom→top)
      - [ ] Visual rules
        - [ ] LED: bronze off, `--pp-glow-teal` on (only when master on)
        - [ ] Text opacity: ~90% on, ~70% off
        - [ ] Glow radius scales with dimmer

  - [ ] **BARS channels (Primary + Secondary)**
    - [ ] Accent bar switch + dial + nixie (per channel)
    - [ ] Default: ON (10)
    - [ ] Behavior: dimmer controls intensity and bloom radius

  - [ ] **FLOOD channel**
    - [ ] Flood switch + dial + nixie
    - [ ] Default: ON (10)
    - [ ] Behavior: wide soft illumination; radius scales with dimmer

  - [ ] **DISPLAY channel**
    - [ ] Display backlight switch + dial + nixie
    - [ ] Default: ON (10)
    - [ ] Behavior: powers screen / card backlight systems

  - [ ] **Channel / Common rules**
    - [ ] Dimmer range: 2–10 (step 1)
    - [ ] No % units (numeric only)
    - [ ] Switch housing height matches dial + intensity sublabel height
    - [ ] Labels align to dials; indicator dots spaced uniformly
    - [ ] All colors via theme tokens (no raw hex)
    - [ ] Animations: dimmer transitions 100ms ease-out

  - [ ] **Glow layering**
    - [ ] Primary bar glow: regions (outer spread, large radius)
    - [ ] Secondary bar glow: cards (tighter glow at card border)
    - [ ] Rules:
      - [ ] Master OFF → no glow
      - [ ] Master ON → glows updated per channel intensity
    - [ ] Implementation note: use GPU-friendly gradients/SVG; avoid full-screen bloom

  - [ ] **Diagnostics / dev**
    - [ ] Hidden overlay shows raw channel values when `--debug-illum` is set

  - [ ] Bottom nameplate: "ILLUMINATION SWITCHBOARD"

> **R01 Accessibility**
>
> - All interactive controls expose `aria-*` and are keyboard reachable
> - Focus rings visible; meets WCAG contrast
> - Day/NVG switch: `aria-label="Day/Night toggle"`
> - Master cluster: `aria-label="Master illumination control"`
> - Decorative text: `aria-hidden` or `role="presentation"`
> - Locked states (Fly tab): `aria-disabled="true"` + tooltip guidance

---

#### R02 · Nav Bar

- [ ] **Nav bar region**
  - [ ] Fixed height; fits within quadrant without overflow
  - [ ] Contains HUD label, Studio tabs, Visibility toggle cluster, Telemetry strip

- [ ] **HUD label** (decorative)
  - [ ] Text: "HUD" (uppercase)
  - [ ] `aria-hidden="true"` / `role="presentation"`

- [ ] **Studio Tabs**
  - [ ] Container: `role="tablist"`
  - [ ] DESIGN tab (default active)
    - [ ] Label: "DESIGN"
    - [ ] Icon: Palette SVG
    - [ ] Active indicator: blue underline
    - [ ] Behavior: switch to Design studio
    - [ ] Accessibility: `role="tab" aria-selected="true" tabindex="0"`
  - [ ] TRADE tab
    - [ ] Label: "TRADE"
    - [ ] Behavior: switch to Trade studio
    - [ ] Accessibility: `role="tab" aria-selected="false" tabindex="-1"`
  - [ ] FLY tab (locked)
    - [ ] Label: "FLY" + padlock icon
    - [ ] Disabled: low opacity, `pointer-events: none`
    - [ ] Tooltip: deprecated (no tooltip)
  - [ ] CONVERT tab
    - [ ] Label: "CONVERT"
    - [ ] Behavior: switch to Convert studio
  - [ ] Notes:
    - Tabs are tiny but include visible text labels
    - Tab group must fit in nav height without overflow
    - Keyboard: Left/Right to move, Enter to activate

- [ ] **Panel Visibility Toggle Cluster** (cross layout with MAX center)
  - [ ] MAX toggle (center)
    - [ ] Label: "MAX"
    - [ ] Behavior: toggles “max view” (applies `.fullscreen`)
  - [ ] Header Bar toggle (top)
  - [ ] Left Sidebar toggle (left)
  - [ ] Right Sidebar toggle (right)
  - [ ] Bottom Bar toggle (bottom)
  - [ ] Notes:
    - Buttons are tiny rectangles (fit better)
    - Cluster sits inside nav, padded, doesn’t touch edges
    - Portrait mode: Nav + Main + Action Bar shown; others auto-hide
    - Accessibility: each toggle has `aria-label="Toggle [region]"`

- [ ] **Telemetry Strip** (right)
  - [ ] Market Mode Indicator (live/demo/offline LED)
  - [ ] PING value (text only; no sparkline)
    - [ ] Label: "PING" + ms value (e.g., "PING 15ms")
  - [ ] CPU value (text)
  - [ ] MEM value (text)
  - [ ] DATE/TIME (live, `M/D HH:MM`, no seconds)
  - [ ] Notes: telemetry is low contrast; mark read-only items `aria-hidden` as needed

> **R02 Accessibility**
>
> - Tabs: `role="tablist"`; tabs: `role="tab"` with `aria-selected`, `tabindex`
> - Visibility toggles: `aria-label="Toggle [region]"`
> - Telemetry: mark `aria-hidden` where appropriate

---

#### R03 · Left Sidebar (System Design)

- [ ] **Left Sidebar region**
  - [ ] Region title: "SYSTEM DESIGN" (centered, bold, wide kerning; `aria-label="System Design"`)

- [ ] **MODES card**
  - [ ] Light/Dark toggle button
    - [ ] Label: "☀️ Light" / "🌙 Dark"
    - [ ] State toggles theme
    - [ ] Behavior: mirrors Day/NVG switch in Illumination panel
    - [ ] Accessibility: `aria-pressed`, keyboard focus, `aria-label="Toggle light/dark mode"`
  - [ ] Elevation toggle button
    - [ ] State toggles elevation effects (shadows/bezel intensity)
    - [ ] Visual: raised vs flat panels
    - [ ] Accessibility: `aria-pressed`, `aria-describedby` tooltip

- [ ] **SYSTEM THEME card**
  - [ ] Container: theme-button grid (2 columns)
  - [ ] Theme buttons (×24)
    - [ ] Visual: mini theme preview (colors + typography)
    - [ ] Structure: soft border + accent
    - [ ] Behavior: click applies theme (light/dark variant by mode)
    - [ ] Accessibility: `aria-label="Select theme [name]"`, `role="radio"` / `aria-checked`
    - [ ] Layout: equal width, responsive to label, text weight 700 centered

> **R03 Accessibility**
>
> - Sidebar: `role="complementary"` + `aria-label="System Design"`
> - Mode toggles: keyboard focus + `aria-pressed`
> - Theme buttons: keyboard focus ring, `aria-pressed`/`role="radio"`

---

#### R04 · Quadrant I (Market Dashboard placeholder)

- [ ] **Market Snapshot card**
  - [ ] Current price display (bold)
  - [ ] Volatility indicator (text)

- [ ] **Order Flow card**
  - [ ] Bid/ask heatmap placeholder
  - [ ] Behavior: future real-time level-2 flow bars

---

#### R05 · Quadrant III (Account & Positions placeholder)

- [ ] **Balance card**
  - [ ] Equity display
  - [ ] Buying power display

- [ ] **Open Positions card**
  - [ ] List placeholder
  - [ ] Behavior: expands into detailed position table later

---

#### R06 · Quadrant IV (Notifications placeholder)

- [ ] **System card**
  - [ ] Active system alerts placeholder

- [ ] **Help card**
  - [ ] Quick shortcut hint
  - [ ] Behavior: later links to docs / cheat sheet

---

#### R07 · Right Sidebar — Inspector Panel

- [ ] **Region title**: "INSPECTOR PANEL" (centered, bold, wide kerning)

- [ ] **Book/tab behavior**
  - [ ] Only one book active at a time; switching hides old panel and shows new
  - [ ] Keyboard nav: left/right arrows cycle books; Enter activates
  - [ ] Locked books: non-interactive; tooltip on hover

- [ ] **Tabs (icons, centered above notepad)**
  - [ ] Notes tab (default active)
    - [ ] Label: notebook icon
    - [ ] Behavior: shows NOTES panel
    - [ ] NOTES panel:
      - [ ] Note editor
        - [ ] Pagination dots (top)
        - [ ] File upload button (opens dialog)
        - [ ] Notepad area (yellow background, red margin, ruled lines)
        - [ ] Formatting toolbar (B · H1 · bullet · box)
        - [ ] Page controls (Save · ◄ · Page X of Y · ► · delete)
        - [ ] Behavior: freeform notes + save-as-markdown; no file load
  - [ ] Positions tab (+ count badge)
    - [ ] Label: chart icon
    - [ ] Badge: dynamic open positions count
    - [ ] Behavior: shows POSITIONS panel
    - [ ] POSITIONS panel:
      - [ ] Positions list (or empty state: "no positions")
      - [ ] P/L chart (or empty state: "no positions")
  - [ ] History tab
    - [ ] Label: clock/history icon
    - [ ] Behavior: shows HISTORY panel
    - [ ] HISTORY panel:
      - [ ] History list (or empty state: "no history")

- [ ] **Send card** (pinned bottom)
  - [ ] Textarea
    - [ ] Placeholder: "ideas and requests"
    - [ ] Behavior: input retained until send
  - [ ] "Send to Paulie" button
    - [ ] Behavior: `mailto:` to `chickensaurusrex@outlook.com`

> **R04 Accessibility**
>
> - Tablist: `role="tablist"`; tabs: `role="tab"` with `aria-selected`/`tabindex`
> - Inactive panels: `aria-hidden="true"`; active panel: `aria-live="polite"`
> - Textarea: `aria-label="Feedback"`; Send button: `aria-label="Submit feedback"`

---

#### R08 · Bottom Bar — Hangar Bay

- [ ] **Region title** (if present)
- [ ] **Cards row** (all cards visible simultaneously; no scrolling)

- [ ] **Agent Access card**
  - [ ] Header strip (top cockpit edge)
  - [ ] Card header: "Agent Access" + A / S / ⛔ legend
  - [ ] Agent grid (7 cards — one per module)
    - [ ] Agent card (default view)
      - [ ] Header: emoji + name centered
      - [ ] Switch component (telegraph)
        - [ ] Three vertical panels: AUTO / STANDBY / OFF
        - [ ] Each panel has centered LED indicator
        - [ ] Selecting a panel lights its LED and sets agent state
      - [ ] Hover window
        - [ ] Sub-label description
        - [ ] Win rate + PNL elements
        - [ ] Value indicators
    - [ ] Agent list:
      - [ ] 🔮 Peritia
      - [ ] ⚙️ Volume
      - [ ] 🚀 Crypto
      - [ ] 📈 Financials
      - [ ] 🗳️ Politics
      - [ ] 🧠 B.Y.O.B
      - [ ] 🛰️ 007‑Gemini (Gemini via API keys)
  - [ ] Bottom nameplate: "AGENT ACCESS BAY"

- [ ] **P/L MFD card**
  - [ ] Header: "P/L MFD"
  - [ ] Y-axis buttons: [$10 · $100 · $1k · $10k · ALL] (width matches chart)
  - [ ] P/L line chart (per-agent colored lines; auto-updates)
  - [ ] X-axis buttons: [24h · 1w · 1m · 1y · ALL] (width matches chart)
  - [ ] Behavior: redraw chart smoothly with new bounds

- [ ] **Connect API Keys card**
  - [ ] Header: "Connect API Keys"
  - [ ] Mode selector: [Live · Demo] (auto-select Demo)
  - [ ] API Key input (masked; placeholder; unified border radius)
  - [ ] RSA key textarea (masked; placeholder; unified border radius)
  - [ ] "Connect Kalshi Stream" button (centered; right margin increased)
  - [ ] Behavior: validates keys, toggles state, shows toast

> **R05 Accessibility**
>
> - Container: `role="region"` `aria-label="Hangar Bay"`
> - Agent cards: switches have `aria-label`; LEDs decorative (`aria-hidden`)
> - Hover details: keyboard reachable (`aria-describedby` / `aria-expanded`)
> - Y-axis buttons: `aria-label="Select P/L scale"`; X-axis buttons: `aria-label="Select timeframe"`; support `aria-pressed`
> - API inputs: `aria-label="API key input"` / `aria-label="RSA key input"`; Connect button: `aria-label="Connect Kalshi Stream"`, supports `aria-disabled` when inactive
> - Scrollable card row: `role="group"`, keyboard left/right navigation

---

#### R06 · Action Bar — Ignition

- [ ] **Ignition panel**
  - [ ] Header: "IGNITION" + mode display + status dot
  - [ ] Global throttle (engine-order-telegraph)
    - [ ] Visual: 4-quartered-pie with one slice missing (cruise-liner engine-order-telegraph style)
    - [ ] Positions: AUTO / SEMI-AUTO / STOP (default STOP)
    - [ ] Keyboard: Left/Right to change; Space/Enter to select
    - [ ] Emits `global-throttle-change` with `{mode}` payload
  - [ ] Safety interlocks
    - [ ] Lock toggle prevents mode changes when engaged
    - [ ] Confirmation flow for AUTO → full engagement (toast + aria-live)
  - [ ] Status readouts
    - [ ] Engine status (text + icon)
    - [ ] Last-action timestamp
    - [ ] Connectivity indicator (decorative)
  - [ ] Theming tokens
    - [ ] `--ignition-bg`, `--ignition-accent`, `--ignition-focus`
    - [ ] Elevation/3D toggles adapt via `data-3d="true"`

> **R06 Accessibility**
>
> - Panel: `role="region"` + `aria-label="Ignition"`
> - Status dot: `aria-live="polite"`
> - Lock toggle: `aria-pressed`
> - Control slices: `role="radiogroup"` / `role="radio"` with `aria-checked`
> - Focusable elements: visible focus ring, contrast ≥ 4.5:1
> - Action changes announced via `aria-live="polite"`

---

#### R07 · Main Region (Periscope Viewing Port)

- [ ] **Region label**: "PERISCOPE VIEWING PORT" (design studio only; decorative)

##### DESIGN STUDIO

- [ ] **Top bento grid**
  - [ ] **Active Palette card** (left; palette shape)
    - [ ] Theme name badge (top right)
    - [ ] Swatch blobs (~14 tiny splotches)
      - [ ] Click: copies hex silently + brief toast
      - [ ] Notes: hex values hidden; swatches remain pocket-sized
  - [ ] **Right column stack**
    - [ ] **Man‑o‑Meters card**
      - [ ] 4-leaf clover gauge cluster (art deco plumbing behind)
      - [ ] Meters:
        - [ ] BATT (center/top, main meter)
        - [ ] NET (arching under)
        - [ ] MEM (arching under)
        - [ ] CPU (arching under)
      - [ ] Values displayed inside meter faces (no external labels)
      - [ ] Layout: meters packed tightly like clover with decorative piping
    - [ ] **Bottom row**
      - [ ] **System Logs card** (CRT monitor aesthetic)
        - [ ] Log terminal (7 entries: timestamp + icon + text; padded)
        - [ ] Behavior: displays backend/API messages live
      - [ ] **Web Elements card**
        - [ ] Buttons (primary, secondary, danger, ghost, disabled)
        - [ ] Form inputs (text, select, checkbox, radio)
        - [ ] Alerts (success)
        - [ ] Notes: contrast/spacing/hover states match style tokens
  - [ ] **MS Paint 1998 card** (full width)
    - [ ] Maximize toggle (fills main region)
    - [ ] Menu bar
    - [ ] Tool palette
    - [ ] Color palette
    - [ ] Canvas

##### TRADING STUDIO (placeholder)

- [ ] **Account Summary Bar** (sticky top strip)
  - [ ] Balance widget (cash amount + icon; updates live)
  - [ ] Portfolio value widget (total holdings)
  - [ ] Daily P/L widget (delta + color coding)
    - [ ] Tooltip on hover: agent breakdown
- [ ] **Top-level nav** (pill buttons: Trending/New/All)
  - [ ] Mirrors Kalshi header links (Crypto, Sports, Finance, Politics, etc.)
  - [ ] Selection changes dataset below
  - [ ] Keyboard: left/right to change; selected pill `aria-selected="true"`
  - [ ] Back/Forward history buttons (hidden on small screens)
  - [ ] Collapse/expand toggle for secondary nav on narrow viewports
  - [ ] Icons may accompany text; pills wrap responsively

---

## How to use this file

1. Treat this as the source of truth for every component and requirement.
2. When implementing, find the matching checklist item and tick it.
3. If you add a new component, add it here at the correct nesting level.
4. Use nesting depth to capture the smallest elements (e.g., LED → switch → module → card → region).

- **No mock data**: components should use placeholder content or empty states, not hardcoded mock datasets.
- **No overflow**: components should fit their region without clipping or overflow; scroll only when appropriate.

---

## How to use this file

- Use this document as a “living spec” for what components need to exist and what their core behavior is.
- When implementing a new component, add it to this list (or expand its section) with its required features.
- Consider this the natural‑language equivalent of a component tree and registry.
