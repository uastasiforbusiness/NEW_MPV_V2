"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatWidget() {
  const t = useTranslations("chat");
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: t("welcome"),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response },
      ]);
    } catch (error) {
      console.error("[Chat Widget Error]:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: t("error"),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-40 w-14 h-14 rounded-full bg-[var(--accent)] text-white shadow-lg hover:bg-[var(--accent-hover)] transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
        aria-label={isOpen ? t("closeButton") : t("openButton")}
      >
        {isOpen ? (
          <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
          </svg>
        ) : (
          <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path d="M3.505 2.365A41.369 41.369 0 019 2c1.863 0 3.697.124 5.495.365 1.247.167 2.18 1.108 2.435 2.268a4.45 4.45 0 00-.577-.069 43.141 43.141 0 00-4.706 0C9.229 4.696 7.5 6.727 7.5 8.906v.384c0 1.17.632 2.185 1.545 2.729.746.447 1.46.897 1.745 1.507.357.765.215 1.643-.493 2.29a1.664 1.664 0 01-.472.3l-.007.004-.012.007-.008.004a1.456 1.456 0 01-.598.126.917.917 0 01-.497-.158.94.94 0 01-.256-.256L7.497 14.32l-.001-.001a1.631 1.631 0 00-.65-.552C5.679 12.773 4.5 11.22 4.5 9.29V6.905c0-1.02.727-1.878 1.707-2.037A42.288 42.288 0 013.505 2.364z" />
          </svg>
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-40 w-[360px] max-w-[calc(100vw-2rem)] h-[500px] max-h-[70vh] bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 bg-[var(--brand-charcoal)] text-white">
            <p className="text-sm font-semibold">{t("header")}</p>
            <p className="text-xs text-[var(--neutral-400)]">
              {t("subheader")}
            </p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3" aria-live="polite" aria-label={t("messagesLabel")}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-[var(--radius-md)] px-3.5 py-2.5 text-sm ${
                    msg.role === "user"
                      ? "bg-[var(--accent)] text-white"
                      : "bg-[var(--neutral-100)] text-[var(--foreground)]"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[var(--neutral-100)] rounded-[var(--radius-md)] px-3.5 py-2.5 text-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[var(--muted)] rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-[var(--muted)] rounded-full animate-bounce [animation-delay:0.1s]" />
                  <span className="w-1.5 h-1.5 bg-[var(--muted)] rounded-full animate-bounce [animation-delay:0.2s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-[var(--border)]">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("inputPlaceholder")}
                aria-label={t("inputLabel")}
                className="flex-1 px-3 py-2 text-sm bg-[var(--neutral-50)] border border-[var(--border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="px-3 py-2 min-w-[44px] min-h-[44px] flex items-center justify-center bg-[var(--accent)] text-white rounded-[var(--radius-md)] hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={t("sendLabel")}
              >
                <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
