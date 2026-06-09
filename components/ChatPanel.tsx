"use client";
import { Message } from "@/types";
import { SUGGESTIONS } from "@/constants/suggestions";
import { getAiReply } from "./ComponentRenderer";

interface ChatPanelProps {
  messages:  Message[];
  loading:   boolean;
  input:     string;
  setInput:  (v: string) => void;
  send:      (text?: string) => void;
  bottomRef: React.RefObject<HTMLDivElement | null>;
  onClose?:  () => void;
  isMobile:  boolean;
}

export default function ChatPanel({
  messages, loading, input, setInput, send, bottomRef, onClose, isMobile,
}: ChatPanelProps) {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "white" }}>

      {/* Header */}
      <div style={{ padding: "14px 16px", borderBottom: "1px solid #c5c5c5", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: loading ? "#f59e0b" : "#22c55e" }} />
        <span style={{ color: "#111", fontWeight: 600, fontSize: 14, flex: 1 }}>Chat</span>
        <span style={{ color: "#9ca3af", fontSize: 11, fontFamily: "monospace" }}>
          {loading ? "FETCHING..." : "READY"}
        </span>
        {isMobile && onClose && (
          <button
            onClick={onClose}
            aria-label="Close chat"
            style={{ marginLeft: 8, background: "none", border: "none", cursor: "pointer", color: "#6b7280", fontSize: 22, lineHeight: 1, padding: "0 4px" }}
          >
            ×
          </button>
        )}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 10, background: "#f8fafc" }}>
        {messages.length === 0 && (
          <div style={{ textAlign: "center", padding: 28 }}>
            <p style={{ color: "#b2b6bc", fontSize: 14 }}>Ask anything to get started</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
            {msg.role === "ai" && (
              <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
                <div style={{ width: 26, height: 26, borderRadius: 8, background: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 9, fontWeight: 900, color: "white" }}>AI</span>
                </div>
                <div style={{ background: "white", border: "1px solid #a8a8a8", borderRadius: "4px 14px 14px 14px", padding: "9px 13px", maxWidth: 220 }}>
                  <p style={{ color: "#374151", fontSize: 13, lineHeight: 1.5 }}>
                    {msg.component ? getAiReply(msg.component) : msg.text}
                  </p>
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
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#2563eb", opacity: 0.4, animation: `bounce 1s ${i * 0.2}s infinite` }} />
            ))}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Quick chips */}
      <div style={{ padding: "8px 10px", borderTop: "1px solid #c5c5c5", display: "flex", gap: 6, flexWrap: "wrap", background: "white", flexShrink: 0 }}>
        {SUGGESTIONS.slice(0, 3).map((s) => (
          <button
            key={s.cmd}
            onClick={() => send(s.cmd)}
            style={{ background: "#f9fafb", border: "1px solid #d9d9d9", borderRadius: 99, padding: "4px 10px", fontSize: 11, color: "#6b7280", cursor: "pointer" }}
          >
            {s.icon} {s.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div style={{ padding: 12, borderTop: "1px solid #c5c5c5", background: "white", flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 8, background: "#f9fafb", border: "1px solid #d9d9d9", borderRadius: 14, padding: "5px 5px 5px 14px", alignItems: "center" }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Type any command..."
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#111", fontSize: 14 }}
          />
          <button
            onClick={() => send()}
            disabled={loading || !input.trim()}
            aria-label="Send message"
            style={{ width: 34, height: 34, borderRadius: 10, background: "#2563eb", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: loading || !input.trim() ? 0.3 : 1, flexShrink: 0 }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
