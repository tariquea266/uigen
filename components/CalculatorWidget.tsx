"use client";
import { useState } from "react";

type ButtonType = "num" | "op" | "eq" | "clear";

interface CalcButtonConfig {
  bg: string;
  color: string;
  border: string;
}

const BUTTON_STYLES: Record<ButtonType, CalcButtonConfig> = {
  num:   { bg: "#f9fafb", color: "#111",    border: "#e5e7eb" },
  op:    { bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe" },
  eq:    { bg: "#2563eb", color: "white",   border: "#2563eb" },
  clear: { bg: "#fef2f2", color: "#dc2626", border: "#fca5a5" },
};

const BUTTONS: [string, ButtonType][] = [
  ["C", "clear"], ["±", "op"], ["%", "op"], ["÷", "op"],
  ["7", "num"],   ["8", "num"], ["9", "num"], ["×", "op"],
  ["4", "num"],   ["5", "num"], ["6", "num"], ["-", "op"],
  ["1", "num"],   ["2", "num"], ["3", "num"], ["+", "op"],
  ["0", "num"],   [".", "num"], ["=", "eq"],
];

export default function CalculatorWidget() {
  const [display, setDisplay] = useState("0");
  const [prev, setPrev]       = useState("");
  const [op, setOp]           = useState("");
  const [fresh, setFresh]     = useState(false);

  const handlePress = (label: string) => {
    if (label === "C") {
      setDisplay("0"); setPrev(""); setOp(""); setFresh(false);
      return;
    }
    if (["+", "-", "×", "÷"].includes(label)) {
      setPrev(display); setOp(label); setFresh(true);
      return;
    }
    if (label === "=") {
      if (!prev || !op) return;
      const a = parseFloat(prev);
      const b = parseFloat(display);
      const result =
        op === "+" ? a + b :
        op === "-" ? a - b :
        op === "×" ? a * b :
        b !== 0    ? a / b : 0;
      setDisplay(String(parseFloat(result.toFixed(8))));
      setPrev(""); setOp(""); setFresh(false);
      return;
    }
    if (label === "." && display.includes(".")) return;
    setDisplay(fresh || display === "0" ? label : display + label);
    setFresh(false);
  };

  return (
    <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 20, padding: 20, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
      <p style={{ color: "#6b7280", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Calculator</p>

      <div style={{ background: "#f9fafb", borderRadius: 12, padding: "12px 16px", marginBottom: 12, textAlign: "right", border: "1px solid #e5e7eb" }}>
        {op && <p style={{ color: "#9ca3af", fontSize: 11, fontFamily: "monospace" }}>{prev} {op}</p>}
        <p style={{ color: "#111", fontSize: 32, fontWeight: 700, fontFamily: "monospace" }}>{display}</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
        {BUTTONS.map(([label, type]) => {
          const s = BUTTON_STYLES[type];
          return (
            <button
              key={label}
              onClick={() => handlePress(label)}
              style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, borderRadius: 12, fontSize: 17, fontWeight: 600, padding: "14px 0", cursor: "pointer", fontFamily: "monospace", transition: "opacity 0.15s" }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.75")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
