"use client";
import { useState, useRef, useEffect, useCallback } from "react";

// ─── Responsive hook ───────────────────────────────────────────────────────
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [breakpoint]);
  return isMobile;
}

// ─── WeatherCard ───────────────────────────────────────────────────────────
function WeatherCard({ location, temperature, feels_like, conditions, humidity, wind, icon, high, low, pressure, visibility }: any) {
  const getIcon = () => {
    if (!icon) return "☀️";
    const i = icon.toLowerCase();
    if (i.includes("rain") || i.includes("drizzle")) return "🌧️";
    if (i.includes("thunder")) return "⛈️";
    if (i.includes("snow")) return "❄️";
    if (i.includes("cloud")) return "☁️";
    if (i.includes("mist") || i.includes("fog") || i.includes("haze")) return "🌫️";
    return "☀️";
  };
  const getBg = () => {
    if (!icon) return "#1a6fba";
    const i = icon.toLowerCase();
    if (i.includes("rain") || i.includes("thunder")) return "#2c3e50";
    if (i.includes("cloud")) return "#4a5568";
    return "#1a6fba";
  };
  return (
    <div style={{ background: getBg(), borderRadius: 20, padding: "20px 20px", color: "white", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -40, right: -40, width: 150, height: 150, background: "rgba(255,255,255,0.08)", borderRadius: "50%" }} />
      <div style={{ position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
          <div>
            <p style={{ fontSize: 10, opacity: 0.7, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>🔴 LIVE · Weather</p>
            <h3 style={{ fontSize: 17, fontWeight: 700 }}>📍 {location}</h3>
          </div>
          <div style={{ fontSize: 44, lineHeight: 1 }}>{getIcon()}</div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 12, margin: "12px 0" }}>
          <div style={{ fontSize: 64, fontWeight: 900, lineHeight: 1 }}>{temperature}°</div>
          <div style={{ paddingBottom: 8 }}>
            <p style={{ fontSize: 12, opacity: 0.8 }}>Feels {feels_like}°C</p>
            <p style={{ fontSize: 14, fontWeight: 600 }}>{conditions}</p>
            <p style={{ fontSize: 12, opacity: 0.8 }}>↑ {high}° ↓ {low}°</p>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: 12 }}>
          {[["💧", "Humidity", `${humidity}%`], ["💨", "Wind", `${wind}km/h`], ["🌡️", "Pressure", `${pressure}`], ["👁️", "Visibility", `${visibility}km`]].map(([emoji, label, val]) => (
            <div key={label as string} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 16, marginBottom: 2 }}>{emoji}</div>
              <p style={{ fontSize: 9, opacity: 0.6, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</p>
              <p style={{ fontSize: 12, fontWeight: 700 }}>{val}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── StockCard ────────────────────────────────────────────────────────────
function StockCard({ symbol, price, change, high, low, volume }: any) {
  const isUp = (change || 0) >= 0;
  return (
    <div style={{ background: "white", border: `1px solid ${isUp ? "#22c55e" : "#ef4444"}30`, borderRadius: 20, padding: 24, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <p style={{ fontSize: 11, color: "#9ca3af", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Stock Price</p>
          <h3 style={{ fontSize: 24, fontWeight: 800, color: "#111" }}>{symbol || "AAPL"}</h3>
        </div>
        <div style={{ padding: "6px 14px", background: isUp ? "#f0fdf4" : "#fef2f2", borderRadius: 12, border: `1px solid ${isUp ? "#86efac" : "#fca5a5"}` }}>
          <span style={{ color: isUp ? "#16a34a" : "#dc2626", fontWeight: 700, fontSize: 14 }}>
            {isUp ? "▲" : "▼"} {Math.abs(change || 2.5)}%
          </span>
        </div>
      </div>
      <div style={{ fontSize: 44, fontWeight: 800, color: isUp ? "#16a34a" : "#dc2626", marginBottom: 16 }}>
        ${(price || 175.5).toFixed(2)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, borderTop: "1px solid #f3f4f6", paddingTop: 14 }}>
        {[["HIGH", `$${high || 178}`], ["LOW", `$${low || 172}`], ["VOL", volume || "45M"]].map(([label, val]) => (
          <div key={label}>
            <p style={{ fontSize: 10, color: "#9ca3af", marginBottom: 2 }}>{label}</p>
            <p style={{ fontWeight: 700, color: "#374151", fontSize: 13 }}>{val}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CalculatorWidget ─────────────────────────────────────────────────────
function CalculatorWidget() {
  const [display, setDisplay] = useState("0");
  const [prev, setPrev] = useState("");
  const [op, setOp] = useState("");
  const [fresh, setFresh] = useState(false);
  const btn = (label: string, type: "num" | "op" | "eq" | "clear") => {
    const styles: any = {
      num: { bg: "#f9fafb", color: "#111", border: "#e5e7eb" },
      op: { bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe" },
      eq: { bg: "#2563eb", color: "white", border: "#2563eb" },
      clear: { bg: "#fef2f2", color: "#dc2626", border: "#fca5a5" }
    };
    const s = styles[type];
    const handleClick = () => {
      if (label === "C") { setDisplay("0"); setPrev(""); setOp(""); setFresh(false); return; }
      if (["+", "-", "×", "÷"].includes(label)) { setPrev(display); setOp(label); setFresh(true); return; }
      if (label === "=") {
        if (!prev || !op) return;
        const a = parseFloat(prev), b = parseFloat(display);
        const res = op === "+" ? a + b : op === "-" ? a - b : op === "×" ? a * b : b !== 0 ? a / b : 0;
        setDisplay(String(parseFloat(res.toFixed(8)))); setPrev(""); setOp(""); setFresh(false); return;
      }
      if (label === "." && display.includes(".")) return;
      setDisplay(fresh || display === "0" ? label : display + label); setFresh(false);
    };
    return (
      <button key={label} onClick={handleClick}
        style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, borderRadius: 12, fontSize: 17, fontWeight: 600, padding: "14px 0", cursor: "pointer", fontFamily: "monospace", transition: "opacity 0.15s" }}
        onMouseEnter={e => (e.currentTarget.style.opacity = "0.75")}
        onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
      >{label}</button>
    );
  };
  return (
    <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 20, padding: 20, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
      <p style={{ color: "#6b7280", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Calculator</p>
      <div style={{ background: "#f9fafb", borderRadius: 12, padding: "12px 16px", marginBottom: 12, textAlign: "right", border: "1px solid #e5e7eb" }}>
        {op && <p style={{ color: "#9ca3af", fontSize: 11, fontFamily: "monospace" }}>{prev} {op}</p>}
        <p style={{ color: "#111", fontSize: 32, fontWeight: 700, fontFamily: "monospace" }}>{display}</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
        {btn("C", "clear")}{btn("±", "op")}{btn("%", "op")}{btn("÷", "op")}
        {["7", "8", "9"].map(n => btn(n, "num"))}{btn("×", "op")}
        {["4", "5", "6"].map(n => btn(n, "num"))}{btn("-", "op")}
        {["1", "2", "3"].map(n => btn(n, "num"))}{btn("+", "op")}
        {btn("0", "num")}{btn(".", "num")}{btn("=", "eq")}
      </div>
    </div>
  );
}

// ─── DashboardWidget ──────────────────────────────────────────────────────
function DashboardWidget({ title, items }: any) {
  const data = items || [{ label: "Jan", value: 65 }, { label: "Feb", value: 45 }, { label: "Mar", value: 80 }, { label: "Apr", value: 55 }, { label: "May", value: 90 }];
  const max = Math.max(...data.map((d: any) => d.value));
  return (
    <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 20, padding: 20, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
      <p style={{ color: "#2563eb", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Dashboard</p>
      <h3 style={{ color: "#111", fontSize: 16, fontWeight: 700, marginBottom: 20 }}>{title || "Sales Overview"}</h3>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 130, marginBottom: 12 }}>
        {data.map((item: any, i: number) => (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <span style={{ color: "#6b7280", fontSize: 9, fontFamily: "monospace" }}>{item.value}</span>
            <div style={{ width: "100%", height: `${(item.value / max) * 100}px`, background: "#2563eb", borderRadius: "4px 4px 0 0", opacity: 0.8 + (i * 0.04) }} />
            <span style={{ color: "#9ca3af", fontSize: 10 }}>{item.label}</span>
          </div>
        ))}
      </div>
      <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: 12, display: "flex", justifyContent: "space-between" }}>
        <div><p style={{ color: "#9ca3af", fontSize: 10 }}>TOTAL</p><p style={{ color: "#111", fontWeight: 700, fontSize: 13 }}>{data.reduce((a: number, d: any) => a + d.value, 0)}</p></div>
        <div><p style={{ color: "#9ca3af", fontSize: 10 }}>PEAK</p><p style={{ color: "#2563eb", fontWeight: 700, fontSize: 13 }}>{max}</p></div>
        <div><p style={{ color: "#9ca3af", fontSize: 10 }}>AVG</p><p style={{ color: "#111", fontWeight: 700, fontSize: 13 }}>{Math.round(data.reduce((a: number, d: any) => a + d.value, 0) / data.length)}</p></div>
      </div>
    </div>
  );
}

// ─── TableWidget ──────────────────────────────────────────────────────────
function TableWidget({ title, columns, rows }: any) {
  const cols = columns || ["Name", "Value", "Status"];
  const data = rows || [["Item 1", "$100", "✅ Active"], ["Item 2", "$200", "⏳ Pending"], ["Item 3", "$150", "✅ Active"]];
  return (
    <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
      <div style={{ padding: "14px 20px", borderBottom: "1px solid #f3f4f6", background: "#f9fafb" }}>
        <span style={{ color: "#2563eb", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", fontWeight: 600 }}>⊞ {title || "Data Table"}</span>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <thead>
            <tr style={{ background: "#f9fafb" }}>
              {cols.map((c: string) => <th key={c} style={{ padding: "10px 16px", textAlign: "left", color: "#6b7280", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", borderBottom: "1px solid #e5e7eb", whiteSpace: "nowrap" }}>{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {data.map((row: string[], i: number) => (
              <tr key={i} style={{ borderBottom: "1px solid #f9fafb" }}>
                {row.map((cell: string, j: number) => <td key={j} style={{ padding: "10px 16px", color: "#374151", fontSize: 13, whiteSpace: "nowrap" }}>{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── CardWidget ───────────────────────────────────────────────────────────
function CardWidget({ title, price, description, badge }: any) {
  return (
    <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 20, padding: 24, textAlign: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
      {badge && <span style={{ display: "inline-block", padding: "4px 12px", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 99, color: "#2563eb", fontSize: 11, letterSpacing: 2, marginBottom: 12 }}>{badge}</span>}
      <div style={{ fontSize: 48, marginBottom: 12 }}>🎁</div>
      <h3 style={{ color: "#111", fontSize: 18, fontWeight: 700, marginBottom: 6 }}>{title || "Premium Product"}</h3>
      <p style={{ color: "#6b7280", fontSize: 13, marginBottom: 16, lineHeight: 1.6 }}>{description || "High quality product"}</p>
      <div style={{ fontSize: 30, fontWeight: 800, color: "#2563eb", marginBottom: 16 }}>{price || "$99"}</div>
      <button style={{ background: "#2563eb", color: "white", border: "none", borderRadius: 12, padding: "11px 28px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Buy Now →</button>
    </div>
  );
}

// ─── ChatBubble ───────────────────────────────────────────────────────────
function ChatBubble({ message }: { message: string }) {
  return (
    <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 16, padding: 18, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
      <p style={{ color: "#374151", fontSize: 14, lineHeight: 1.7 }}>{message}</p>
    </div>
  );
}

// ─── Types & helpers ──────────────────────────────────────────────────────
type Message = { role: "user" | "ai"; text: string; component?: any };

const SUGGESTIONS = [
  { icon: "🌤️", label: "Mumbai Weather", cmd: "What's the weather in Mumbai?" },
  { icon: "🌧️", label: "Delhi Weather", cmd: "Weather in Delhi right now" },
  { icon: "🌍", label: "London Weather", cmd: "Current weather in London" },
  { icon: "📈", label: "Apple Stock", cmd: "Show me Apple stock price" },
  { icon: "🧮", label: "Calculator", cmd: "Open calculator" },
  { icon: "📊", label: "Dashboard", cmd: "Show sales dashboard" },
];

function renderComponent(comp: any) {
  if (!comp) return null;
  switch (comp.component) {
    case "weather": return <WeatherCard {...comp.data} />;
    case "stock": return <StockCard {...comp.data} />;
    case "calculator": return <CalculatorWidget />;
    case "dashboard": return <DashboardWidget {...comp.data} />;
    case "table": return <TableWidget {...comp.data} />;
    case "card": return <CardWidget {...comp.data} />;
    case "chat": return <ChatBubble message={comp.data?.message || ""} />;
    default: return null;
  }
}

function getAiReply(comp: any) {
  const c = comp?.component;
  if (c === "weather") return `🔴 Live weather for ${comp.data?.location} loaded!`;
  if (c === "stock") return `📈 ${comp.data?.symbol} stock price shown!`;
  if (c === "calculator") return "🧮 Calculator is ready!";
  if (c === "dashboard") return "📊 Dashboard rendered!";
  if (c === "table") return "⊞ Table generated!";
  if (c === "card") return "💳 Product card ready!";
  return comp?.data?.message || "Done!";
}

// ─── Chat panel (shared between mobile drawer & desktop sidebar) ──────────
function ChatPanel({
  messages, loading, input, setInput, send, bottomRef, onClose, isMobile,
}: {
  messages: Message[]; loading: boolean; input: string;
  setInput: (v: string) => void; send: (text?: string) => void;
  bottomRef: React.RefObject<HTMLDivElement>; onClose?: () => void; isMobile: boolean;
}) {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "white" }}>
      {/* Header */}
      <div style={{ padding: "14px 16px", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", gap: 10, background: "white", flexShrink: 0 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: loading ? "#f59e0b" : "#22c55e" }} />
        <span style={{ color: "#111", fontWeight: 600, fontSize: 14, flex: 1 }}>Chat</span>
        <span style={{ color: "#9ca3af", fontSize: 11, fontFamily: "monospace" }}>{loading ? "FETCHING..." : "READY"}</span>
        {isMobile && onClose && (
          <button onClick={onClose}
            aria-label="Close chat"
            style={{ marginLeft: 8, background: "none", border: "none", cursor: "pointer", color: "#6b7280", fontSize: 22, lineHeight: 1, padding: "0 4px" }}>
            ×
          </button>
        )}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 10, background: "#f8fafc" }}>
        {messages.length === 0 && (
          <div style={{ textAlign: "center", padding: 28 }}>
            <p style={{ color: "#d1d5db", fontSize: 13 }}>Ask anything to get started</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
            {msg.role === "ai" && (
              <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
                <div style={{ width: 26, height: 26, borderRadius: 8, background: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 9, fontWeight: 900, color: "white" }}>AI</span>
                </div>
                <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: "4px 14px 14px 14px", padding: "9px 13px", maxWidth: 220, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                  <p style={{ color: "#374151", fontSize: 13, lineHeight: 1.5 }}>{getAiReply(msg.component)}</p>
                </div>
              </div>
            )}
            {msg.role === "user" && (
              <div style={{ background: "#2563eb", borderRadius: "14px 4px 14px 14px", padding: "9px 13px", maxWidth: 220 }}>
                <p style={{ color: "white", fontSize: 13 }}>{msg.text}</p>
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: 5, padding: "6px 0" }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#2563eb", opacity: 0.4, animation: `bounce 1s ${i * 0.2}s infinite` }} />
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick chips */}
      <div style={{ padding: "8px 10px", borderTop: "1px solid #e5e7eb", display: "flex", gap: 6, flexWrap: "wrap", background: "white", flexShrink: 0 }}>
        {SUGGESTIONS.slice(0, 3).map(s => (
          <button key={s.cmd} onClick={() => send(s.cmd)}
            style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 99, padding: "4px 10px", fontSize: 11, color: "#6b7280", cursor: "pointer" }}>
            {s.icon} {s.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div style={{ padding: 12, borderTop: "1px solid #e5e7eb", background: "white", flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 8, background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 14, padding: "5px 5px 5px 14px", alignItems: "center" }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send()}
            placeholder="Type any command..."
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#111", fontSize: 14 }}
          />
          <button onClick={() => send()} disabled={loading || !input.trim()}
            style={{ width: 34, height: 34, borderRadius: 10, background: "#2563eb", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: (loading || !input.trim()) ? 0.3 : 1, flexShrink: 0 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────
export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile(768);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Close drawer on resize to desktop
  useEffect(() => {
    if (!isMobile) setChatOpen(false);
  }, [isMobile]);

  const send = useCallback(async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput("");
    if (isMobile) setChatOpen(true); // auto-open chat on mobile when sending
    setMessages(prev => [...prev, { role: "user", text: msg }]);
    setLoading(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: msg }] }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "ai", text: "", component: data }]);
    } catch {
      setMessages(prev => [...prev, { role: "ai", text: "", component: { component: "chat", data: { message: "Error occurred. Please try again." } } }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, isMobile]);

  const lastAiMessage = messages.filter(m => m.role === "ai").slice(-1)[0];
  const unreadCount = chatOpen ? 0 : messages.filter(m => m.role === "ai").length;

  return (
    <>
      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes bounce { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-6px);} }
        @keyframes slideUp { from { transform:translateY(100%); } to { transform:translateY(0); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', system-ui, sans-serif; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 2px; }
      `}</style>

      <div style={{ display: "flex", height: "100dvh", background: "#f8fafc", overflow: "hidden", fontFamily: "'DM Sans', system-ui, sans-serif", position: "relative" }}>

        {/* ── LEFT — UI Output panel ─────────────────────────────────────── */}
        <div style={{
          flex: 1,
          padding: isMobile ? "16px 14px" : "28px 28px",
          overflowY: "auto",
          background: "#f8fafc",
          // on desktop, leave room for right sidebar; on mobile, full width
          minWidth: 0,
        }}>
          {/* Header */}
          <div style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontSize: 12, fontWeight: 900, color: "white" }}>A2</span>
            </div>
            <div>
              <h1 style={{ color: "#111", fontSize: 16, fontWeight: 800, lineHeight: 1 }}>A2UI · AG-UI</h1>
              <p style={{ color: "#9ca3af", fontSize: 10, letterSpacing: 2 }}>GROQ + LLAMA 3.3 · LIVE</p>
            </div>
          </div>

          {/* Rendered component or empty state */}
          {lastAiMessage ? (
            <div style={{ maxWidth: 540, animation: "fadeIn 0.4s ease-out" }}>
              {renderComponent(lastAiMessage.component)}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: 20 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>✦</div>
                <h2 style={{ color: "#111", fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Ask AI to generate UI</h2>
                <p style={{ color: "#6b7280", fontSize: 13, maxWidth: 280 }}>Type a command — weather, stock, calculator, chart — AI will build the UI</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, width: "100%", maxWidth: isMobile ? 320 : 380 }}>
                {SUGGESTIONS.map(s => (
                  <button key={s.cmd} onClick={() => send(s.cmd)}
                    style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, padding: "11px 14px", textAlign: "left", cursor: "pointer", color: "#6b7280", fontSize: 12, display: "flex", alignItems: "center", gap: 8, boxShadow: "0 1px 4px rgba(0,0,0,0.05)", transition: "all 0.2s" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#2563eb"; (e.currentTarget as HTMLElement).style.color = "#2563eb"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#e5e7eb"; (e.currentTarget as HTMLElement).style.color = "#6b7280"; }}
                  >
                    <span style={{ fontSize: 18 }}>{s.icon}</span>
                    <span style={{ fontWeight: 500 }}>{s.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT — Desktop sidebar (hidden on mobile) ─────────────────── */}
        {!isMobile && (
          <div style={{ width: 340, borderLeft: "1px solid #e5e7eb", display: "flex", flexDirection: "column", flexShrink: 0 }}>
            <ChatPanel
              messages={messages}
              loading={loading}
              input={input}
              setInput={setInput}
              send={send}
              bottomRef={bottomRef}
              isMobile={false}
            />
          </div>
        )}

        {/* ── MOBILE — Backdrop overlay ──────────────────────────────────── */}
        {isMobile && chatOpen && (
          <div
            onClick={() => setChatOpen(false)}
            style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 40 }}
          />
        )}

        {/* ── MOBILE — Chat drawer (slides up from bottom) ───────────────── */}
        {isMobile && (
          <div style={{
            position: "absolute",
            bottom: 0, left: 0, right: 0,
            height: "72vh",
            borderRadius: "20px 20px 0 0",
            overflow: "hidden",
            boxShadow: "0 -8px 40px rgba(0,0,0,0.15)",
            zIndex: 50,
            transform: chatOpen ? "translateY(0)" : "translateY(100%)",
            transition: "transform 0.35s cubic-bezier(0.32,0.72,0,1)",
            display: "flex",
            flexDirection: "column",
          }}>
            {/* Drag handle */}
            <div style={{ background: "white", paddingTop: 10, paddingBottom: 4, display: "flex", justifyContent: "center", flexShrink: 0 }}>
              <div style={{ width: 40, height: 4, borderRadius: 2, background: "#e5e7eb" }} />
            </div>
            <div style={{ flex: 1, overflow: "hidden" }}>
              <ChatPanel
                messages={messages}
                loading={loading}
                input={input}
                setInput={setInput}
                send={send}
                bottomRef={bottomRef}
                onClose={() => setChatOpen(false)}
                isMobile={true}
              />
            </div>
          </div>
        )}

        {/* ── MOBILE — Floating Chat FAB button ─────────────────────────── */}
        {isMobile && !chatOpen && (
          <button
            onClick={() => setChatOpen(true)}
            aria-label="Open chat"
            style={{
              position: "absolute",
              bottom: 24,
              right: 20,
              width: 58,
              height: 58,
              borderRadius: "50%",
              background: "#2563eb",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 20px rgba(37,99,235,0.45)",
              zIndex: 60,
              transition: "transform 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.08)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
          >
            {/* Chat bubble icon */}
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {/* Unread badge */}
            {unreadCount > 0 && (
              <span style={{
                position: "absolute", top: 6, right: 6,
                width: 18, height: 18, borderRadius: "50%",
                background: "#ef4444", border: "2px solid white",
                fontSize: 10, fontWeight: 700, color: "white",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>{unreadCount}</span>
            )}
          </button>
        )}

        {/* Loading pulse on FAB when fetching on mobile */}
        {isMobile && loading && !chatOpen && (
          <div style={{
            position: "absolute", bottom: 24, right: 20,
            width: 58, height: 58, borderRadius: "50%",
            border: "3px solid #2563eb",
            animation: "ping 1s cubic-bezier(0,0,0.2,1) infinite",
            zIndex: 59,
            opacity: 0.4,
          }} />
        )}
      </div>

      <style>{`
        @keyframes ping { 75%,100% { transform: scale(1.5); opacity: 0; } }
      `}</style>
    </>
  );
}