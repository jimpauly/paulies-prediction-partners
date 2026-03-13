import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import { Card } from './components/Card';

const studios = ['design', 'trade', 'flight', 'convert'] as const;
type Studio = typeof studios[number];

type VisibilityState = {
  header: boolean;
  left: boolean;
  right: boolean;
  bottom: boolean;
};

// --- helper subcomponents --------------------------------------------------

interface ToggleSwitchProps {
  label: string;
  on: boolean;
  onChange: (b: boolean) => void;
}
const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ label, on, onChange }) => (
  <button
    role="switch"
    aria-checked={on}
    className="toggle-switch"
    onClick={() => onChange(!on)}
  >
    {label}: {on ? 'ON' : 'OFF'}
  </button>
);


interface StudioTabsProps {
  current: Studio;
  setCurrent: (s: Studio) => void;
}
const StudioTabs: React.FC<StudioTabsProps> = ({ current, setCurrent }) => {
  const handleKey = (e: React.KeyboardEvent<HTMLButtonElement>, s: Studio, locked: boolean) => {
    if (locked) return;
    if (e.key === 'Enter' || e.key === ' ') setCurrent(s);
  };

  // static lock placeholder; could be driven by profit state later
  const isFlightLocked = true;

  return (
    <>
      <span className="hud-label" aria-hidden="true">HUD</span>
      <div role="tablist" className="studio-tabs">
        {studios.map((s) => {
          const locked = s === 'flight' && isFlightLocked;
          return (
            <button
              key={s}
              role="tab"
              aria-selected={current === s}
              tabIndex={current === s ? 0 : -1}
              className={current === s ? 'active' : ''}
              onClick={() => !locked && setCurrent(s)}
              onKeyDown={(e) => handleKey(e, s, locked)}
              aria-disabled={locked}
              title={locked ? 'Unlock after $2k profit' : undefined}
              style={locked ? { opacity: 0.5, pointerEvents: 'none' } : undefined}
            >
              {s.toUpperCase()}
              {locked && ' 🔒'}
            </button>
          );
        })}
      </div>
    </>
  );
};

interface VisibilityTogglesProps {
  vis: VisibilityState;
  toggle: (k: keyof VisibilityState) => void;
}
const VisibilityToggles: React.FC<VisibilityTogglesProps> = ({ vis, toggle }) => (
  <div className="toggles">
    <button
      onClick={() => toggle('header')}
      aria-label="Toggle Header"
      aria-pressed={vis.header}
    >
      H
    </button>
    <button
      onClick={() => toggle('left')}
      aria-label="Toggle Left Sidebar"
      aria-pressed={vis.left}
    >
      L
    </button>
    <button
      onClick={() => toggle('right')}
      aria-label="Toggle Right Sidebar"
      aria-pressed={vis.right}
    >
      R
    </button>
    <button
      onClick={() => toggle('bottom')}
      aria-label="Toggle Bottom Bar"
      aria-pressed={vis.bottom}
    >
      B
    </button>
  </div>
);

const TelemetryStrip: React.FC = () => (
  <div className="telemetry-strip">
    <span>PING 12ms</span>
    <span>Mach 4.20</span>
    <span>{new Date().toLocaleString()}</span>
  </div>
);

const HeaderRegion: React.FC = () => (
  <header id="header-region" className="region">
    <div className="brand">Paulie's Studios</div>
    <Card title="ILLUMINATION SWITCHBOARD">
      <p>(controls coming later)</p>
    </Card>
  </header>
);

// theme management
const themes: Record<string, Record<string,string>> = {
  'webpage-light': {
    '--bg': '#ffffff',
    '--fg': '#000000',
    '--accent': '#0066cc',
  },
  'mosaic-1993-light': {
    '--bg': '#008080',
    '--fg': '#000000',
    '--accent': '#cccccc',
  },
  'mosaic-1993-dark': {
    '--bg': '#004040',
    '--fg': '#ffffff',
    '--accent': '#888888',
  },
};

function applyTheme(name: string) {
  const root = document.documentElement;
  root.setAttribute('data-theme', name);
  const vars = themes[name] || {};
  for (const k in vars) {
    root.style.setProperty(k, vars[k]);
  }
}

const LeftSidebarContent: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [threeD, setThreeD] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('webpage-light');

  const switchTheme = (theme: string) => {
    setCurrentTheme(theme);
    applyTheme(darkMode && theme === 'mosaic-1993-light' ? 'mosaic-1993-dark' : theme);
  };

  useState(() => applyTheme(currentTheme));

  return (
    <>
      <div className="region-title">SYSTEM DESIGN</div>
      <Card title="MODES">
        <ToggleSwitch
          label="Dark"
          on={darkMode}
          onChange={(val) => {
            setDarkMode(val);
            // flip to dark variant if mosaic theme
            if (currentTheme === 'mosaic-1993-light' && val) {
              applyTheme('mosaic-1993-dark');
            } else if (currentTheme === 'mosaic-1993-dark' && !val) {
              applyTheme('mosaic-1993-light');
            }
          }}
        />
        <ToggleSwitch label="3D" on={threeD} onChange={setThreeD} />
      </Card>
      <Card title="SYSTEM THEME">
        <div className="theme-grid">
          <button onClick={() => switchTheme('webpage-light')}>Webpage</button>
          <button onClick={() => switchTheme('mosaic-1993-light')}>Mosaic</button>
        </div>
      </Card>
    </>
  );
};

const NoteTaker: React.FC = () => {
  const [text, setText] = useState('');
  return (
    <div>
      <textarea
        aria-label="Inspector notes"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type notes here..."
      />
    </div>
  );
};

const InspectorBooks: React.FC = () => {
  const books = ['Notes', 'Positions', 'History'] as const;
  type Book = typeof books[number];
  const [active, setActive] = useState<Book>('Notes');

  return (
    <div className="inspector">
      <div role="tablist" className="inspector-books">
        {books.map((b) => (
          <button
            key={b}
            role="tab"
            aria-selected={active === b}
            onClick={() => setActive(b)}
          >
            {b}
          </button>
        ))}
      </div>
      <div className="inspector-panel">
        {active === 'Notes' && <NoteTaker />}
        {active === 'Positions' && <p>Positions list / P&amp;L chart</p>}
        {active === 'History' && <p>History log</p>}
      </div>
    </div>
  );
};

const RightSidebarContent: React.FC = () => (
  <>
    <div className="region-title">INSPECTOR PANEL</div>
    <Card title="INSPECTOR">
      <InspectorBooks />
    </Card>
    {/* send-card pinned to bottom, no header */}
    <Card className="no-header">
      <textarea placeholder="ideas and requests" aria-label="Feedback" />
      <button>Send to Paulie</button>
    </Card>
  </>
);

// small representation of active palette
const ActivePaletteCard: React.FC = () => (
  <Card title="Active Palette">
    <div className="palette-swatch-row">
      {[...Array(5)].map((_,i) => (
        <div key={i} className="swatch" />
      ))}
    </div>
  </Card>
);

// placeholder man-o'-meters card
const ManometersCard: React.FC = () => (
  <Card title="Man-O'-Meters">
    <div className="manometer-grid">
      {["BATT","NET","MEM","CPU"].map((label) => (
        <div key={label} className="manometer">
          <div className="meter-face">{label}</div>
        </div>
      ))}
    </div>
  </Card>
);

// System logs card component
const SystemLogsCard: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const addLog = () => {
    const msg = `log at ${new Date().toLocaleTimeString()}`;
    setLogs((l) => [...l, msg]);
  };
  return (
    <Card title="System Logs">
      <button onClick={addLog} style={{fontSize:'0.8rem', marginBottom:'0.5rem'}}>+</button>
      <ul className="logs-list">
        {logs.length === 0 ? <li className="log-empty">no logs</li> : logs.map((l,i) => <li key={i}>{l}</li>)}
      </ul>
    </Card>
  );
};

// Web elements showcase card
const WebElementsCard: React.FC = () => (
  <Card title="Web Elements">
    <div className="elements-grid">
      <button className="btn primary">Primary</button>
      <button className="btn secondary">Secondary</button>
      <input className="input" placeholder="text input" />
      <label className="checkbox">
        <input type="checkbox" /> Check
      </label>
    </div>
  </Card>
);

const MainRegionContent: React.FC<{ studio: Studio }> = ({ studio }) => (
  <>
    <div className="region-title">Periscope Viewing Port</div>
    {/* only design studio shown cards for now */}
    {studio === 'design' && <ActivePaletteCard />}
    {studio === 'design' && <ManometersCard />}
    {studio === 'design' && <SystemLogsCard />}
    {studio === 'design' && <WebElementsCard />}
    <Card title="Periscope View">
      <p>Active theme / Man‑o‑Meters / logs</p>
    </Card>
  </>
);

// hangar bay specialized cards
const HangarBayContent: React.FC = () => (
  <div className="hangar-row">
    <Card title="Agent Access" className="hangar-card rectangle" />
    <Card title="P/L MFD" className="hangar-card square" />
    <Card title="Connect API Keys" className="hangar-card square" />
  </div>
);

const BottomBarContent: React.FC = () => (
  <>
    <HangarBayContent />
    <Card title="Ignition" />
  </>
);

// throttle control for ignition panel
const ThrottleCard: React.FC = () => {
  const modes = ['AUTO','SEMI-AUTO','STOP'] as const;
  type Mode = typeof modes[number];
  const [mode, setMode] = useState<Mode>('STOP');
  const [locked, setLocked] = useState(false);

  const cycle = (dir: 1|-1) => {
    if (locked) return;
    const idx = modes.indexOf(mode);
    const next = modes[(idx + dir + modes.length) % modes.length];
    setMode(next);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') cycle(1);
    if (e.key === 'ArrowLeft') cycle(-1);
    if (e.key === ' ' || e.key === 'Enter') cycle(1);
  };

  return (
    <Card title="Global Throttle">
      <div
        role="radiogroup"
        tabIndex={0}
        onKeyDown={handleKey}
        className="throttle-telegraph"
        aria-label="Global throttle control"
      >
        {modes.map((m) => (
          <div
            key={m}
            role="radio"
            aria-checked={mode===m}
            className={"telegraph-panel" + (mode===m?" active":"")}
            onClick={() => !locked && setMode(m)}
          >
            {m}
          </div>
        ))}
      </div>
      <button
        className="lock-toggle"
        aria-pressed={locked}
        onClick={() => setLocked(!locked)}
      >
        {locked ? 'Unlock' : 'Lock'}
      </button>
    </Card>
  );
};

// ---------------------------------------------------------------------------

export function App() {
  const [currentStudio, setCurrentStudio] = useState<Studio>('design');
  const [vis, setVis] = useState<VisibilityState>({
    header: true,
    left: true,
    right: true,
    bottom: true,
  });

  const toggle = (key: keyof VisibilityState) => {
    setVis((v) => ({ ...v, [key]: !v[key] }));
  };

  // container no longer uses automatic scaling; sizes are hand‑tuned
  return (
    <div id="app" className="quad-grid">
      {/* everything that belongs in quadrant II goes inside this container */}
      <div id="quadrant-ii" className="quadrant" data-testid="quadrant-ii">
        <div id="quadrant-ii-inner">
        {/* fullscreen toggle for switching to normal scale */}
        <button
          onClick={() => document.documentElement.classList.toggle('fullscreen')}
          style={{position:'absolute',top:0,right:0, zIndex:10, fontSize:'0.8rem'}}
        >full</button>
        {vis.header && <HeaderRegion />}
        <nav id="nav-region" className="region" aria-label="Navigation">
          <StudioTabs current={currentStudio} setCurrent={setCurrentStudio} />
          <VisibilityToggles vis={vis} toggle={toggle} />
          <TelemetryStrip />
        </nav>
        {vis.left && (
          <aside id="left-sidebar" className="region" data-testid="left-sidebar">
            <LeftSidebarContent />
          </aside>
        )}
        {vis.right && (
          <aside id="right-sidebar" className="region" data-testid="right-sidebar">
            <RightSidebarContent />
          </aside>
        )}
        <main id="main-region" className="region" data-testid="main-region">
          MAIN REGION - {currentStudio.toUpperCase()}
          <div className="main-cards">
            <MainRegionContent studio={currentStudio} />
          </div>
        </main>
        {vis.bottom && (
          <div id="bottom-bar" className="region" data-testid="bottom-bar">
            <BottomBarContent />
          </div>
        )}
        <div id="action-bar" className="region" data-testid="action-bar">
          <ThrottleCard />
        </div>
      </div> {/* end quadrant-ii-inner */}
      </div>      {/* preserve empty quadrants around II */}
      <div id="quadrant-i" className="quadrant" data-testid="quadrant-i" />
      <div id="quadrant-iii" className="quadrant" data-testid="quadrant-iii" />
      <div id="quadrant-iv" className="quadrant" data-testid="quadrant-iv" />
    </div>
  );
}

// only boot in browser
if (typeof document !== 'undefined') {
  const rootElement = document.getElementById('app');
  if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(<App />);
  } else {
    console.error('Root element not found');
  }
}

export default App;
