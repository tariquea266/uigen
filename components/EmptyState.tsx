import { SUGGESTIONS } from "@/constants/suggestions";

interface EmptyStateProps {
  onSend:    (cmd: string) => void;
  isMobile:  boolean;
}

export default function EmptyState({ onSend, isMobile }: EmptyStateProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: 20 }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ color: "#bccaf7", fontSize: 55, marginBottom: 10 }}>✦</div>
        <h2 style={{ color: "#111", fontSize: 28, fontWeight: 700, marginBottom: 6 }}>Ask AI to generate UI</h2>
        <p style={{ color: "#474c55", fontSize: 14, maxWidth: 280 }}>
          Type a command — weather, stock, calculator, chart — AI will build the UI
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, width: "100%", maxWidth: isMobile ? 320 : 380 }}>
        {SUGGESTIONS.map((s) => (
          <button
            key={s.cmd}
            onClick={() => onSend(s.cmd)}
            style={{ background: "white", border: "1px solid #dbdcde", borderRadius: 12, padding: "11px 14px", textAlign: "left", cursor: "pointer", color: "#4d525d", fontSize: 12, display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#2563eb"; (e.currentTarget as HTMLElement).style.color = "#2563eb"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#e5e7eb"; (e.currentTarget as HTMLElement).style.color = "#6b7280"; }}
          >
            <span style={{ fontSize: 18 }}>{s.icon}</span>
            <span style={{ fontWeight: 500 }}>{s.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
