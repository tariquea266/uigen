"use client";
import { useEffect, useState } from "react";
import { useChat }          from "@/hooks/useChat";
import { useIsMobile }      from "@/hooks/useIsMobile";
import ChatPanel            from "@/components/ChatPanel";
import ComponentRenderer    from "@/components/ComponentRenderer";
import EmptyState           from "@/components/EmptyState";

export default function Home() {
  const { messages, input, loading, bottomRef, setInput, send } = useChat();
  const isMobile  = useIsMobile();
  const [chatOpen, setChatOpen] = useState(false);

  // Auto-scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, bottomRef]);

  // Close drawer when switching to desktop
  useEffect(() => {
    if (!isMobile) setChatOpen(false);
  }, [isMobile]);

  const handleSend = (text?: string) => {
    if (isMobile) setChatOpen(true);
    send(text);
  };

  const lastAiMessage = messages.filter((m) => m.role === "ai").slice(-1)[0];
  const unreadCount   = chatOpen ? 0 : messages.filter((m) => m.role === "ai").length;

  return (
    <>
      <style>{`
        @keyframes fadeIn  { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes bounce  { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-6px);} }
        @keyframes ping    { 75%,100%{ transform:scale(1.5); opacity:0; } }
        * { box-sizing:border-box; margin:0; padding:0; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-thumb { background:#e5e7eb; border-radius:2px; }
      `}</style>

      <div style={{ display:"flex", height:"100dvh", background:"#f8fafc", overflow:"hidden", fontFamily:"'DM Sans', system-ui, sans-serif", position:"relative" }}>

        {/* ── Left — UI output ─────────────────────────────────────────── */}
        <div style={{ flex:1, padding: isMobile ? "16px 14px" : "28px 28px", overflowY:"auto", minWidth:0 }}>

          {/* Header */}
          <div style={{ marginBottom:20, display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:34, height:34, borderRadius:10, background:"#2563eb", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <span style={{ fontSize:12, fontWeight:900, color:"white" }}>A2</span>
            </div>
            <div style={{ flex:1 }}>
              <h1 style={{ color:"#111", fontSize:16, fontWeight:800, lineHeight:1 }}>A2UI · AG-UI</h1>
              <p style={{ color:"#9ca3af", fontSize:10, letterSpacing:2 }}>GROQ + LLAMA 3.3 · LIVE</p>
            </div>
            <a
              href="https://github.com/tariquea266"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display:"flex", alignItems:"center", gap:6, padding:"5px 12px", border:"1px solid #e5e7eb", borderRadius:99, textDecoration:"none", background:"white", flexShrink:0 }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#2563eb"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#e5e7eb"; }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{ fontSize:12, color:"#6b7280", fontWeight:500 }}>Tarique</span>
            </a>
          </div>

          {/* Rendered component or empty state */}
          {lastAiMessage?.component ? (
            <div style={{ maxWidth:540, animation:"fadeIn 0.4s ease-out" }}>
              <ComponentRenderer comp={lastAiMessage.component} />
            </div>
          ) : (
            <EmptyState onSend={handleSend} isMobile={isMobile} />
          )}
        </div>

        {/* ── Right — Desktop sidebar ───────────────────────────────────── */}
        {!isMobile && (
          <div style={{ width:340, borderLeft:"1px solid #e5e7eb", display:"flex", flexDirection:"column", flexShrink:0 }}>
            <ChatPanel
              messages={messages} loading={loading}
              input={input} setInput={setInput} send={handleSend}
              bottomRef={bottomRef} isMobile={false}
            />
          </div>
        )}

        {/* ── Mobile — Backdrop ─────────────────────────────────────────── */}
        {isMobile && chatOpen && (
          <div onClick={() => setChatOpen(false)}
            style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.4)", zIndex:40 }}
          />
        )}

        {/* ── Mobile — Chat drawer ──────────────────────────────────────── */}
        {isMobile && (
          <div style={{
            position:"absolute", bottom:0, left:0, right:0,
            height:"72vh", borderRadius:"20px 20px 0 0",
            overflow:"hidden", boxShadow:"0 -8px 40px rgba(0,0,0,0.15)",
            zIndex:50,
            transform: chatOpen ? "translateY(0)" : "translateY(100%)",
            transition:"transform 0.35s cubic-bezier(0.32,0.72,0,1)",
            display:"flex", flexDirection:"column",
          }}>
            <div style={{ background:"white", paddingTop:10, paddingBottom:4, display:"flex", justifyContent:"center", flexShrink:0 }}>
              <div style={{ width:40, height:4, borderRadius:2, background:"#e5e7eb" }} />
            </div>
            <div style={{ flex:1, overflow:"hidden" }}>
              <ChatPanel
                messages={messages} loading={loading}
                input={input} setInput={setInput} send={handleSend}
                bottomRef={bottomRef} onClose={() => setChatOpen(false)} isMobile={true}
              />
            </div>
          </div>
        )}

        {/* ── Mobile — FAB chat button ──────────────────────────────────── */}
        {isMobile && !chatOpen && (
          <button
            onClick={() => setChatOpen(true)}
            aria-label="Open chat"
            style={{ position:"absolute", bottom:24, right:20, width:58, height:58, borderRadius:"50%", background:"#2563eb", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 20px rgba(37,99,235,0.45)", zIndex:60, transition:"transform 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {unreadCount > 0 && (
              <span style={{ position:"absolute", top:6, right:6, width:18, height:18, borderRadius:"50%", background:"#ef4444", border:"2px solid white", fontSize:10, fontWeight:700, color:"white", display:"flex", alignItems:"center", justifyContent:"center" }}>
                {unreadCount}
              </span>
            )}
          </button>
        )}

        {/* FAB loading ring */}
        {isMobile && loading && !chatOpen && (
          <div style={{ position:"absolute", bottom:24, right:20, width:58, height:58, borderRadius:"50%", border:"3px solid #2563eb", animation:"ping 1s cubic-bezier(0,0,0.2,1) infinite", zIndex:59, opacity:0.4 }} />
        )}
      </div>
    </>
  );
}