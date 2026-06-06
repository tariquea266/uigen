"use client";
import { useState, useRef, useEffect } from "react";

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
    if (!icon) return "linear-gradient(135deg, #1a6fba 0%, #2d8bba 100%)";
    const i = icon.toLowerCase();
    if (i.includes("rain") || i.includes("thunder")) return "linear-gradient(135deg, #2c3e50 0%, #3d5a80 100%)";
    if (i.includes("cloud")) return "linear-gradient(135deg, #4a5568 0%, #718096 100%)";
    return "linear-gradient(135deg, #1a6fba 0%, #f6a623 100%)";
  };
  return (
    <div style={{ background: getBg(), borderRadius: 24, padding: 28, color: "white", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, background: "rgba(255,255,255,0.08)", borderRadius: "50%" }} />
      <div style={{ position: "absolute", bottom: -30, left: -30, width: 120, height: 120, background: "rgba(255,255,255,0.05)", borderRadius: "50%" }} />
      <div style={{ position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
          <div>
            <p style={{ fontSize: 11, opacity: 0.7, letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>🔴 LIVE · Current Weather</p>
            <h3 style={{ fontSize: 20, fontWeight: 700 }}>📍 {location}</h3>
          </div>
          <div style={{ fontSize: 56, lineHeight: 1 }}>{getIcon()}</div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 16, margin: "16px 0" }}>
          <div style={{ fontSize: 80, fontWeight: 900, lineHeight: 1 }}>{temperature}°</div>
          <div style={{ paddingBottom: 10 }}>
            <p style={{ fontSize: 13, opacity: 0.8 }}>Feels like {feels_like}°C</p>
            <p style={{ fontSize: 16, fontWeight: 600 }}>{conditions}</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
          <span style={{ fontSize: 13, opacity: 0.8 }}>↑ {high}°</span>
          <span style={{ fontSize: 13, opacity: 0.8 }}>↓ {low}°</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: 16 }}>
          {[["💧", "Humidity", `${humidity}%`], ["💨", "Wind", `${wind} km/h`], ["🌡️", "Pressure", `${pressure} hPa`], ["👁️", "Visibility", `${visibility} km`]].map(([emoji, label, val]) => (
            <div key={label as string} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 18, marginBottom: 4 }}>{emoji}</div>
              <p style={{ fontSize: 10, opacity: 0.6, textTransform: "uppercase", letterSpacing: 1 }}>{label}</p>
              <p style={{ fontSize: 13, fontWeight: 700 }}>{val}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StockCard({ symbol, price, change, high, low, volume }: any) {
  const isUp = (change || 0) >= 0;
  return (
    <div style={{ background: "white", border: `1px solid ${isUp ? "#22c55e" : "#ef4444"}30`, borderRadius: 20, padding: 28, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <p style={{ fontSize: 12, color: "#9ca3af", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Stock Price</p>
          <h3 style={{ fontSize: 28, fontWeight: 800, color: "#111" }}>{symbol || "AAPL"}</h3>
        </div>
        <div style={{ padding: "8px 16px", background: isUp ? "#f0fdf4" : "#fef2f2", borderRadius: 12, border: `1px solid ${isUp ? "#86efac" : "#fca5a5"}` }}>
          <span style={{ color: isUp ? "#16a34a" : "#dc2626", fontWeight: 700, fontSize: 16 }}>
            {isUp ? "▲" : "▼"} {Math.abs(change || 2.5)}%
          </span>
        </div>
      </div>
      <div style={{ fontSize: 52, fontWeight: 800, color: isUp ? "#16a34a" : "#dc2626", marginBottom: 20 }}>
        ${(price || 175.5).toFixed(2)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, borderTop: "1px solid #f3f4f6", paddingTop: 16 }}>
        {[["HIGH", `$${high || 178}`], ["LOW", `$${low || 172}`], ["VOLUME", volume || "45M"]].map(([label, val]) => (
          <div key={label}>
            <p style={{ fontSize: 11, color: "#9ca3af", marginBottom: 4 }}>{label}</p>
            <p style={{ fontWeight: 700, color: "#374151" }}>{val}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

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
      <button key={label} onClick={handleClick} style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, borderRadius: 12, fontSize: 18, fontWeight: 600, padding: "16px", cursor: "pointer", fontFamily: "monospace", transition: "opacity 0.15s" }}
        onMouseEnter={e => (e.currentTarget.style.opacity = "0.75")}
        onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
      >{label}</button>
    );
  };
  return (
    <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 20, padding: 24, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
      <p style={{ color: "#6b7280", fontSize: 12, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>Calculator</p>
      <div style={{ background: "#f9fafb", borderRadius: 12, padding: "16px 20px", marginBottom: 16, textAlign: "right", border: "1px solid #e5e7eb" }}>
        {op && <p style={{ color: "#9ca3af", fontSize: 12, fontFamily: "monospace" }}>{prev} {op}</p>}
        <p style={{ color: "#111", fontSize: 36, fontWeight: 700, fontFamily: "monospace" }}>{display}</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
        {btn("C", "clear")}{btn("±", "op")}{btn("%", "op")}{btn("÷", "op")}
        {["7", "8", "9"].map(n => btn(n, "num"))}{btn("×", "op")}
        {["4", "5", "6"].map(n => btn(n, "num"))}{btn("-", "op")}
        {["1", "2", "3"].map(n => btn(n, "num"))}{btn("+", "op")}
        {btn("0", "num")}{btn(".", "num")}{btn("=", "eq")}
      </div>
    </div>
  );
}

function DashboardWidget({ title, items }: any) {
  const data = items || [{ label: "Jan", value: 65 }, { label: "Feb", value: 45 }, { label: "Mar", value: 80 }, { label: "Apr", value: 55 }, { label: "May", value: 90 }];
  const max = Math.max(...data.map((d: any) => d.value));
  return (
    <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 20, padding: 24, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
      <p style={{ color: "#2563eb", fontSize: 12, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Dashboard</p>
      <h3 style={{ color: "#111", fontSize: 18, fontWeight: 700, marginBottom: 24 }}>{title || "Sales Overview"}</h3>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 160, marginBottom: 16 }}>
        {data.map((item: any, i: number) => (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <span style={{ color: "#6b7280", fontSize: 10, fontFamily: "monospace" }}>{item.value}</span>
            <div style={{ width: "100%", height: `${(item.value / max) * 130}px`, background: "linear-gradient(180deg, #2563eb, #60a5fa)", borderRadius: "6px 6px 0 0" }} />
            <span style={{ color: "#9ca3af", fontSize: 11 }}>{item.label}</span>
          </div>
        ))}
      </div>
      <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: 16, display: "flex", justifyContent: "space-between" }}>
        <div><p style={{ color: "#9ca3af", fontSize: 11 }}>TOTAL</p><p style={{ color: "#111", fontWeight: 700 }}>{data.reduce((a: number, d: any) => a + d.value, 0)}</p></div>
        <div><p style={{ color: "#9ca3af", fontSize: 11 }}>PEAK</p><p style={{ color: "#2563eb", fontWeight: 700 }}>{max}</p></div>
        <div><p style={{ color: "#9ca3af", fontSize: 11 }}>AVG</p><p style={{ color: "#111", fontWeight: 700 }}>{Math.round(data.reduce((a: number, d: any) => a + d.value, 0) / data.length)}</p></div>
      </div>
    </div>
  );
}

function TableWidget({ title, columns, rows }: any) {
  const cols = columns || ["Name", "Value", "Status"];
  const data = rows || [["Item 1", "$100", "✅ Active"], ["Item 2", "$200", "⏳ Pending"], ["Item 3", "$150", "✅ Active"]];
  return (
    <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
      <div style={{ padding: "16px 24px", borderBottom: "1px solid #f3f4f6", background: "#f9fafb" }}>
        <span style={{ color: "#2563eb", fontSize: 12, letterSpacing: 2, textTransform: "uppercase", fontWeight: 600 }}>⊞ {title || "Data Table"}</span>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f9fafb" }}>
            {cols.map((c: string) => <th key={c} style={{ padding: "12px 20px", textAlign: "left", color: "#6b7280", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", borderBottom: "1px solid #e5e7eb" }}>{c}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.map((row: string[], i: number) => (
            <tr key={i} style={{ borderBottom: "1px solid #f9fafb" }}>
              {row.map((cell: string, j: number) => <td key={j} style={{ padding: "12px 20px", color: "#374151", fontSize: 14 }}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CardWidget({ title, price, description, badge }: any) {
  return (
    <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 20, padding: 28, textAlign: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
      {badge && <span style={{ display: "inline-block", padding: "4px 12px", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 99, color: "#2563eb", fontSize: 11, letterSpacing: 2, marginBottom: 16 }}>{badge}</span>}
      <div style={{ fontSize: 56, marginBottom: 16 }}>🎁</div>
      <h3 style={{ color: "#111", fontSize: 22, fontWeight: 700, marginBottom: 8 }}>{title || "Premium Product"}</h3>
      <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>{description || "High quality product"}</p>
      <div style={{ fontSize: 36, fontWeight: 800, color: "#2563eb", marginBottom: 20 }}>{price || "$99"}</div>
      <button style={{ background: "#2563eb", color: "white", border: "none", borderRadius: 12, padding: "12px 32px", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>Buy Now →</button>
    </div>
  );
}

function ChatBubble({ message }: { message: string }) {
  return (
    <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 16, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
      <p style={{ color: "#374151", fontSize: 15, lineHeight: 1.7 }}>{message}</p>
    </div>
  );
}

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

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput("");
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
  };

  const getAiReply = (comp: any) => {
    const c = comp?.component;
    if (c === "weather") return `🔴 Live weather for ${comp.data?.location} loaded!`;
    if (c === "stock") return `📈 ${comp.data?.symbol} stock price shown!`;
    if (c === "calculator") return "🧮 Calculator is ready!";
    if (c === "dashboard") return "📊 Dashboard rendered!";
    if (c === "table") return "⊞ Table generated!";
    if (c === "card") return "💳 Product card ready!";
    return comp?.data?.message || "Done!";
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: "#f8fafc", fontFamily: "'DM Sans', system-ui, sans-serif", overflow: "hidden" }}>

      {/* LEFT — UI Output */}
      <div style={{ flex: 1, padding: 32, overflowY: "auto", borderRight: "1px solid #e5e7eb", background: "#f8fafc" }}>
        {/* Header */}
        <div style={{ marginBottom: 28, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #2563eb, #60a5fa)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 14, fontWeight: 900, color: "white" }}>A2</span>
          </div>
          <div>
            <h1 style={{ color: "#111", fontSize: 18, fontWeight: 800, lineHeight: 1 }}>A2UI · AG-UI</h1>
            <p style={{ color: "#9ca3af", fontSize: 11, letterSpacing: 2 }}>GROQ + LLAMA 3.3 · LIVE DATA</p>
          </div>
        </div>

        {/* Empty state */}
        {messages.filter(m => m.role === "ai").length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "calc(100% - 100px)", gap: 24 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>✦</div>
              <h2 style={{ color: "#111", fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Ask AI to generate UI</h2>
              <p style={{ color: "#6b7280", fontSize: 14, maxWidth: 320 }}>Type a command — weather, stock, calculator, chart — AI will generate the UI automatically</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, width: "100%", maxWidth: 400 }}>
              {SUGGESTIONS.map(s => (
                <button key={s.cmd} onClick={() => send(s.cmd)} style={{
                  background: "white", border: "1px solid #e5e7eb", borderRadius: 12,
                  padding: "12px 16px", textAlign: "left", cursor: "pointer", color: "#6b7280",
                  fontSize: 13, display: "flex", alignItems: "center", gap: 10,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.05)", transition: "all 0.2s"
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#2563eb"; (e.currentTarget as HTMLElement).style.color = "#2563eb"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#e5e7eb"; (e.currentTarget as HTMLElement).style.color = "#6b7280"; }}
                >
                  <span style={{ fontSize: 20 }}>{s.icon}</span>
                  <span style={{ fontWeight: 500 }}>{s.label}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ maxWidth: 520 }}>
            {messages.filter(m => m.role === "ai").slice(-1).map((msg, i) => (
              <div key={i} style={{ animation: "fadeIn 0.4s ease-out" }}>
                {renderComponent(msg.component)}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT — Chat */}
      <div style={{ width: 360, display: "flex", flexDirection: "column", background: "white", borderLeft: "1px solid #e5e7eb" }}>
        {/* Chat header */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", gap: 10, background: "white" }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: loading ? "#f59e0b" : "#22c55e" }} />
          <span style={{ color: "#111", fontWeight: 600, fontSize: 14 }}>Chat</span>
          <span style={{ color: "#9ca3af", fontSize: 11, marginLeft: "auto", fontFamily: "monospace" }}>{loading ? "FETCHING..." : "READY"}</span>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12, background: "#f8fafc" }}>
          {messages.length === 0 && (
            <div style={{ textAlign: "center", padding: 32 }}>
              <p style={{ color: "#d1d5db", fontSize: 13 }}>Ask anything to get started</p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
              {msg.role === "ai" && (
                <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #2563eb, #60a5fa)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 10, fontWeight: 900, color: "white" }}>AI</span>
                  </div>
                  <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: "4px 16px 16px 16px", padding: "10px 14px", maxWidth: 260, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                    <p style={{ color: "#374151", fontSize: 13, lineHeight: 1.5 }}>{getAiReply(msg.component)}</p>
                  </div>
                </div>
              )}
              {msg.role === "user" && (
                <div style={{ background: "#2563eb", borderRadius: "16px 4px 16px 16px", padding: "10px 14px", maxWidth: 240 }}>
                  <p style={{ color: "white", fontSize: 13 }}>{msg.text}</p>
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", gap: 6, padding: "8px 0" }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "#2563eb", opacity: 0.4, animation: `bounce 1s ${i * 0.2}s infinite` }} />
              ))}
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick suggestions */}
        <div style={{ padding: "8px 12px", borderTop: "1px solid #e5e7eb", display: "flex", gap: 6, flexWrap: "wrap", background: "white" }}>
          {SUGGESTIONS.slice(0, 3).map(s => (
            <button key={s.cmd} onClick={() => send(s.cmd)} style={{
              background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 99,
              padding: "4px 10px", fontSize: 11, color: "#6b7280", cursor: "pointer"
            }}>{s.icon} {s.label}</button>
          ))}
        </div>

        {/* Input */}
        <div style={{ padding: 16, borderTop: "1px solid #e5e7eb", background: "white" }}>
          <div style={{ display: "flex", gap: 8, background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 14, padding: "6px 6px 6px 16px", alignItems: "center" }}>
            <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Type any command..."
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#111", fontSize: 14 }} />
            <button onClick={() => send()} disabled={loading || !input.trim()} style={{
              width: 36, height: 36, borderRadius: 10, background: "#2563eb",
              border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              opacity: (loading || !input.trim()) ? 0.3 : 1, flexShrink: 0
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes bounce { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-6px);} }
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:#e5e7eb;border-radius:2px;}
      `}</style>
    </div>
  );
}