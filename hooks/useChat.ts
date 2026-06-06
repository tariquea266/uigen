import { useState, useCallback, useRef } from "react";
import { Message } from "@/types";

interface UseChatReturn {
  messages: Message[];
  input: string;
  loading: boolean;
  bottomRef: React.RefObject<HTMLDivElement | null>;
  setInput: (value: string) => void;
  send: (text?: string) => Promise<void>;
}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const send = useCallback(
    async (text?: string) => {
      const msg = (text || input).trim();
      if (!msg || loading) return;

      setInput("");
      setMessages((prev) => [...prev, { role: "user", text: msg }]);
      setLoading(true);

      try {
        const res = await fetch("/api/ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: [{ role: "user", content: msg }] }),
        });

        if (!res.ok) throw new Error(`API error: ${res.status}`);

        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          { role: "ai", text: "", component: data },
        ]);
      } catch (err) {
        console.error("Chat error:", err);
        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            text: "",
            component: {
              component: "chat",
              data: { message: "Error occurred. Please try again." },
            },
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [input, loading]
  );

  return { messages, input, loading, bottomRef, setInput, send };
}
