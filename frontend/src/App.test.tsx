import { render, screen, fireEvent, within } from '@testing-library/react';
import App from './main';

describe('App layout', () => {
  it('renders all four quadrants and seven regions initially', () => {
    render(<App />);
    // quadrants exist and have positive size
    ['quadrant-i','quadrant-ii','quadrant-iii','quadrant-iv'].forEach(id => {
      const elem = screen.getByTestId(id);
      expect(elem).toBeInTheDocument();
      expect(elem.clientWidth).toBeGreaterThan(0);
      expect(elem.clientHeight).toBeGreaterThan(0);
    });
    expect(screen.getByText(/Paulie's Studios/i)).toBeInTheDocument();
    // regions now contain cards instead of static labels
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
    expect(screen.getByText(/SYSTEM DESIGN/i)).toBeInTheDocument();
    expect(screen.getByText(/INSPECTOR PANEL/i)).toBeInTheDocument();
    expect(screen.getByText(/Periscope Viewing Port/i)).toBeInTheDocument();
    expect(screen.getByTestId('left-sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('right-sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('bottom-bar')).toBeInTheDocument();
    expect(screen.getByText(/ACTION BAR/i)).toBeInTheDocument();
    expect(screen.getByText(/MAIN REGION - DESIGN/i)).toBeInTheDocument();
    // ensure padding is small (px values)
    const left = screen.getByTestId('left-sidebar');
    expect(getComputedStyle(left).padding).toMatch(/2px/);
    // quadrant-II inner container has padding
    const inner = document.getElementById('quadrant-ii-inner');
    expect(inner).toBeTruthy();
    if(inner) expect(getComputedStyle(inner).padding).toMatch(/4px/);
    // gap between regions should be greater than zero
    expect(getComputedStyle(inner!).gap).not.toBe('0px');
    // scrollbars should be narrow
    const styleSheet = Array.from(document.styleSheets).find(s=>s.href===null);
    expect(styleSheet?.cssRules.toString()).toContain('::-webkit-scrollbar');
  });

  it('toggles visibility when nav buttons pressed', () => {
    render(<App />);
    const headerToggle = screen.getByLabelText('Toggle Header');
    fireEvent.click(headerToggle);
    expect(screen.queryByText(/Paulie's Studios/i)).toBeNull();
    fireEvent.click(headerToggle);
    expect(screen.getByText(/Paulie's Studios/i)).toBeInTheDocument();
  });

  it('renders sample cards in left sidebar', () => {
    render(<App />);
    expect(screen.getByText('MODES')).toBeInTheDocument();
    expect(screen.getByText('SYSTEM THEME')).toBeInTheDocument();
    // two toggle switches should appear
    const switches = screen.getAllByRole('switch');
    expect(switches.length).toBe(2);
  });

  it('theme buttons change data-theme attribute', () => {
    render(<App />);
    const webpageBtn = screen.getByText('Webpage');
    const mosaicBtn = screen.getByText('Mosaic');
    const root = document.documentElement;
    expect(root.getAttribute('data-theme')).toBe('webpage-light');
    fireEvent.click(mosaicBtn);
    expect(root.getAttribute('data-theme')).toBe('mosaic-1993-light');
  });

  it('renders placeholder cards in right sidebar and bottom bar and allows notes and email', () => {
    render(<App />);
    expect(screen.getByText('INSPECTOR')).toBeInTheDocument();
    expect(screen.getByText('Hangar Bay')).toBeInTheDocument();
    // notes book should show textarea and accept input
    const notesTab = screen.getByRole('tab', { name: /Notes/i });
    fireEvent.click(notesTab);
    const textarea = screen.getByLabelText('Inspector notes');
    expect(textarea).toBeInTheDocument();
    fireEvent.change(textarea, { target: { value: 'hello' } });
    expect(textarea).toHaveValue('hello');
    // send card is present without a header
    const sendButton = screen.getByRole('button', { name: /Send to Paulie/i });
    expect(sendButton).toBeInTheDocument();
    const sendCard = sendButton.closest('.card');
    expect(sendCard).not.toHaveTextContent('SEND');
    // inspector book interaction for other books still works
    const historyTab = screen.getByRole('tab', { name: /History/i });
    fireEvent.click(historyTab);
    expect(screen.getByText(/History log/i)).toBeInTheDocument();
  });

  it('design studio shows palette, manometer, logs and elements cards', () => {
    render(<App />);
    expect(screen.getByText('Active Palette')).toBeInTheDocument();
    expect(screen.getByText("Man-O'-Meters")).toBeInTheDocument();
    expect(screen.getByText('System Logs')).toBeInTheDocument();
    expect(screen.getByText('Web Elements')).toBeInTheDocument();
    // clicking add log button should append entry
    const addBtn = screen.getByRole('button', {name:'+'});
    fireEvent.click(addBtn);
    expect(screen.getAllByRole('listitem').length).toBeGreaterThan(0);
  });

  it('throttle card renders and can cycle modes, locks', () => {
    render(<App />);
    const radioGroup = screen.getByRole('radiogroup');
    const auto = within(radioGroup).getByRole('radio', {name:'AUTO'});
    const stop = within(radioGroup).getByRole('radio', {name:'STOP'});
    expect(stop).toHaveAttribute('aria-checked','true');
    // click AUTO
    fireEvent.click(auto);
    expect(auto).toHaveAttribute('aria-checked','true');
    const lockBtn = screen.getByRole('button', {name: /Lock|Unlock/});
    fireEvent.click(lockBtn);
    expect(lockBtn).toHaveAttribute('aria-pressed','true');
    // attempt change while locked
    fireEvent.click(stop);
    expect(auto).toHaveAttribute('aria-checked','true');
  });

  it('renders hangar bay with rectangle and square cards', () => {
    render(<App />);
    const agent = screen.getByText('Agent Access');
    const pl = screen.getByText('P/L MFD');
    const api = screen.getByText('Connect API Keys');
    expect(agent).toBeInTheDocument();
    expect(pl).toBeInTheDocument();
    expect(api).toBeInTheDocument();
    // shape classes on parent cards
    expect(agent.closest('.hangar-card')).toHaveClass('rectangle');
    expect(pl.closest('.hangar-card')).toHaveClass('square');
    expect(api.closest('.hangar-card')).toHaveClass('square');
  });

  it('shows brand title, HUD label, studio tabs, visibility toggles, and telemetry', () => {
    render(<App />);
    expect(screen.getByText(/Paulie's Studios/i)).toBeInTheDocument();
    expect(screen.getByText(/HUD/i)).toBeInTheDocument();
    // nav should now be inside quadrant-II container
    const quadrant2 = screen.getByTestId('left-sidebar').parentElement?.parentElement; // hacky but ensures container exists
    const nav = within(quadrant2 || document.body).getByRole('navigation');
    // tabs
    const tablist = within(nav).getByRole('tablist');
    expect(tablist).toBeInTheDocument();
    expect(within(tablist).getByRole('tab', { name: /DESIGN/i })).toHaveAttribute('aria-selected', 'true');
    // header and nav should be placed in the quadrant-II grid
    const header = screen.getByText(/HEADER/i).parentElement;
    expect(header).toHaveStyle({ gridArea: 'header' });
    expect(nav).toHaveStyle({ gridArea: 'nav' });
    // quadrant-II container should use our proportion rules
    const quad = screen.getByTestId('quadrant-ii');
    expect(quad).toHaveStyle({
      gridTemplateRows: '8.3333vh 4.1667vh 1fr 16.6667vh 16.6667vh',
      gridTemplateColumns: '16.6667% 66.6666% 16.6667%'
    });
    // ensure each region has correct grid-area
    expect(header).toHaveStyle({ gridArea: 'header' });
    expect(nav).toHaveStyle({ gridArea: 'nav' });
    const left = screen.getByTestId('left-sidebar');
    expect(left).toHaveStyle({ gridArea: 'left' });
    const right = screen.getByTestId('right-sidebar');
    expect(right).toHaveStyle({ gridArea: 'right' });
    const main = screen.getByTestId('main-region');
    expect(main).toHaveStyle({ gridArea: 'main' });
    const bottom = screen.getByTestId('bottom-bar');
    expect(bottom).toHaveStyle({ gridArea: 'bottom' });
    const action = screen.getByTestId('action-bar');
    expect(action).toHaveStyle({ gridArea: 'action' });
    // regions should have borders for visual confirmation
    expect(header).toHaveStyle({ border: expect.stringContaining('1px') });
    expect(nav).toHaveStyle({ border: expect.stringContaining('1px') });

    // fly tab should be disabled and show padlock
    const flyTab = within(tablist).getByRole('tab', { name: /FLIGHT/i });
    expect(flyTab).toHaveAttribute('aria-disabled', 'true');
    expect(flyTab).toHaveTextContent('🔒');
    // visibility toggles exist and are buttons with proper aria-labels
    const headerToggle = within(nav).getByRole('button', { name: /Toggle Header/i });
    expect(headerToggle).toBeInTheDocument();
    const leftToggle = within(nav).getByRole('button', { name: /Toggle Left Sidebar/i });
    expect(leftToggle).toBeInTheDocument();
    // telemetry items
    expect(within(nav).getByText(/PING/i)).toBeInTheDocument();
  });
});
