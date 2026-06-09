import { CardData } from "@/types";

export default function CardWidget({ title, price, description, badge }: CardData) {
  return (
    <div style={{ background: "white", border: "1px solid #c5c5c5", borderRadius: 20, padding: 24, textAlign: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
      {badge && (
        <span style={{ display: "inline-block", padding: "4px 12px", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 99, color: "#2563eb", fontSize: 11, letterSpacing: 2, marginBottom: 12 }}>
          {badge}
        </span>
      )}
      <div style={{ fontSize: 48, marginBottom: 12 }}>🎁</div>
      <h3 style={{ color: "#111", fontSize: 18, fontWeight: 700, marginBottom: 6 }}>{title || "Premium Product"}</h3>
      <p style={{ color: "#6b7280", fontSize: 13, marginBottom: 16, lineHeight: 1.6 }}>{description || "High quality product"}</p>
      <div style={{ fontSize: 30, fontWeight: 800, color: "#2563eb", marginBottom: 16 }}>{price || "$99"}</div>
      <button style={{ background: "#2563eb", color: "white", border: "none", borderRadius: 12, padding: "11px 28px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
        Buy Now →
      </button>
    </div>
  );
}
