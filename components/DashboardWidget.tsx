import { DashboardData } from "@/types";

const DEFAULT_ITEMS = [
  { label: "Jan", value: 65 },
  { label: "Feb", value: 45 },
  { label: "Mar", value: 80 },
  { label: "Apr", value: 55 },
  { label: "May", value: 90 },
];

export default function DashboardWidget({ title, items }: DashboardData) {
  const data = items || DEFAULT_ITEMS;
  const max   = Math.max(...data.map((d) => d.value));
  const total = data.reduce((acc, d) => acc + d.value, 0);
  const avg   = Math.round(total / data.length);

  return (
    <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 20, padding: 20, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
      <p style={{ color: "#2563eb", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Dashboard</p>
      <h3 style={{ color: "#111", fontSize: 16, fontWeight: 700, marginBottom: 20 }}>{title || "Sales Overview"}</h3>

      <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 130, marginBottom: 12 }}>
        {data.map((item, i) => (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <span style={{ color: "#6b7280", fontSize: 9, fontFamily: "monospace" }}>{item.value}</span>
            <div style={{ width: "100%", height: `${(item.value / max) * 100}px`, background: "#2563eb", borderRadius: "4px 4px 0 0", opacity: 0.75 + i * 0.05 }} />
            <span style={{ color: "#9ca3af", fontSize: 10 }}>{item.label}</span>
          </div>
        ))}
      </div>

      <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: 12, display: "flex", justifyContent: "space-between" }}>
        {[["TOTAL", total, "#111"], ["PEAK", max, "#2563eb"], ["AVG", avg, "#111"]].map(([label, val, color]) => (
          <div key={label as string}>
            <p style={{ color: "#9ca3af", fontSize: 10 }}>{label}</p>
            <p style={{ color: color as string, fontWeight: 700, fontSize: 13 }}>{val}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
