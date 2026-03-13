// plain JS version of the React app using global `React` and `ReactDOM`
const { useState } = React;

const studios = ['design', 'trade', 'flight', 'convert'];

function App() {
  const [currentStudio, setCurrentStudio] = useState('design');
  const [vis, setVis] = useState({
    header: true,
    left: true,
    right: true,
    bottom: true,
  });

  const toggle = (key) => {
    setVis((v) => ({ ...v, [key]: !v[key] }));
  };

  const handleNavKey = (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      const idx = studios.indexOf(currentStudio);
      const next =
        e.key === 'ArrowRight'
          ? studios[(idx + 1) % studios.length]
          : studios[(idx - 1 + studios.length) % studios.length];
      setCurrentStudio(next);
    }
  };

  return React.createElement(
    'div',
    { id: 'app', className: 'quad-grid' },
    React.createElement(
      'div',
      { id: 'quadrant-ii', className: 'quadrant' },
      vis.header && React.createElement('header', { id: 'header-region', className: 'region' }, 'HEADER'),
      React.createElement(
        'nav',
        { id: 'nav-region', className: 'region', 'aria-label': 'Navigation' },
        studios.map((s) =>
          React.createElement(
            'button',
            {
              key: s,
              onClick: () => setCurrentStudio(s),
              onKeyDown: handleNavKey,
              'aria-pressed': currentStudio === s,
            },
            s.toUpperCase()
          )
        ),
        React.createElement(
          'div',
          { className: 'toggles' },
          React.createElement(
            'button',
            { onClick: () => toggle('header'), 'aria-label': 'Toggle Header', 'aria-pressed': vis.header },
            'H'
          ),
          React.createElement(
            'button',
            { onClick: () => toggle('left'), 'aria-label': 'Toggle Left Sidebar', 'aria-pressed': vis.left },
            'L'
          ),
          React.createElement(
            'button',
            { onClick: () => toggle('right'), 'aria-label': 'Toggle Right Sidebar', 'aria-pressed': vis.right },
            'R'
          ),
          React.createElement(
            'button',
            { onClick: () => toggle('bottom'), 'aria-label': 'Toggle Bottom Bar', 'aria-pressed': vis.bottom },
            'B'
          )
        )
      ),
      vis.left && React.createElement(
        'aside',
        { id: 'left-sidebar', className: 'region' },
        React.createElement(
          'div',
          { className: 'card' },
          React.createElement('div', { className: 'card-header' }, 'MODES'),
          React.createElement(
            'div',
            { className: 'card-content' },
            React.createElement('button', null, 'Light / Dark'),
            React.createElement('button', null, '3D / 2D')
          )
        ),
        React.createElement(
          'div',
          { className: 'card' },
          React.createElement('div', { className: 'card-header' }, 'SYSTEM THEME'),
          React.createElement(
            'div',
            { className: 'card-content' },
            React.createElement('div', { className: 'theme-grid' },
              React.createElement('button', null, 'Theme 1'),
              React.createElement('button', null, 'Theme 2'),
              React.createElement('button', null, 'Theme 3')
            )
          )
        )
      ),
      vis.right && React.createElement('aside', { id: 'right-sidebar', className: 'region' }, 'RIGHT SIDEBAR'),
      React.createElement(
        'main',
        { id: 'main-region', className: 'region' },
        `MAIN REGION - ${currentStudio.toUpperCase()}`
      ),
      vis.bottom && React.createElement('div', { id: 'bottom-bar', className: 'region' }, 'BOTTOM BAR'),
      React.createElement('div', { id: 'action-bar', className: 'region' }, 'ACTION BAR')
    ),
    React.createElement('div', { id: 'quadrant-i', className: 'quadrant' }),
    React.createElement('div', { id: 'quadrant-iii', className: 'quadrant' }),
    React.createElement('div', { id: 'quadrant-iv', className: 'quadrant' })
  );
}

const rootElement = document.getElementById('app');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(React.createElement(App));
} else {
  console.error('Root element not found');
}