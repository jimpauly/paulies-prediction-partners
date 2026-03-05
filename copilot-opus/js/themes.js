/* ============================================================
   Theme Engine — Theme switching, mode toggle, button previews
   ============================================================ */

const ThemeEngine = (() => {
  const THEMES = [
    { id: 'modern-webpage', label: 'Webpage', lightBackground: '#f8fafc', lightColor: '#1e293b', darkBackground: '#0f172a', darkColor: '#e2e8f0' },
    { id: 'mosaic-1993', label: 'Mosaic 93', lightBackground: '#c0c0c0', lightColor: '#000000', darkBackground: '#3f3f3f', darkColor: '#e0e0e0' },
    { id: 'gen7-cockpit', label: 'Gen7', lightBackground: '#8a9197', lightColor: '#1a1a1a', darkBackground: '#1a1c1e', darkColor: '#4ade80' },
    { id: 'ussr-cockpit', label: 'USSR', lightBackground: '#3d90a2', lightColor: '#1a1a2e', darkBackground: '#0d1f26', darkColor: '#b8d4da' },
    { id: 'neonvice-1985', label: 'Vice 85', lightBackground: '#fdf0e8', lightColor: '#4a2040', darkBackground: '#1a0a2e', darkColor: '#e8b4d8' },
    { id: 'neoncity-2085', label: 'Neon 85', lightBackground: '#e8edf2', lightColor: '#0a1628', darkBackground: '#05080f', darkColor: '#b0bec5' },
    { id: 'coniforest', label: 'Conifer', lightBackground: '#e8ede5', lightColor: '#2c3e2d', darkBackground: '#0d1a12', darkColor: '#a5c4a5' },
    { id: 'raneforest', label: 'Rane', lightBackground: '#f5f0e1', lightColor: '#2d1f0e', darkBackground: '#0a1a0a', darkColor: '#8fbc8f' },
    { id: 'art-deco', label: 'Deco', lightBackground: '#faf8f0', lightColor: '#1a1a18', darkBackground: '#0a0a08', darkColor: '#d4c88a' },
    { id: 'holographic', label: 'Holo', lightBackground: '#f0f0f8', lightColor: '#2a2a3e', darkBackground: '#0a0a14', darkColor: '#b8b8d0' },
  ];

  const PALETTE_TOKENS = [
    { property: '--color-bg-canvas', label: 'Canvas' },
    { property: '--color-bg-surface', label: 'Surface' },
    { property: '--color-bg-brand', label: 'Brand' },
    { property: '--color-fg-default', label: 'FG' },
    { property: '--color-fg-strong', label: 'Strong' },
    { property: '--color-border-default', label: 'Border' },
    { property: '--color-border-focus', label: 'Focus' },
    { property: '--color-link-default', label: 'Link' },
    { property: '--color-state-success', label: 'Success' },
    { property: '--color-state-warning', label: 'Warning' },
    { property: '--color-state-error', label: 'Error' },
    { property: '--color-state-info', label: 'Info' },
  ];

  let currentTheme = 'modern-webpage';
  let currentMode = 'light';

  function initialize() {
    renderThemeButtons();
    renderPaletteViewer();
    bindModeToggle();
    bindBezelToggle();
    bindVisibilityToggles();
  }

  function renderThemeButtons() {
    const grid = document.getElementById('theme-grid');
    if (!grid) return;
    grid.innerHTML = '';

    THEMES.forEach(theme => {
      const button = document.createElement('button');
      button.className = 'theme-button-preview';
      button.dataset.theme = theme.id;
      button.textContent = theme.label;
      button.setAttribute('role', 'radio');
      button.setAttribute('aria-checked', theme.id === currentTheme ? 'true' : 'false');
      button.setAttribute('aria-label', `Select ${theme.label} theme`);
      button.tabIndex = 0;

      applyThemeButtonPreview(button, theme);

      if (theme.id === currentTheme) {
        button.classList.add('active');
      }

      button.addEventListener('click', () => setTheme(theme.id));
      button.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          setTheme(theme.id);
        }
      });
      grid.appendChild(button);
    });
  }

  function applyThemeButtonPreview(button, theme) {
    const isLight = currentMode === 'light';
    button.style.background = isLight ? theme.lightBackground : theme.darkBackground;
    button.style.color = isLight ? theme.lightColor : theme.darkColor;
    button.style.borderColor = isLight ? theme.lightColor : theme.darkColor;
  }

  function setTheme(themeId) {
    currentTheme = themeId;
    document.body.setAttribute('data-theme', themeId);
    renderThemeButtons();
    renderPaletteViewer();
  }

  function setMode(mode) {
    currentMode = mode;
    document.body.setAttribute('data-mode', mode);

    // Update illumination base intensity
    const illuminationBase = mode === 'dark' ? 1.0 : 0.6;
    document.documentElement.style.setProperty('--illumination-base', illuminationBase);

    // Update mode toggle buttons
    const lightButton = document.getElementById('mode-light');
    const darkButton = document.getElementById('mode-dark');
    if (lightButton && darkButton) {
      lightButton.classList.toggle('active', mode === 'light');
      darkButton.classList.toggle('active', mode === 'dark');
      lightButton.setAttribute('aria-pressed', mode === 'light');
      darkButton.setAttribute('aria-pressed', mode === 'dark');
    }

    // Sync DAY/NVG and Light/Dark toggles
    const dayNvgToggle = document.getElementById('toggle-day-nvg');
    const lightDarkToggle = document.getElementById('toggle-light-dark');
    if (dayNvgToggle) {
      dayNvgToggle.classList.toggle('active', mode === 'dark');
      dayNvgToggle.setAttribute('aria-checked', mode === 'dark');
    }
    if (lightDarkToggle) {
      lightDarkToggle.classList.toggle('active', mode === 'dark');
      lightDarkToggle.setAttribute('aria-checked', mode === 'dark');
    }

    renderThemeButtons();
    renderPaletteViewer();
    if (typeof Illumination !== 'undefined') {
      Illumination.recalculate();
    }
  }

  function toggleMode() {
    setMode(currentMode === 'light' ? 'dark' : 'light');
  }

  function bindModeToggle() {
    const lightButton = document.getElementById('mode-light');
    const darkButton = document.getElementById('mode-dark');
    if (lightButton) lightButton.addEventListener('click', () => setMode('light'));
    if (darkButton) darkButton.addEventListener('click', () => setMode('dark'));

    // DAY/NVG toggle
    const dayNvgToggle = document.getElementById('toggle-day-nvg');
    if (dayNvgToggle) {
      dayNvgToggle.addEventListener('click', toggleMode);
      dayNvgToggle.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggleMode(); }
      });
    }

    // Light/Dark toggle in header
    const lightDarkToggle = document.getElementById('toggle-light-dark');
    if (lightDarkToggle) {
      lightDarkToggle.addEventListener('click', toggleMode);
      lightDarkToggle.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggleMode(); }
      });
    }
  }

  function bindBezelToggle() {
    const button2d = document.getElementById('bezel-2d');
    const button3d = document.getElementById('bezel-3d');
    if (button2d) button2d.addEventListener('click', () => {
      document.body.setAttribute('data-bezel', '2d');
      button2d.classList.add('active');
      button3d.classList.remove('active');
    });
    if (button3d) button3d.addEventListener('click', () => {
      document.body.setAttribute('data-bezel', '3d');
      button3d.classList.add('active');
      button2d.classList.remove('active');
    });
  }

  function bindVisibilityToggles() {
    const rulerToggle = document.getElementById('toggle-rulers');
    const gridToggle = document.getElementById('toggle-grid');
    if (rulerToggle) {
      rulerToggle.addEventListener('change', () => {
        document.body.setAttribute('data-rulers', rulerToggle.checked);
        if (typeof Rulers !== 'undefined') Rulers.draw();
      });
    }
    if (gridToggle) {
      gridToggle.addEventListener('change', () => {
        document.body.setAttribute('data-grid', gridToggle.checked);
      });
    }
  }

  function renderPaletteViewer() {
    const viewer = document.getElementById('palette-viewer');
    if (!viewer) return;
    viewer.innerHTML = '';

    const computedStyle = getComputedStyle(document.body);
    PALETTE_TOKENS.forEach(token => {
      const color = computedStyle.getPropertyValue(token.property).trim();
      const wrapper = document.createElement('div');
      wrapper.style.textAlign = 'center';

      const swatch = document.createElement('div');
      swatch.className = 'swatch';
      swatch.style.background = color || '#ccc';
      swatch.title = `${token.label}: ${color}`;

      const label = document.createElement('div');
      label.className = 'swatch-label';
      label.textContent = token.label;

      wrapper.appendChild(swatch);
      wrapper.appendChild(label);
      viewer.appendChild(wrapper);
    });
  }

  function getCurrentTheme() { return currentTheme; }
  function getCurrentMode() { return currentMode; }

  return { initialize, setTheme, setMode, toggleMode, getCurrentTheme, getCurrentMode, renderPaletteViewer };
})();
