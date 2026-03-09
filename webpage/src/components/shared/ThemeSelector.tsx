const THEMES = [
  "webpage", "mosaic-1993", "gen7-cockpit", "ussr-cockpit",
  "neon-vice-1985", "neon-city-2085", "coniforest", "rainforest",
  "art-deco", "holographic", "vapor", "paper",
  "ledger-1920", "blueprint", "chalkboard", "phosphor",
  "volcano", "oceanic", "aurora", "desert",
  "cherry-blossom", "hive", "dusk", "amethyst",
] as const;

interface ThemeSelectorProps {
  currentTheme: string;
  onSelect: (themeId: string) => void;
}

export function ThemeSelector({ currentTheme, onSelect }: ThemeSelectorProps) {
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 600, color: "var(--color-fg-muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.1em" }}>
        Theme
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
        {THEMES.map((t) => (
          <button
            key={t}
            onClick={() => onSelect(t)}
            className={`btn btn-sm ${currentTheme === t ? "btn-primary" : "btn-ghost"}`}
            style={{
              fontSize: 10,
              padding: "4px 6px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              textAlign: "left",
            }}
            title={t}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}
