import type { AgentMode, AgentState } from "../../types/trading";
import { AgentCard, type AgentConfig } from "./AgentCard";

const AGENT_CONFIGS: Record<string, AgentConfig> = {
  "momentum-agent": {
    displayName: "Momentum",
    icon: "🚀",
    description: "Trend following",
    chartColor: "var(--color-accent-primary)",
    defaultMode: "safe",
    active: true,
  },
  "mean-reversion-agent": {
    displayName: "Mean Rev.",
    icon: "🔄",
    description: "Mean reversion",
    chartColor: "var(--color-accent-secondary)",
    defaultMode: "safe",
    active: true,
  },
  "sentiment-agent": {
    displayName: "Sentiment",
    icon: "💬",
    description: "News sentiment",
    chartColor: "var(--color-state-info)",
    defaultMode: "safe",
    active: true,
    underConstruction: true,
  },
  "arbitrage-agent": {
    displayName: "Arb",
    icon: "⚡",
    description: "Arbitrage",
    chartColor: "var(--color-state-warning)",
    defaultMode: "safe",
    active: true,
  },
  "risk-agent": {
    displayName: "Risk Mgr",
    icon: "🛡️",
    description: "Risk management",
    chartColor: "var(--color-state-error)",
    defaultMode: "safe",
    active: true,
  },
  "ml-agent": {
    displayName: "ML Alpha",
    icon: "🧠",
    description: "Machine learning",
    chartColor: "var(--color-state-success)",
    defaultMode: "safe",
    active: true,
    underConstruction: true,
  },
  "byob-agent": {
    displayName: "BYOB",
    icon: "🔧",
    description: "Custom bot",
    chartColor: "var(--color-fg-muted)",
    defaultMode: "safe",
    active: false,
    isByob: true,
  },
};

interface AgentDashboardProps {
  connected: boolean;
  agents: Record<string, AgentState>;
  onModeChange: (name: string, mode: AgentMode) => void;
}

export function AgentDashboard({ connected, agents, onModeChange }: AgentDashboardProps) {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
      {!connected && (
        <div style={{ fontSize: 11, color: "var(--color-fg-subtle)", alignSelf: "center", padding: "0 8px" }}>
          Connect to activate agents
        </div>
      )}
      {Object.entries(AGENT_CONFIGS).map(([name, cfg]) => (
        <AgentCard
          key={name}
          agentName={name}
          config={cfg}
          state={agents[name] ?? null}
          onModeChange={onModeChange}
        />
      ))}
    </div>
  );
}
