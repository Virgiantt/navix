/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState, useRef, useEffect } from "react";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, history: messages }),
      });
      if (!res.ok) throw new Error("Failed to get response");
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      setInput("");
    } catch {
      setError("Sorry, something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading) sendMessage();
  };

  return (
    <>
      {/* Floating Button */}
      <button
        className="fixed bottom-6 right-6 z-50 bg-lochmara-500 hover:bg-lochmara-600 text-white rounded-full shadow-2xl border-2 border-lochmara-500 focus:outline-none transition-all font-sans p-4 md:p-4"
        style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}
        onClick={() => setOpen((o) => !o)}
        aria-label="Open chat"
      >
        {open ? (
          <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
        ) : (
          <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
        )}
      </button>
      {/* Chat Box */}
      {open && (
        <div
          className="fixed bottom-24 right-2 md:right-6 z-50 w-full max-w-xs md:max-w-md rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in font-sans border-2 border-lochmara-500"
          style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(16px)' }}
        >
          {/* Header with logo/icon */}
          <div className="flex items-center gap-3 bg-lochmara-500 text-white px-4 py-3 font-bold text-lg tracking-wide border-b border-lochmara-400">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white bg-opacity-20">
              {/* Agency logo or chat icon */}
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
            </span>
            <span>AI Project Advisor</span>
          </div>
          {/* Welcome message */}
          {messages.length === 0 && (
            <div className="px-4 pt-4 pb-2 text-lochmara-600 text-center text-base font-medium">
              👋 Hi! I&apos;m your AI advisor. Ask me anything about Navix Agency, our services, or your project ideas!
            </div>
          )}
          {/* Chat history */}
          <div className="flex-1 p-3 md:p-4 overflow-y-auto max-h-80 md:max-h-96 text-sm space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={msg.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <span className={msg.role === "user"
                  ? "inline-block bg-gradient-to-br from-lochmara-100 to-lochmara-200 text-lochmara-900 rounded-2xl px-4 py-2 my-1 shadow-md max-w-[80%]"
                  : "inline-block bg-white/80 border border-lochmara-100 text-lochmara-800 rounded-2xl px-4 py-2 my-1 shadow-sm max-w-[80%]"}>
                  {msg.content}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          {error && <div className="text-red-500 text-xs px-4 pb-2 text-center">{error}</div>}
          {/* Input area */}
          <div className="flex border-t border-lochmara-200 bg-gradient-to-r from-lochmara-50 via-white to-lochmara-100 px-2 py-2">
            <input
              className="flex-1 px-3 py-2 text-sm focus:outline-none bg-white rounded-l-xl border-none font-sans placeholder-lochmara-400"
              style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}
              type="text"
              placeholder="Type your question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              aria-label="Chat input"
            />
            <button
              className="px-4 py-2 text-white font-bold disabled:opacity-50 bg-lochmara-500 hover:bg-lochmara-600 rounded-r-xl border-l border-lochmara-200 font-sans shadow-md transition-all"
              style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              aria-label="Send message"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
              ) : (
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
} 