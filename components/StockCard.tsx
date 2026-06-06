import { StockData } from "@/types";

export default function StockCard({ symbol, price, change, high, low, volume }: StockData) {
  const isUp = (change || 0) >= 0;
  const accentColor = isUp ? "#22c55e" : "#ef4444";
  const valueColor = isUp ? "#16a34a" : "#dc2626";
  const bgColor = isUp ? "#f0fdf4" : "#fef2f2";
  const borderColor = isUp ? "#86efac" : "#fca5a5";

  const stats = [
    ["HIGH", `$${high || 178}`],
    ["LOW", `$${low || 172}`],
    ["VOL", volume || "45M"],
  ];

  return (
    <div style={{ background: "white", border: `1px solid ${accentColor}30`, borderRadius: 20, padding: 24, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <p style={{ fontSize: 11, color: "#9ca3af", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Stock Price</p>
          <h3 style={{ fontSize: 24, fontWeight: 800, color: "#111" }}>{symbol || "AAPL"}</h3>
        </div>
        <div style={{ padding: "6px 14px", background: bgColor, borderRadius: 12, border: `1px solid ${borderColor}` }}>
          <span style={{ color: valueColor, fontWeight: 700, fontSize: 14 }}>
            {isUp ? "▲" : "▼"} {Math.abs(change || 2.5)}%
          </span>
        </div>
      </div>

      <div style={{ fontSize: 44, fontWeight: 800, color: valueColor, marginBottom: 16 }}>
        ${(price || 175.5).toFixed(2)}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, borderTop: "1px solid #f3f4f6", paddingTop: 14 }}>
        {stats.map(([label, val]) => (
          <div key={label}>
            <p style={{ fontSize: 10, color: "#9ca3af", marginBottom: 2 }}>{label}</p>
            <p style={{ fontWeight: 700, color: "#374151", fontSize: 13 }}>{val}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
