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
  const tabRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

  const focusTab = (index: number) => {
    const el = tabRefs.current[index];
    if (el) el.focus();
  };

  const handleKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = studios.findIndex((s) => s === current);
    if (currentIndex === -1) return;

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = (currentIndex + 1) % studios.length;
      focusTab(next);
      setCurrent(studios[next]);
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = (currentIndex - 1 + studios.length) % studios.length;
      focusTab(prev);
      setCurrent(studios[prev]);
    }
    if (e.key === 'Home') {
      e.preventDefault();
      focusTab(0);
      setCurrent(studios[0]);
    }
    if (e.key === 'End') {
      e.preventDefault();
      focusTab(studios.length - 1);
      setCurrent(studios[studios.length - 1]);
    }
  };

  // static lock placeholder; could be driven by profit state later
  const isFlightLocked = true;

  const icons: Record<Studio, React.ReactNode> = {
    design: (
      <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 2l4 4-4 4-4-4 4-4zm0 12c-4.41 0-8 3.59-8 8h16c0-4.41-3.59-8-8-8z"
          fill="currentColor"
        />
      </svg>
    ),
    trade: (
      <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M4 4h16v2H4V4zm0 6h16v2H4v-2zm0 6h10v2H4v-2z"
          fill="currentColor"
        />
      </svg>
    ),
    flight: (
      <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M2 21l21-9L2 3v7l15 2-15 2v7z"
          fill="currentColor"
        />
      </svg>
    ),
    convert: (
      <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M4 4h16v2H4V4zm0 6h10v2H4v-2zm0 6h16v2H4v-2z"
          fill="currentColor"
        />
      </svg>
    ),
  };

  return (
    <>
      <span className="hud-label" aria-hidden="true">
        HUD
      </span>
      <div role="tablist" className="studio-tabs" onKeyDown={handleKey}>
        {studios.map((s, idx) => {
          const locked = s === 'flight' && isFlightLocked;
          return (
            <button
              key={s}
              ref={(el) => (tabRefs.current[idx] = el)}
              role="tab"
              aria-selected={current === s}
              tabIndex={current === s ? 0 : -1}
              className={`studio-tab ${current === s ? 'active' : ''}`}
              onClick={() => !locked && setCurrent(s)}
              aria-disabled={locked}
              style={locked ? { opacity: 0.5, pointerEvents: 'none' } : undefined}
            >
              <span className="tab-icon" aria-hidden="true">
                {icons[s]}
              </span>
              <span className="tab-label">{s.toUpperCase()}</span>
              {locked && <span className="tab-lock">🔒</span>}
            </button>
          );
        })}
      </div>
    </>
  );
};

interface PanelTogglesProps {
  vis: VisibilityState;
  toggle: (k: keyof VisibilityState) => void;
  fullscreenOn: boolean;
  toggleFullscreen: () => void;
}
const PanelToggles: React.FC<PanelTogglesProps> = ({ vis, toggle, fullscreenOn, toggleFullscreen }) => (
  <div className="panel-toggle-group" role="group" aria-label="Toggle UI regions">
    <button
      className="panel-toggle header-toggle"
      type="button"
      onClick={() => toggle('header')}
      aria-label="Toggle Header"
      aria-pressed={vis.header}
      title="Toggle Header"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
        <rect x="0" y="0" width="16" height="4" fill="currentColor" opacity={vis.header ? 1 : 0.25} />
        <rect x="0" y="4" width="16" height="12" fill="currentColor" opacity={vis.header ? 0.25 : 0.1} />
      </svg>
    </button>

    <button
      className="panel-toggle left-toggle"
      type="button"
      onClick={() => toggle('left')}
      aria-label="Toggle left sidebar"
      aria-pressed={vis.left}
      title="Toggle left sidebar"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
        <rect x="0" y="0" width="5" height="16" fill="currentColor" opacity={vis.left ? 1 : 0.25} />
        <rect x="5" y="0" width="11" height="16" fill="currentColor" opacity={vis.left ? 0.25 : 0.1} />
      </svg>
    </button>

    <button
      className={`panel-toggle max-toggle${fullscreenOn ? ' active' : ''}`}
      type="button"
      onClick={toggleFullscreen}
      aria-label="Toggle max view"
      aria-pressed={fullscreenOn}
      title="Toggle max view"
    >
      MAX
    </button>

    <button
      className="panel-toggle right-toggle"
      type="button"
      onClick={() => toggle('right')}
      aria-label="Toggle right sidebar"
      aria-pressed={vis.right}
      title="Toggle right sidebar"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
        <rect x="0" y="0" width="11" height="16" fill="currentColor" opacity={vis.right ? 0.25 : 0.1} />
        <rect x="11" y="0" width="5" height="16" fill="currentColor" opacity={vis.right ? 1 : 0.25} />
      </svg>
    </button>

    <button
      className="panel-toggle bottom-toggle"
      type="button"
      onClick={() => toggle('bottom')}
      aria-label="Toggle bottom bar"
      aria-pressed={vis.bottom}
      title="Toggle bottom bar"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
        <rect x="0" y="0" width="16" height="8" fill="currentColor" opacity={vis.bottom ? 1 : 0.25} />
        <rect x="0" y="8" width="16" height="8" fill="currentColor" opacity={vis.bottom ? 0.25 : 0.1} />
      </svg>
    </button>
  </div>
);

const TelemetryStrip: React.FC = () => {
  const [now, setNow] = React.useState(() => new Date());
  const [ping, setPing] = React.useState(12);
  const [cpu, setCpu] = React.useState(42);
  const [mem, setMem] = React.useState(1.2);
  const [marketMode] = React.useState<'live' | 'demo' | 'offline'>('demo');

  const formatTimestamp = (d: Date) => {
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${month}/${day} ${hours}:${minutes}`;
  };

  React.useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(new Date());
      // simulate small telemetry fluctuations
      setPing((p) => Math.max(1, Math.min(99, p + (Math.random() * 10 - 5))));
      setCpu((c) => Math.max(1, Math.min(99, c + (Math.random() * 4 - 2))));
      setMem((m) => Math.max(0.4, Math.min(8, m + (Math.random() * 0.1 - 0.05))));
    }, 1000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="telemetry-strip" aria-label="Telemetry readout" role="status">
      <span className="market-indicator" aria-label={`Market mode ${marketMode}`}>
        <span className={`market-led ${marketMode}`} aria-hidden="true" />
        {marketMode.toUpperCase()}
      </span>
      <span>PING {Math.round(ping)}ms</span>
      <span>CPU {Math.round(cpu)}%</span>
      <span>MEM {mem.toFixed(1)}GB</span>
      <span>{formatTimestamp(now)}</span>
    </div>
  );
};

const Nixie: React.FC<{ value: number }> = ({ value }) => (
  <span className="nixie">{value.toFixed(0).padStart(2, '0')}</span>
);

const Dial: React.FC<{ value: number; onChange: (v: number) => void }> = ({ value, onChange }) => {
  const step = 1;
  const min = 2;
  const max = 10;
  const sweep = ((value - min) / (max - min)) * 270;
  const pointer = sweep - 135;
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="dial"
      aria-label="Dimmer dial"
      style={
        {
          '--dial-sweep': `${sweep}deg`,
          '--dial-pointer': `${pointer}deg`,
        } as React.CSSProperties
      }
    />
  );
};

type IlluminationToggleConfig = {
  label: string;
  on: boolean;
  onToggle: () => void;
  ledOn: boolean;
  ledTone?: 'accent' | 'day' | 'nvg';
  dimmer?: number;
  onDimmer?: (v: number) => void;
  channelLabel?: string;
};

const IlluminationToggleUnit: React.FC<IlluminationToggleConfig> = ({
  label,
  on,
  onToggle,
  ledOn,
  ledTone = 'accent',
}) => (
  <div className="illumination-toggle-unit">
    <button
      className={`illumination-toggle ${on ? 'on' : 'off'}`}
      onClick={onToggle}
      aria-pressed={on}
      aria-label={`${label} toggle`}
    >
      <span className="illumination-toggle-knob" aria-hidden="true" />
    </button>
    <span
      className={`illumination-led ${ledOn ? 'on' : ''} ${ledTone}`}
      aria-hidden="true"
    />
  </div>
);

const IlluminationChannelRow: React.FC<IlluminationToggleConfig> = ({
  label,
  on,
  onToggle,
  ledOn,
  ledTone,
  dimmer,
  onDimmer,
  channelLabel,
}) => {
  const hasDial = typeof dimmer === 'number' && typeof onDimmer === 'function';
  return (
    <div className={`illumination-channel${hasDial ? '' : ' no-dial'}`}>
      {channelLabel && (
        <div className="illumination-channel-label" aria-hidden="true">
          {channelLabel}
        </div>
      )}
      <IlluminationToggleUnit
        label={label}
        on={on}
        onToggle={onToggle}
        ledOn={ledOn}
        ledTone={ledTone}
      />
      {hasDial && (
        <div className="illumination-dial-stack">
          <Dial value={dimmer} onChange={onDimmer} />
          <Nixie value={dimmer} />
        </div>
      )}
    </div>
  );
};

const IlluminationColumn: React.FC<{
  label: string;
  channels: IlluminationToggleConfig[];
}> = ({ label, channels }) => (
  <div className="illumination-column">
    <div className="illumination-column-label" aria-hidden="true">
      {label}
    </div>
    <div className="illumination-channel-stack">
      {channels.map((channel) => (
        <IlluminationChannelRow key={channel.label} {...channel} />
      ))}
    </div>
  </div>
);

const IlluminationSwitchboard: React.FC<{
  dayMode: boolean;
  setDayMode: (v: boolean) => void;
}> = ({ dayMode, setDayMode }) => {
  const [masterOn, setMasterOn] = useState(false);
  const [masterDimmer, setMasterDimmer] = useState(10);
  const [textPrimaryOn, setTextPrimaryOn] = useState(true);
  const [textPrimaryDimmer, setTextPrimaryDimmer] = useState(10);
  const [textSecondaryOn, setTextSecondaryOn] = useState(true);
  const [textSecondaryDimmer, setTextSecondaryDimmer] = useState(10);
  const [barsPrimaryOn, setBarsPrimaryOn] = useState(true);
  const [barsPrimaryDimmer, setBarsPrimaryDimmer] = useState(10);
  const [barsSecondaryOn, setBarsSecondaryOn] = useState(true);
  const [barsSecondaryDimmer, setBarsSecondaryDimmer] = useState(10);
  const [floodOn, setFloodOn] = useState(true);
  const [floodDimmer, setFloodDimmer] = useState(10);
  const [displayOn, setDisplayOn] = useState(true);
  const [displayDimmer, setDisplayDimmer] = useState(10);

  React.useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('nvg', !dayMode);
  }, [dayMode]);

  React.useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('master', masterOn);
  }, [masterOn]);

  React.useEffect(() => {
    const root = document.documentElement;

    const baseModeIntensity = dayMode ? 0.6 : 1.0;
    const masterScale = masterOn ? 1 : 0;

    const normalize = (on: boolean, dimmer: number) =>
      on ? baseModeIntensity * masterScale * (dimmer / 10) : 0;

    const textPrimary = normalize(textPrimaryOn, textPrimaryDimmer);
    const textSecondary = normalize(textSecondaryOn, textSecondaryDimmer);
    const barsPrimary = normalize(barsPrimaryOn, barsPrimaryDimmer);
    const barsSecondary = normalize(barsSecondaryOn, barsSecondaryDimmer);
    const flood = normalize(floodOn, floodDimmer);
    const display = normalize(displayOn, displayDimmer);

    root.style.setProperty('--fx-master-scale', String(masterScale));
    root.style.setProperty('--fx-glow-text-primary', String(textPrimary));
    root.style.setProperty('--fx-glow-text-secondary', String(textSecondary));
    root.style.setProperty('--fx-glow-bars-primary', String(barsPrimary));
    root.style.setProperty('--fx-glow-bars-secondary', String(barsSecondary));
    root.style.setProperty('--fx-glow-flood', String(flood));
    root.style.setProperty('--fx-glow-display', String(display));

    root.classList.toggle('text-glow', textPrimary > 0 || textSecondary > 0);
    root.classList.toggle('bar-glow', barsPrimary > 0 || barsSecondary > 0);
    root.classList.toggle('flood', flood > 0);
    root.classList.toggle('display-glow', display > 0);
  }, [
    dayMode,
    masterOn,
    textPrimaryOn,
    textPrimaryDimmer,
    textSecondaryOn,
    textSecondaryDimmer,
    barsPrimaryOn,
    barsPrimaryDimmer,
    barsSecondaryOn,
    barsSecondaryDimmer,
    floodOn,
    floodDimmer,
    displayOn,
    displayDimmer,
  ]);

  return (
    <Card className="illumination-card">
      <div className="illumination-panel" aria-label="Illumination switchboard">
        <div className="illumination-sticker" aria-hidden="true">
          ILLUMINATION
        </div>
        <div className="illumination-top-rail" aria-hidden="true" />
        <div className="illumination-columns">
          <IlluminationColumn
            label="DAY/NVG"
            channels={[
              {
                label: 'Day/NVG mode',
                on: dayMode,
                onToggle: () => setDayMode(!dayMode),
                ledOn: true,
                ledTone: dayMode ? 'day' : 'nvg',
              },
            ]}
          />
          <IlluminationColumn
            label="MASTER"
            channels={[
              {
                label: 'Master power',
                on: masterOn,
                onToggle: () => setMasterOn((v) => !v),
                ledOn: masterOn,
                dimmer: masterDimmer,
                onDimmer: setMasterDimmer,
              },
            ]}
          />
          <IlluminationColumn
            label="TEXT"
            channels={[
              {
                label: 'Text primary',
                on: textPrimaryOn,
                onToggle: () => setTextPrimaryOn((v) => !v),
                ledOn: masterOn && textPrimaryOn,
                dimmer: textPrimaryDimmer,
                onDimmer: setTextPrimaryDimmer,
                channelLabel: 'PRI',
              },
              {
                label: 'Text secondary',
                on: textSecondaryOn,
                onToggle: () => setTextSecondaryOn((v) => !v),
                ledOn: masterOn && textSecondaryOn,
                dimmer: textSecondaryDimmer,
                onDimmer: setTextSecondaryDimmer,
                channelLabel: 'SEC',
              },
            ]}
          />
          <IlluminationColumn
            label="BARS"
            channels={[
              {
                label: 'Bars primary',
                on: barsPrimaryOn,
                onToggle: () => setBarsPrimaryOn((v) => !v),
                ledOn: masterOn && barsPrimaryOn,
                dimmer: barsPrimaryDimmer,
                onDimmer: setBarsPrimaryDimmer,
                channelLabel: 'PRI',
              },
              {
                label: 'Bars secondary',
                on: barsSecondaryOn,
                onToggle: () => setBarsSecondaryOn((v) => !v),
                ledOn: masterOn && barsSecondaryOn,
                dimmer: barsSecondaryDimmer,
                onDimmer: setBarsSecondaryDimmer,
                channelLabel: 'SEC',
              },
            ]}
          />
          <IlluminationColumn
            label="FLOOD"
            channels={[
              {
                label: 'Flood lights',
                on: floodOn,
                onToggle: () => setFloodOn((v) => !v),
                ledOn: masterOn && floodOn,
                dimmer: floodDimmer,
                onDimmer: setFloodDimmer,
              },
            ]}
          />
          <IlluminationColumn
            label="DISPLAY"
            channels={[
              {
                label: 'Display lights',
                on: displayOn,
                onToggle: () => setDisplayOn((v) => !v),
                ledOn: masterOn && displayOn,
                dimmer: displayDimmer,
                onDimmer: setDisplayDimmer,
              },
            ]}
          />
        </div>
        <div className="illumination-bottom-title" aria-hidden="true">
          ILLUMINATION SWITCHBOARD
        </div>
      </div>
    </Card>
  );
};

const HeaderRegion: React.FC<{
  studio: Studio;
  dayMode: boolean;
  setDayMode: (v: boolean) => void;
}> = ({ studio, dayMode, setDayMode }) => {
  const title = React.useMemo(() => {
    switch (studio) {
      case 'design':
        return "Paulie's Studios";
      case 'trade':
        return "Paulie's Prediction Partners 🤖";
      case 'flight':
        return "Paulie's Flight Simulator";
      case 'convert':
        return "Paulie's File Converting Studio";
      default:
        return "Paulie's Studios";
    }
  }, [studio]);

  return (
    <header id="header-region" className="region" data-testid="header-region">
      <div className="brand">{title}</div>
      <IlluminationSwitchboard dayMode={dayMode} setDayMode={setDayMode} />
    </header>
  );
};

// theme management
type ThemeConfig = {
  vars: Record<string, string>;
  palette: string[];
};

const themes: Record<string, ThemeConfig> = {
  'webpage-light': {
    vars: {
      '--bg': '#f5f6f8',
      '--fg': '#121316',
      '--accent': '#0b6bcb',
      '--panel-bg': 'rgba(255,255,255,0.7)',
      '--panel-bg-strong': 'rgba(255,255,255,0.92)',
      '--panel-border': 'rgba(0,0,0,0.12)',
      '--panel-border-strong': 'rgba(0,0,0,0.2)',
      '--panel-muted': 'rgba(0,0,0,0.35)',
      '--panel-muted-strong': 'rgba(0,0,0,0.55)',
      '--panel-ink': 'rgba(0,0,0,0.72)',
      '--panel-shadow': 'rgba(0,0,0,0.2)',
      '--accent-soft': 'rgba(11,107,203,0.25)',
      '--accent-strong': 'rgba(11,107,203,0.9)',
      '--success': '#2da44e',
      '--danger': '#d1242f',
      '--warning': '#b88100',
      '--nixie-bg': 'rgba(20,14,8,0.85)',
      '--nixie-border': 'rgba(171,87,0,0.7)',
      '--nixie-text': 'rgba(204,120,40,1)',
      '--nixie-glow': 'rgba(204,120,40,0.6)',
    },
    palette: [
      '#0b6bcb', '#2aa3ff', '#77d1ff', '#eff4ff',
      '#20a36c', '#6cd3a1', '#e6f7ef', '#f3f1e7',
      '#f2b705', '#ffd166', '#fff2c2', '#f29f05',
      '#b12a5b', '#e86b9b', '#f8d6e2', '#8a6fd1',
    ],
  },
  'webpage-dark': {
    vars: {
      '--bg': '#0f1114',
      '--fg': '#f0f2f5',
      '--accent': '#49a1ff',
      '--panel-bg': 'rgba(12,14,18,0.75)',
      '--panel-bg-strong': 'rgba(18,20,26,0.9)',
      '--panel-border': 'rgba(255,255,255,0.14)',
      '--panel-border-strong': 'rgba(255,255,255,0.25)',
      '--panel-muted': 'rgba(255,255,255,0.55)',
      '--panel-muted-strong': 'rgba(255,255,255,0.75)',
      '--panel-ink': 'rgba(0,0,0,0.55)',
      '--panel-shadow': 'rgba(0,0,0,0.6)',
      '--accent-soft': 'rgba(73,161,255,0.25)',
      '--accent-strong': 'rgba(73,161,255,0.9)',
      '--success': '#7cff73',
      '--danger': '#ff6b6b',
      '--warning': '#f4b000',
      '--nixie-bg': 'rgba(0,0,0,0.75)',
      '--nixie-border': 'rgba(255,135,0,0.75)',
      '--nixie-text': 'rgba(255,175,50,1)',
      '--nixie-glow': 'rgba(255,160,50,0.7)',
    },
    palette: [
      '#49a1ff', '#2f6fdd', '#1b2a41', '#1a1d24',
      '#3ddc97', '#1f6f4b', '#0c3b2e', '#3a4a5f',
      '#f4b000', '#f8d277', '#5a4a1a', '#1c1510',
      '#d85b7b', '#7a2f44', '#2b1b22', '#6f5bd4',
    ],
  },
  'mosaic-1993-light': {
    vars: {
      '--bg': '#0c7c7a',
      '--fg': '#051414',
      '--accent': '#c0c0c0',
      '--panel-bg': 'rgba(10,110,110,0.72)',
      '--panel-bg-strong': 'rgba(14,130,130,0.9)',
      '--panel-border': 'rgba(5,20,20,0.25)',
      '--panel-border-strong': 'rgba(5,20,20,0.4)',
      '--panel-muted': 'rgba(5,20,20,0.55)',
      '--panel-muted-strong': 'rgba(5,20,20,0.75)',
      '--panel-ink': 'rgba(0,0,0,0.4)',
      '--panel-shadow': 'rgba(0,0,0,0.3)',
      '--accent-soft': 'rgba(192,192,192,0.3)',
      '--accent-strong': 'rgba(192,192,192,0.9)',
      '--success': '#2ea47b',
      '--danger': '#d45555',
      '--warning': '#c49a2e',
      '--nixie-bg': 'rgba(8,18,18,0.7)',
      '--nixie-border': 'rgba(180,120,40,0.7)',
      '--nixie-text': 'rgba(255,195,120,1)',
      '--nixie-glow': 'rgba(255,195,120,0.6)',
    },
    palette: [
      '#c0c0c0', '#9bb1a6', '#c5d9d2', '#e6f2ee',
      '#2ea47b', '#7bd4b3', '#d6f5ea', '#0c7c7a',
      '#f1c40f', '#f7dc6f', '#f0e2b6', '#c49a2e',
      '#b65b5b', '#d98f8f', '#f0c8c8', '#7a8aa6',
    ],
  },
  'mosaic-1993-dark': {
    vars: {
      '--bg': '#003c3c',
      '--fg': '#e8f5f5',
      '--accent': '#8f8f8f',
      '--panel-bg': 'rgba(0,42,42,0.78)',
      '--panel-bg-strong': 'rgba(0,54,54,0.92)',
      '--panel-border': 'rgba(232,245,245,0.18)',
      '--panel-border-strong': 'rgba(232,245,245,0.3)',
      '--panel-muted': 'rgba(232,245,245,0.55)',
      '--panel-muted-strong': 'rgba(232,245,245,0.75)',
      '--panel-ink': 'rgba(0,0,0,0.55)',
      '--panel-shadow': 'rgba(0,0,0,0.6)',
      '--accent-soft': 'rgba(143,143,143,0.3)',
      '--accent-strong': 'rgba(143,143,143,0.9)',
      '--success': '#7cdcae',
      '--danger': '#e77878',
      '--warning': '#e2c065',
      '--nixie-bg': 'rgba(0,0,0,0.72)',
      '--nixie-border': 'rgba(255,135,0,0.65)',
      '--nixie-text': 'rgba(255,200,120,1)',
      '--nixie-glow': 'rgba(255,200,120,0.6)',
    },
    palette: [
      '#8f8f8f', '#5b6c6c', '#1a2c2c', '#0a1f1f',
      '#4cc28e', '#2d7d5b', '#1a4a38', '#7a8a98',
      '#e2c065', '#f0dda2', '#4a3f22', '#1b1f1f',
      '#c07c7c', '#6b3a3a', '#2d1b1b', '#5c6cc2',
    ],
  },
};

function applyTheme(name: string) {
  const root = document.documentElement;
  root.setAttribute('data-theme', name);
  const theme = themes[name] || themes['webpage-light'];
  const vars = theme.vars;
  for (const k in vars) {
    root.style.setProperty(k, vars[k]);
  }
}

interface LeftSidebarContentProps {
  dayMode: boolean;
  setDayMode: (v: boolean) => void;
  elevationOn: boolean;
  setElevationOn: (v: boolean) => void;
  themeBase: 'webpage' | 'mosaic-1993';
  setThemeBase: (v: 'webpage' | 'mosaic-1993') => void;
  themeKey: string;
}

const LeftSidebarContent: React.FC<LeftSidebarContentProps> = ({
  dayMode,
  setDayMode,
  elevationOn,
  setElevationOn,
  themeBase,
  setThemeBase,
  themeKey,
}) => {
  const darkMode = !dayMode;
  return (
    <>
      <div className="region-title">SYSTEM DESIGN</div>
      <Card title="MODES">
        <div className="mode-toggle-row">
          <button
            className="toggle-switch"
            onClick={() => setDayMode(!dayMode)}
            role="switch"
            aria-checked={darkMode}
            aria-label="Light or dark mode"
          >
            {darkMode ? '🌙 Dark' : '☀️ Light'}
          </button>
          <ToggleSwitch
            label="Elevation"
            on={elevationOn}
            onChange={setElevationOn}
          />
        </div>
      </Card>
      <Card title="SYSTEM THEME">
        <div className="theme-grid">
          {[
            { key: 'webpage', label: 'Webpage' },
            { key: 'mosaic-1993', label: 'Mosaic' },
          ].map((t) => {
            const key = `${t.key}-${darkMode ? 'dark' : 'light'}`;
            const selected = key === themeKey;
            return (
              <button
                key={t.key}
                className={selected ? 'active' : ''}
                onClick={() => setThemeBase(t.key as 'webpage' | 'mosaic-1993')}
                aria-pressed={selected}
              >
                {t.label}
              </button>
            );
          })}
        </div>
        <div className="theme-status">
          <span className="theme-status-label">Theme:</span>
          <span className="theme-status-value">{themeKey}</span>
        </div>
      </Card>
    </>
  );
};

const NotesPanel: React.FC = () => {
  const [text, setText] = useState('');
  return (
    <div className="notes-panel" aria-live="polite">
      <div className="notes-top">
        <div className="notes-dots" aria-hidden="true">
          <span className="dot active" />
          <span className="dot" />
          <span className="dot" />
        </div>
        <button className="btn tiny" type="button" aria-label="Upload note">
          Upload
        </button>
      </div>
      <div className="notepad">
        <textarea
          aria-label="Inspector notes"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type notes here..."
        />
      </div>
      <div className="notes-toolbar" role="group" aria-label="Formatting toolbar">
        <button className="btn tiny" type="button">B</button>
        <button className="btn tiny" type="button">H1</button>
        <button className="btn tiny" type="button">•</button>
        <button className="btn tiny" type="button">☑</button>
      </div>
      <div className="notes-controls">
        <button className="btn tiny" type="button">Save</button>
        <button className="btn tiny" type="button" aria-label="Previous page">◄</button>
        <span className="notes-page">Page 1 of 1</span>
        <button className="btn tiny" type="button" aria-label="Next page">►</button>
        <button className="btn tiny" type="button">Delete</button>
      </div>
    </div>
  );
};

const PositionsPanel: React.FC = () => (
  <div className="positions-panel" aria-live="polite">
    <div className="positions-list">
      <div className="empty">no positions</div>
    </div>
    <div className="positions-chart">
      <span className="chart-placeholder">no positions</span>
    </div>
  </div>
);

const HistoryPanel: React.FC = () => (
  <div className="history-panel" aria-live="polite">
    <div className="history-title">History log</div>
    <ul className="history-list">
      <li className="empty">no history</li>
    </ul>
  </div>
);

const InspectorBooks: React.FC = () => {
  const books = [
    { id: 'Notes', label: 'Notes', icon: '📓' },
    { id: 'Positions', label: 'Positions', icon: '📈' },
    { id: 'History', label: 'History', icon: '🕒' },
  ] as const;
  type Book = typeof books[number]['id'];
  const [active, setActive] = useState<Book>('Notes');
  const tabRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

  const focusTab = (index: number) => {
    const el = tabRefs.current[index];
    if (el) el.focus();
  };

  const handleKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = books.findIndex((b) => b.id === active);
    if (currentIndex === -1) return;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = (currentIndex + 1) % books.length;
      focusTab(next);
      setActive(books[next].id);
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = (currentIndex - 1 + books.length) % books.length;
      focusTab(prev);
      setActive(books[prev].id);
    }
  };

  return (
    <div className="inspector">
      <div role="tablist" className="inspector-tabs" onKeyDown={handleKey}>
        {books.map((b, idx) => (
          <button
            key={b.id}
            ref={(el) => (tabRefs.current[idx] = el)}
            role="tab"
            aria-selected={active === b.id}
            tabIndex={active === b.id ? 0 : -1}
            onClick={() => setActive(b.id)}
            title={b.label}
          >
            <span aria-hidden="true">{b.icon}</span>
            {b.id === 'Positions' && <span className="tab-badge" aria-hidden="true">0</span>}
          </button>
        ))}
      </div>
      <div className="inspector-panel">
        <div aria-hidden={active !== 'Notes'} hidden={active !== 'Notes'}>
          <NotesPanel />
        </div>
        <div aria-hidden={active !== 'Positions'} hidden={active !== 'Positions'}>
          <PositionsPanel />
        </div>
        <div aria-hidden={active !== 'History'} hidden={active !== 'History'}>
          <HistoryPanel />
        </div>
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
      <a
        className="btn primary"
        href="mailto:chickensaurusrex@outlook.com"
        role="button"
      >
        Send to Paulie
      </a>
    </Card>
  </>
);

// small representation of active palette
const ActivePaletteCard: React.FC<{ palette: string[] }> = ({ palette }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [copied, setCopied] = useState<string | null>(null);
  const swatches = palette.slice(0, 16);

  const selectSwatch = async (index: number) => {
    setActiveIndex(index);
    const color = swatches[index];
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(color);
        setCopied(color);
        window.setTimeout(() => setCopied(null), 1200);
      } catch {
        setCopied(null);
      }
    }
  };

  return (
    <Card title="Active Palette">
      <div className="palette-swatch-row">
        {swatches.map((color, i) => {
          const radius = 6 + ((i * 7) % 10);
          return (
            <div
              key={`${color}-${i}`}
              className={`swatch${i === activeIndex ? ' active' : ''}`}
              style={{ background: color, borderRadius: `${radius}px` }}
              role="button"
              aria-pressed={i === activeIndex}
              aria-label={`Copy ${color}`}
              tabIndex={0}
              onClick={() => selectSwatch(i)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') selectSwatch(i);
              }}
            />
          );
        })}
      </div>
      <div className="palette-meta">
        <span className="palette-active">{swatches[activeIndex]}</span>
        {copied && <span className="palette-copied">Copied</span>}
      </div>
    </Card>
  );
};

// placeholder man-o'-meters card
const ManometersCard: React.FC = () => {
  const gauges = [
    { key: 'batt', label: 'BATT', value: 7 },
    { key: 'net', label: 'NET', value: 4 },
    { key: 'mem', label: 'MEM', value: 5 },
    { key: 'cpu', label: 'CPU', value: 3 },
  ];

  return (
    <Card title="Man-O'-Meters">
      <div className="manometer-clover">
        {gauges.map(({ key, label, value }) => (
          <div
            key={label}
            className={`manometer meter-${key}`}
            aria-label={`${label} meter`}
          >
            <div className="meter-face">{label}</div>
            <div className="meter-bar">
              {[...Array(10)].map((_, idx) => (
                <div
                  key={idx}
                  className={`meter-segment${idx < value ? ' active' : ''}`}
                />
              ))}
            </div>
          </div>
        ))}
        <div className="manometer-pipes" aria-hidden="true" />
      </div>
    </Card>
  );
};

// System logs card component
const SystemLogsCard: React.FC = () => {
  const [logs, setLogs] = useState(() =>
    Array.from({ length: 7 }, () => ({ time: '--:--', text: 'awaiting log entry' }))
  );

  const addLog = () => {
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setLogs((prev) => {
      const next = [{ time, text: 'log added' }, ...prev];
      return next.slice(0, 7);
    });
  };

  return (
    <Card title="System Logs">
      <div className="logs-header">
        <button className="btn tiny" type="button" onClick={addLog}>
          Add log
        </button>
      </div>
      <ul className="logs-list">
        {logs.map((log, i) => (
          <li key={i}>
            <span className="log-time">{log.time}</span>
            <span className="log-icon" aria-hidden="true">•</span>
            <span className="log-text">{log.text}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
};

// Web elements showcase card
const WebElementsCard: React.FC = () => {
  const [sliderValue, setSliderValue] = useState(50);
  const [showGrid, setShowGrid] = useState(true);
  const [dropdown, setDropdown] = useState('Option A');
  const [radio, setRadio] = useState('A');

  return (
    <Card title="Web Elements">
      <div className="elements-grid">
        <button className="btn primary">Primary</button>
        <button className="btn secondary">Secondary</button>
        <button className="btn danger">Danger</button>
        <button className="btn ghost">Ghost</button>
        <button className="btn" disabled>Disabled</button>
        <div className="field">
          <label className="field-label" htmlFor="sample-input">
            Text Input
          </label>
          <input id="sample-input" className="input" placeholder="text input" />
        </div>
        <label className="checkbox">
          <input
            type="checkbox"
            checked={showGrid}
            onChange={(e) => setShowGrid(e.target.checked)}
          />
          Grid
        </label>
        <label className="radio">
          <input
            type="radio"
            name="sample-radio"
            checked={radio === 'A'}
            onChange={() => setRadio('A')}
          />
          Radio A
        </label>
        <label className="radio">
          <input
            type="radio"
            name="sample-radio"
            checked={radio === 'B'}
            onChange={() => setRadio('B')}
          />
          Radio B
        </label>
        <div className="field">
          <label className="field-label" htmlFor="sample-range">
            Range
          </label>
          <input
            id="sample-range"
            className="slider"
            type="range"
            min={0}
            max={100}
            value={sliderValue}
            onChange={(e) => setSliderValue(Number(e.target.value))}
          />
          <span className="slider-value">{sliderValue}</span>
        </div>
        <div className="field">
          <label className="field-label" htmlFor="sample-select">
            Select
          </label>
          <select
            id="sample-select"
            className="select"
            value={dropdown}
            onChange={(e) => setDropdown(e.target.value)}
          >
            <option>Option A</option>
            <option>Option B</option>
            <option>Option C</option>
          </select>
        </div>
        <div className="alert success" role="status">
          Success alert
        </div>
      </div>
    </Card>
  );
};

const MsPaintCard: React.FC<{ palette: string[] }> = ({ palette }) => {
  const [maximized, setMaximized] = useState(false);
  const paintPalette = palette.slice(0, 12);

  return (
    <Card title="MS PAINT 1998" className={`ms-paint-card${maximized ? ' maximized' : ''}`}>
      <div className="paint-header">
        <button
          className="btn tiny"
          type="button"
          onClick={() => setMaximized((v) => !v)}
          aria-pressed={maximized}
        >
          {maximized ? 'Restore' : 'Maximize'}
        </button>
      </div>
      <div className="paint-menu" role="menubar">
        <span role="menuitem">File</span>
        <span role="menuitem">Edit</span>
        <span role="menuitem">View</span>
        <span role="menuitem">Image</span>
        <span role="menuitem">Colors</span>
        <span role="menuitem">Help</span>
      </div>
      <div className="paint-body">
        <div className="paint-tools" aria-label="Tool palette">
          {['✏️', '🧽', '🖌️', '🪣', '✂️', '🔍'].map((tool, i) => (
            <button key={i} className="tool-btn" type="button" aria-label={`Tool ${i + 1}`}>
              {tool}
            </button>
          ))}
        </div>
        <div className="paint-canvas" aria-label="Canvas" role="img">
          Canvas
        </div>
        <div className="paint-colors" aria-label="Color palette">
          {paintPalette.map((color, i) => (
            <span key={i} className="paint-swatch" style={{ background: color }} />
          ))}
        </div>
      </div>
    </Card>
  );
};

const PeriscopeViewingPort: React.FC<{
  studio: Studio;
  themeKey: string;
  elevationOn: boolean;
  palette: string[];
}> = ({ studio, themeKey, elevationOn, palette }) => {
  const isDesign = studio === 'design';

  return (
    <div className="periscope">
      <div className="periscope-header">
        <div className="periscope-title">Periscope Viewing Port</div>
        <div className="periscope-subtitle">
          {themeKey} · {elevationOn ? 'Elevated' : 'Flat'}
        </div>
      </div>
      <div className="periscope-grid">
        <div className="periscope-card">
          <ActivePaletteCard palette={palette} />
        </div>
        <div className="periscope-card">
          <ManometersCard />
        </div>
        <div className="periscope-card periscope-wide">
          <SystemLogsCard />
        </div>
        <div className="periscope-card periscope-wide">
          <WebElementsCard />
        </div>
        <div className="periscope-canvas">
          <Card title="Viewport">
            <div className="periscope-canvas-placeholder">
              {isDesign ? 'Live preview / canvas placeholder' : 'Studio content goes here'}
            </div>
          </Card>
        </div>
      </div>
      {isDesign && (
        <div className="periscope-paint">
          <MsPaintCard palette={palette} />
        </div>
      )}
    </div>
  );
};

interface MainRegionContentProps {
  studio: Studio;
  themeKey: string;
  elevationOn: boolean;
  palette: string[];
}

const MainRegionContent: React.FC<MainRegionContentProps> = ({ studio, themeKey, elevationOn, palette }) => (
  <>
    <div className="region-title">MAIN REGION - {studio.toUpperCase()}</div>
    <PeriscopeViewingPort
      studio={studio}
      themeKey={themeKey}
      elevationOn={elevationOn}
      palette={palette}
    />
  </>
);


// small toggles used within agent cards
const TriStateToggle: React.FC<{
  value: 'AUTO' | 'STANDBY' | 'OFF';
  onChange: (v: 'AUTO' | 'STANDBY' | 'OFF') => void;
  label: string;
}> = ({ value, onChange, label }) => {
  const options: Array<'AUTO' | 'STANDBY' | 'OFF'> = ['AUTO', 'STANDBY', 'OFF'];
  return (
    <div className="telegraph-switch" role="radiogroup" aria-label={`${label} mode`}>
      {options.map((opt) => (
        <button
          key={opt}
          role="radio"
          aria-checked={value === opt}
          className={`telegraph-switch-panel${value === opt ? ' active' : ''}`}
          onClick={() => onChange(opt)}
        >
          <span className="telegraph-led" aria-hidden="true" />
          <span className="telegraph-label">{opt}</span>
        </button>
      ))}
    </div>
  );
};

const AgentCard: React.FC<{ name: string; icon: string }> = ({ name, icon }) => {
  const [mode, setMode] = useState<'AUTO' | 'STANDBY' | 'OFF'>('OFF');

  return (
    <div className="agent-card">
      <div className="agent-header">
        <span className="agent-icon" aria-hidden="true">
          {icon}
        </span>
        <span className="agent-name">{name}</span>
      </div>
      <TriStateToggle value={mode} onChange={setMode} label={name} />
    </div>
  );
};

const PLMFDCard: React.FC = () => {
  const [pl, setPl] = useState(123.45);
  const [equity, setEquity] = useState(10000);
  const [timeframe, setTimeframe] = useState('24h');
  const timeframes = ['24h', '1w', '1m', '1y', 'ALL'];
  const scales = ['$10', '$100', '$1k', '$10k', 'ALL'];

  return (
    <Card title="P/L MFD">
      <div className="pl-mfd">
        <div className="pl-header">
          <div className="pl-stats">
            <div className="pl-row">
              <span>Unrealized P/L</span>
              <span className={`pl-value ${pl >= 0 ? 'positive' : 'negative'}`}>
                ${pl.toFixed(2)}
              </span>
            </div>
            <div className="pl-row">
              <span>Equity</span>
              <span>${equity.toLocaleString()}</span>
            </div>
          </div>
          <div className="pl-controls">
            <button
              className="btn secondary"
              onClick={() => setPl((p) => p + (Math.random() - 0.5) * 50)}
            >
              Randomize
            </button>
          </div>
        </div>

        <div className="pl-chart" aria-label="P/L chart placeholder">
          <span className="pl-chart-placeholder">LINE CHART</span>
        </div>

        <div className="pl-axis-controls">
          <div className="pl-axis-label">Y:</div>
          <div className="pl-axis-buttons">
            {scales.map((v) => (
              <button key={v} className="btn secondary">
                {v}
              </button>
            ))}
          </div>
          <div className="pl-axis-label">X:</div>
          <div className="pl-axis-buttons">
            {timeframes.map((tf) => (
              <button
                key={tf}
                className={`btn secondary${tf === timeframe ? ' active' : ''}`}
                onClick={() => setTimeframe(tf)}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

const ConnectAPIKeysCard: React.FC = () => {
  const [mode, setMode] = useState<'Live' | 'Demo'>('Demo');
  const [key, setKey] = useState('');
  const [secret, setSecret] = useState('');
  const [connected, setConnected] = useState(false);

  const connect = () => {
    setConnected(true);
  };

  const forget = () => {
    setConnected(false);
    setKey('');
    setSecret('');
  };

  return (
    <Card title="Connect API Keys">
      <div className="api-keys">
        <div className="api-mode">
          <button
            className={`btn secondary${mode === 'Live' ? ' active' : ''}`}
            onClick={() => setMode('Live')}
            aria-pressed={mode === 'Live'}
          >
            Live
          </button>
          <button
            className={`btn secondary${mode === 'Demo' ? ' active' : ''}`}
            onClick={() => setMode('Demo')}
            aria-pressed={mode === 'Demo'}
          >
            Demo
          </button>
        </div>

        <div className="field">
          <label className="field-label" htmlFor="api-key">
            API Key
          </label>
          <input
            id="api-key"
            className="input masked"
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="enter key"
            disabled={connected}
            aria-label="API key input"
          />
        </div>

        <div className="field">
          <label className="field-label" htmlFor="api-secret">
            API Secret
          </label>
          <textarea
            id="api-secret"
            className="input masked"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="enter secret"
            rows={2}
            disabled={connected}
            aria-label="RSA key input"
          />
        </div>

        <div className="api-actions">
          {!connected ? (
            <button className="btn primary" onClick={connect} disabled={!key || !secret} aria-label="Connect Kalshi Stream">
              Connect Kalshi Stream
            </button>
          ) : (
            <button className="btn secondary" onClick={forget}>
              Forget keys
            </button>
          )}
          {connected && <span className="status">Connected</span>}
        </div>
      </div>
    </Card>
  );
};

const IgnitionCard: React.FC = () => {
  const [ignited, setIgnited] = useState(false);
  return (
    <Card title="Ignition">
      <div className="ignition-panel">
        <div className="ignition-status">
          Status: <strong>{ignited ? 'ONLINE' : 'OFFLINE'}</strong>
        </div>
        <button
          className={`btn ${ignited ? 'secondary' : 'primary'}`}
          onClick={() => setIgnited((v) => !v)}
        >
          {ignited ? 'Shutdown' : 'Ignite'}
        </button>
      </div>
    </Card>
  );
};

// hangar bay specialized cards
const HangarBayContent: React.FC = () => (
  <>
    <div className="region-title">Hangar Bay</div>
    <div className="hangar-row">
      <Card title="Agent Access" className="hangar-card rectangle">
        <div className="card-strip" aria-hidden="true" />
        <div className="agent-legend" aria-hidden="true">
          A · S · ⛔
        </div>
        <div className="agent-grid">
          <AgentCard name="Peritia" icon="🔮" />
          <AgentCard name="Volume" icon="⚙️" />
          <AgentCard name="Crypto" icon="🚀" />
          <AgentCard name="Financials" icon="📈" />
          <AgentCard name="Politics" icon="🗳️" />
          <AgentCard name="B.Y.O.B" icon="🧠" />
          <AgentCard name="007-Gemini" icon="🛰️" />
        </div>
        <div className="card-nameplate">AGENT ACCESS BAY</div>
      </Card>
      <div className="hangar-card square">
        <PLMFDCard />
      </div>
      <div className="hangar-card square">
        <ConnectAPIKeysCard />
      </div>
      <div className="hangar-card square">
        <IgnitionCard />
      </div>
    </div>
  </>
);

const BottomBarContent: React.FC = () => (
  <>
    <HangarBayContent />
  </>
);

// ignition panel with telegraph control
const IgnitionPanel: React.FC<{ elevationOn?: boolean }> = ({ elevationOn }) => {
  const modes = ['AUTO', 'SEMI-AUTO', 'STOP'] as const;
  type Mode = typeof modes[number];
  const [mode, setMode] = useState<Mode>('STOP');
  const [locked, setLocked] = useState(false);
  const [lastAction, setLastAction] = useState<string>('—');

  const handleSelect = (next: Mode) => {
    if (locked) return;
    setMode(next);
    setLastAction(new Date().toLocaleTimeString());
  };

  const cycle = (dir: 1 | -1) => {
    if (locked) return;
    const idx = modes.indexOf(mode);
    const next = modes[(idx + dir + modes.length) % modes.length];
    handleSelect(next);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') cycle(1);
    if (e.key === 'ArrowLeft') cycle(-1);
    if (e.key === ' ' || e.key === 'Enter') cycle(1);
  };

  const engineStatus = mode === 'STOP' ? 'OFFLINE' : 'ONLINE';
  const connectivity = mode === 'STOP' ? 'DISCONNECTED' : 'CONNECTED';

  return (
    <Card title="IGNITION">
      <div
        className="ignition-panel vintage"
        data-3d={elevationOn ? 'true' : 'false'}
        aria-live="polite"
      >
        <div className="ignition-header">
          <span className="ignition-title">IGNITION</span>
          <span className={`status-dot ${mode === 'STOP' ? 'off' : 'on'}`} aria-hidden="true" />
        </div>
        <div
          role="radiogroup"
          tabIndex={0}
          onKeyDown={handleKey}
          className="telegraph-ignition"
          aria-label="Global throttle control"
        >
          {modes.map((m) => (
            <button
              key={m}
              role="radio"
              aria-checked={mode === m}
              className={`telegraph-panel${mode === m ? ' active' : ''}`}
              onClick={() => handleSelect(m)}
            >
              {m}
            </button>
          ))}
        </div>
        <button
          className="lock-toggle"
          aria-pressed={locked}
          onClick={() => setLocked(!locked)}
        >
          {locked ? 'Unlock' : 'Lock'}
        </button>
        <div className="ignition-readouts">
          <div>
            Engine status: <strong>{engineStatus}</strong>
          </div>
          <div>Last action: {lastAction}</div>
          <div>Connectivity: {connectivity}</div>
        </div>
      </div>
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
  const [fullscreenOn, setFullscreenOn] = useState(false);

  // Theme / UI state
  const [dayMode, setDayMode] = useState(true);
  const [elevationOn, setElevationOn] = useState(true);
  const [themeBase, setThemeBase] = useState<'webpage' | 'mosaic-1993'>('webpage');

  const darkMode = !dayMode;
  const themeKey = `${themeBase}-${darkMode ? 'dark' : 'light'}`;
  const themePalette = themes[themeKey]?.palette || themes['webpage-light'].palette;

  React.useEffect(() => {
    applyTheme(themeKey);
  }, [themeKey]);

  React.useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('no-elevation', !elevationOn);
  }, [elevationOn]);

  const toggle = (key: keyof VisibilityState) => {
    setVis((v) => ({ ...v, [key]: !v[key] }));
  };

  const toggleFullscreen = () => {
    document.documentElement.classList.toggle('fullscreen');
    setFullscreenOn((v) => !v);
  };

  // container no longer uses automatic scaling; sizes are hand‑tuned
  return (
    <div id="app" className="quad-grid">
      {/* everything that belongs in quadrant II goes inside this container */}
      <div id="quadrant-ii" className="quadrant" data-testid="quadrant-ii">
        <div id="quadrant-ii-inner">
        {vis.header && (
          <HeaderRegion studio={currentStudio} dayMode={dayMode} setDayMode={setDayMode} />
        )}
        <nav id="nav-region" className="region" aria-label="Navigation">
          <StudioTabs current={currentStudio} setCurrent={setCurrentStudio} />
          <PanelToggles
            vis={vis}
            toggle={toggle}
            fullscreenOn={fullscreenOn}
            toggleFullscreen={toggleFullscreen}
          />
          <TelemetryStrip />
        </nav>
        {vis.left && (
          <aside
            id="left-sidebar"
            className="region"
            data-testid="left-sidebar"
            role="complementary"
            aria-label="System Design"
          >
            <LeftSidebarContent
              dayMode={dayMode}
              setDayMode={setDayMode}
              elevationOn={elevationOn}
              setElevationOn={setElevationOn}
              themeBase={themeBase}
              setThemeBase={setThemeBase}
              themeKey={themeKey}
            />
          </aside>
        )}
        {vis.right && (
          <aside
            id="right-sidebar"
            className="region"
            data-testid="right-sidebar"
            role="complementary"
            aria-label="Inspector Panel"
          >
            <RightSidebarContent />
          </aside>
        )}
        <main id="main-region" className="region" data-testid="main-region">
          <div className="main-cards">
            <MainRegionContent
              studio={currentStudio}
              themeKey={themeKey}
              elevationOn={elevationOn}
              palette={themePalette}
            />
          </div>
        </main>
        <div id="footer-row" className="footer-row">
          {vis.bottom ? (
            <div
              id="bottom-bar"
              className="region"
              data-testid="bottom-bar"
              role="region"
              aria-label="Hangar Bay"
            >
              <BottomBarContent />
            </div>
          ) : (
            <div
              id="bottom-bar"
              className="region"
              data-testid="bottom-bar"
              aria-hidden="true"
            />
          )}
          <div
            id="action-bar"
            className="region"
            data-testid="action-bar"
            role="region"
            aria-label="Ignition"
          >
            <IgnitionPanel elevationOn={elevationOn} />
          </div>
        </div>
      </div> {/* end quadrant-ii-inner */}
      </div>      {/* preserve empty quadrants around II */}
      <div id="quadrant-i" className="quadrant" data-testid="quadrant-i">
        <div className="blank-quadrant">
          <p>
            leave blank because our webpage will be used in a browser in quad-split-screen,
          </p>
          <p>
            so everything's gotta be naturally developed one-quarter smaller than you would normally develop
          </p>
          <p>
            (if you normally develop something at 28px, instead give it only 7px). making-things-tiny-calculations do not have to be exactly .25 smaller, around .25 smaller everything.
          </p>
        </div>
      </div>
      <div id="quadrant-iii" className="quadrant" data-testid="quadrant-iii">
        <div className="blank-quadrant">
          <p>(Decoy Quadrant to make devs forget about counting pixels; Leave Blank)</p>
        </div>
      </div>
      <div id="quadrant-iv" className="quadrant" data-testid="quadrant-iv">
        <div className="blank-quadrant">
          <p>(Decoy Quadrant to ensure this website fits on all sizes; Leave Blank)</p>
        </div>
      </div>
    </div>
  );
}

// only boot in browser (but not during tests)
if (typeof document !== 'undefined' &&
    (typeof process === 'undefined' || process.env.NODE_ENV !== 'test')) {
  const rootElement = document.getElementById('app');
  if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(<App />);
  } else {
    console.error('Root element not found');
  }
}

export default App;
