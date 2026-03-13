# Development Plan

*Expand on this Phases - only after deeply reading all documents, soaking up all photos, and finally getting the godspeed signal from user.*

## Stage 1

> **Note:** UI is rendered at roughly one‑quarter normal scale by default so
> Quadrant II behaves like a miniature cockpit window.  Elements should be
> designed naturally teeny‑tiny using relative units; toggling fullscreen will
> bump the root font‑size back to 1rem and expand everything four‑times to
> normal size.


### Phase 1 - Skeleton

- Create project scaffolding (HTML index, TypeScript entrypoint, CSS reset—raw, no Tailwind).
- Set up build tooling: `tsconfig.json`, bundler config (Vite), linting rules.
- Establish global layout container using four‑quadrant grid with CSS variables for region sizes.
- Add basic routing/state system to switch main region studios (Design, Trade, Flight, Convert).
- Commit baseline with placeholder `div` elements for each region.
- no colors until first two themes. Keep color automatic until first two themes.

### Phase 2 - Regions for Quadrant II

- Implement structural components for Header, Nav Bar, Left Sidebar, Right Sidebar, Bottom Bar, Action Bar, and Main Region.
- Ensure each region occupies correct area and responds to resize using flex/grid rules confined to Quadrant II.
- Add toggles for visibility (Nav Bar controls to hide/show support regions) and keyboard accessibility.
- Make Portrait breakpoint adjustments: the same four regions toggle visibility.
- Write basic tests verifying presence and resize behavior of regions.

- **No further development beyond Phase 2 may occur until the layout milestone is fully achieved:**
  100 % progress at clearly seeing 7 rectangles in Quadrant II with proper padding.
  Current user progress: 20 %
  (all 4 quadrants equal sizes: 100 % already satisfied)

### Phase 3 - Cards for Quadrant II

- Define `Card` component with props `title`, `icon`, and content slot.
- Scaffold all Registry‑listed cards (Illumination Switchboard, Modes, etc.) inside their parent regions.
- Provide minimal styling: borders, drop shadows, spacing per bezel logic.
- Verify card layout in quadrant II; ensure scroll behaviors (sidebars vertical, bottom bar horizontal).

### Phase 4 - Components for Quadrant II

- Start with System Design theme implementation; focus on first two themes in detail.
- Implement accessible attributes (`aria-*`) per registry notes.
- Wire simple state logic for theme toggle, studio tab navigation, panel toggles.
- **Do not use mock data at any stage.**
- Create unit tests for component states and accessibility.

Progess at number of cards, components, and children elements:

Cards: 12 out of 13 (only Web Elements left to fully populate)

Components: ~18 out of 20+ (added SystemLogsCard, WebElementsCard, plus previously listed items)

Elements: ~45 out of ~70 required by registry (logs list, buttons, inputs, checkbox added)

### Phase 5 - Element Polishes

- Refine typography and spacing (font-size normalization, bezel paddings).
- Add focus ring styles and keyboard navigation for controls.
- Implement day/night flip behavior syncing mode toggles and illumination controls.
- Build the dynamic ping chart and telemetry strip with real‑time simulation.
- Validate WCAG contrast ratios for text over illuminated surfaces.

### Phase 6 - More Element Polishes

- Enhance card contents: notes editor with markdown export, positions list placeholder, history log layout.
- Add agent access grid with sample cards.
- Implement master‑dimmer logic visual placeholder (no real illumination yet).
- Introduce debug overlay for illumination engine values under CSS variable toggle.
- Review and adjust responsive behavior across phone‑to‑laptop viewports.

### Phase 7 - Polishes After Screenshots/Registry Update

- Incorporate feedback/photos and any new registry requests.
- Refactor components based on usability findings; fix layout edge cases.
- Add animation details (switch bounce, dimmer transitions).
- Conduct comprehensive accessibility review and fix ARIA issues.

### Phase 8 - Finish All Themes and Illumination Effects

- Define CSS tokens for all 48 (+ mode) themes; implement theme switching logic.
- Build illumination engine: channels, master scale, glow layering, dials controlling intensity.
- Style components entirely from theme tokens.
- Render glows using CSS/SVG gradients; ensure GPU‑friendly performance.
- Write automated tests verifying theme application and illumination toggling.

### Phase 9 - Final polish and readiness for Stage 2

- Bug hunt and polish remaining UI/UX glitches.
- Prepare design documentation and developer notes for Stage 2 work (sample data connectors, etc.).
- Add onboarding sequence/instructions in the index page.
- Ensure build passes lint, type‑check, and simple e2e smoke tests.
- Tag release commit and update project README with Stage 1 completion notes.

## Stage 2

## Stage 2

### Phase 1

### Phase 2

### Phase 3

### Phase 4

### Phase 5

### Phase 6

### Phase 7

### Phase 8

### Phase 9

## Stage 2.5


## Stage 3

