/* ============================================================
   Paulie's Prediction Partners — Positions & Trade History Module
   Manages the Inspector Panel's Positions and History tabs.
   Polls backend for open positions and trade fills.
   ============================================================ */

const PositionsPanel = (() => {
  'use strict';

  const BACKEND_URL = 'http://127.0.0.1:8000';
  const POLL_INTERVAL_MS = 10000;

  let pollIntervalId = null;
  let isConnected = false;
  let activeTab = 'positions'; // 'positions' | 'history'

  /* ---- Public API ---- */

  function initialize() {
    bindTabs();
    renderEmptyState();
  }

  function onConnected() {
    isConnected = true;
    startPolling();
  }

  function onDisconnected() {
    isConnected = false;
    stopPolling();
    renderEmptyState();
  }

  /* ---- Tab Binding ---- */

  function bindTabs() {
    const tabsContainer = document.getElementById('inspector-tabs');
    if (!tabsContainer) return;

    tabsContainer.addEventListener('click', (event) => {
      const tab = event.target.closest('[data-inspector-tab]');
      if (!tab) return;

      tabsContainer.querySelectorAll('[data-inspector-tab]').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const tabName = tab.dataset.inspectorTab;
      activeTab = tabName;

      document.querySelectorAll('[data-inspector-panel]').forEach(panel => {
        panel.style.display = panel.dataset.inspectorPanel === tabName ? '' : 'none';
      });

      if (isConnected) {
        if (tabName === 'positions') fetchPositions();
        if (tabName === 'history') fetchHistory();
      }
    });
  }

  /* ---- Empty State ---- */

  function renderEmptyState() {
    const posPanel = document.getElementById('inspector-positions-panel');
    const histPanel = document.getElementById('inspector-history-panel');

    if (posPanel) {
      posPanel.innerHTML = `
        <div class="inspector-empty">
          <span class="inspector-empty__icon">📡</span>
          <p class="inspector-empty__text">Connect API keys to view open positions</p>
        </div>
      `;
    }
    if (histPanel) {
      histPanel.innerHTML = `
        <div class="inspector-empty">
          <span class="inspector-empty__icon">📜</span>
          <p class="inspector-empty__text">Connect API keys to view trade history</p>
        </div>
      `;
    }
  }

  /* ---- Polling ---- */

  function startPolling() {
    stopPolling();
    fetchAll();
    pollIntervalId = setInterval(fetchAll, POLL_INTERVAL_MS);
  }

  function stopPolling() {
    if (pollIntervalId !== null) {
      clearInterval(pollIntervalId);
      pollIntervalId = null;
    }
  }

  function fetchAll() {
    if (activeTab === 'positions') fetchPositions();
    else if (activeTab === 'history') fetchHistory();
    updatePositionsBadge();
  }

  /* ---- Positions ---- */

  async function fetchPositions() {
    const panel = document.getElementById('inspector-positions-panel');
    if (!panel) return;

    try {
      const response = await fetch(`${BACKEND_URL}/api/state/positions`);
      if (!response.ok) {
        renderPositionsError(panel, `Error ${response.status}`);
        return;
      }
      const data = await response.json();
      /* Handle multiple response shapes: { positions: [...] } or [...] */
      const positions = Array.isArray(data)
        ? data
        : (Array.isArray(data.positions) ? data.positions : []);
      renderPositions(panel, positions);
    } catch (_error) {
      renderPositionsError(panel, 'Backend offline');
    }
  }

  function renderPositions(panel, positions) {
    if (!positions || positions.length === 0) {
      panel.innerHTML = `
        <div class="inspector-empty">
          <span class="inspector-empty__icon">🎯</span>
          <p class="inspector-empty__text">No open positions</p>
          <p class="inspector-empty__subtext">Trade some markets to see positions here</p>
        </div>
      `;
      updatePositionsBadge(0);
      return;
    }

    updatePositionsBadge(positions.length);

    let html = `<div class="positions-list">`;
    positions.forEach(position => {
      const ticker = position.ticker || '—';
      const side = position.market_side || '—';
      const quantity = position.quantity_fp || position.quantity || '—';
      const marketValue = position.market_value !== undefined
        ? `$${parseFloat(position.market_value).toFixed(2)}`
        : '—';
      const costBasis = position.cost_basis !== undefined
        ? `$${parseFloat(position.cost_basis).toFixed(2)}`
        : '—';
      const unrealizedPnl = position.unrealized_pnl !== undefined
        ? parseFloat(position.unrealized_pnl)
        : null;

      const pnlSign = unrealizedPnl !== null && unrealizedPnl >= 0 ? '+' : '';
      const pnlColor = unrealizedPnl !== null
        ? (unrealizedPnl >= 0 ? 'var(--color-state-success)' : 'var(--color-state-error)')
        : 'var(--color-fg-muted)';
      const pnlText = unrealizedPnl !== null
        ? `${pnlSign}$${unrealizedPnl.toFixed(2)}`
        : '—';

      const sideClass = side.toLowerCase() === 'yes' ? 'side-yes' : 'side-no';

      html += `
        <div class="position-row">
          <div class="position-row__ticker">${escapeHtml(ticker)}</div>
          <div class="position-row__side ${sideClass}">${escapeHtml(side.toUpperCase())}</div>
          <div class="position-row__qty">×${escapeHtml(String(quantity))}</div>
          <div class="position-row__value">${escapeHtml(marketValue)}</div>
          <div class="position-row__pnl" style="color:${pnlColor}">${escapeHtml(pnlText)}</div>
        </div>
      `;
    });
    html += `</div>`;

    /* Total summary row */
    const totalPnl = positions.reduce((sum, p) => {
      const pnl = parseFloat(p.unrealized_pnl || 0);
      return isNaN(pnl) ? sum : sum + pnl;
    }, 0);
    const totalValue = positions.reduce((sum, p) => {
      const val = parseFloat(p.market_value || 0);
      return isNaN(val) ? sum : sum + val;
    }, 0);

    html += `
      <div class="positions-summary">
        <span>Total: ${positions.length} position${positions.length !== 1 ? 's' : ''}</span>
        <span>Value: $${totalValue.toFixed(2)}</span>
        <span style="color:${totalPnl >= 0 ? 'var(--color-state-success)' : 'var(--color-state-error)'}">${totalPnl >= 0 ? '+' : ''}$${totalPnl.toFixed(2)} P&L</span>
      </div>
    `;

    panel.innerHTML = html;
  }

  function renderPositionsError(panel, message) {
    panel.innerHTML = `
      <div class="inspector-empty">
        <span class="inspector-empty__icon">⚠️</span>
        <p class="inspector-empty__text">${escapeHtml(message)}</p>
      </div>
    `;
  }

  function updatePositionsBadge(count) {
    const badge = document.getElementById('positions-tab-badge');
    if (!badge) return;
    if (count === undefined || count === 0) {
      badge.style.display = 'none';
    } else {
      badge.textContent = count > 99 ? '99+' : String(count);
      badge.style.display = 'inline-flex';
    }
  }

  /* ---- Trade History ---- */

  async function fetchHistory() {
    const panel = document.getElementById('inspector-history-panel');
    if (!panel) return;

    try {
      const response = await fetch(`${BACKEND_URL}/api/state/fills`);
      if (!response.ok) {
        renderHistoryError(panel, `Error ${response.status}`);
        return;
      }
      const fills = await response.json();
      renderHistory(panel, Array.isArray(fills) ? fills : []);
    } catch (_error) {
      renderHistoryError(panel, 'Backend offline');
    }
  }

  function renderHistory(panel, fills) {
    if (!fills || fills.length === 0) {
      panel.innerHTML = `
        <div class="inspector-empty">
          <span class="inspector-empty__icon">📊</span>
          <p class="inspector-empty__text">No trade history yet</p>
          <p class="inspector-empty__subtext">Completed trades will appear here</p>
        </div>
      `;
      return;
    }

    /* Show most recent 50 trades, newest first */
    const recentFills = [...fills].reverse().slice(0, 50);

    let html = `<div class="history-list">`;
    recentFills.forEach(fill => {
      const ticker = fill.ticker || '—';
      let side;
      if (fill.yes_price !== undefined) {
        side = 'YES';
      } else if (fill.no_price !== undefined) {
        side = 'NO';
      } else {
        side = (fill.side || '—').toUpperCase();
      }
      const price = fill.yes_price || fill.no_price || fill.price || '—';
      const count = fill.count_fp || fill.count || '—';
      const action = fill.action || 'buy';
      const timestamp = fill.created_time || fill.timestamp || '';
      const pnl = fill.realized_pnl !== undefined ? parseFloat(fill.realized_pnl) : null;

      const timeStr = timestamp ? formatTimestamp(timestamp) : '—';
      const sideClass = side === 'YES' ? 'side-yes' : 'side-no';
      const actionClass = action === 'buy' ? 'action-buy' : 'action-sell';

      const priceDisplay = price !== '—' ? `${(parseFloat(price) * 100).toFixed(0)}¢` : '—';

      html += `
        <div class="history-row">
          <div class="history-row__header">
            <span class="history-row__ticker">${escapeHtml(ticker)}</span>
            <span class="history-row__time">${escapeHtml(timeStr)}</span>
          </div>
          <div class="history-row__details">
            <span class="history-row__action ${actionClass}">${escapeHtml(action.toUpperCase())}</span>
            <span class="history-row__side ${sideClass}">${escapeHtml(side)}</span>
            <span class="history-row__price">${escapeHtml(priceDisplay)}</span>
            <span class="history-row__qty">×${escapeHtml(String(count))}</span>
            ${pnl !== null ? `<span class="history-row__pnl" style="color:${pnl >= 0 ? 'var(--color-state-success)' : 'var(--color-state-error)'}">${pnl >= 0 ? '+' : ''}$${pnl.toFixed(2)}</span>` : ''}
          </div>
        </div>
      `;
    });
    html += `</div>`;

    if (fills.length > 50) {
      html += `<div class="history-overflow">Showing 50 of ${fills.length} trades</div>`;
    }

    panel.innerHTML = html;
  }

  function renderHistoryError(panel, message) {
    panel.innerHTML = `
      <div class="inspector-empty">
        <span class="inspector-empty__icon">⚠️</span>
        <p class="inspector-empty__text">${escapeHtml(message)}</p>
      </div>
    `;
  }

  /* ---- Helpers ---- */

  function formatTimestamp(isoString) {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);

      if (diffMins < 1) return 'just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch (_) {
      return isoString;
    }
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(String(str)));
    return div.innerHTML;
  }

  /* ---- Real-time update hook ---- */

  function onFill(fillData) {
    if (activeTab === 'history') fetchHistory();
    fetchPositions();
    updatePositionsBadge();
  }

  return {
    initialize,
    onConnected,
    onDisconnected,
    onFill,
  };
})();
