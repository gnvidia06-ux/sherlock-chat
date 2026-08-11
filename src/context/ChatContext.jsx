import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { sendMessageToCharacter } from "../api/geminiClient";

const ChatContext = createContext(null);
const STORAGE_KEY = "sherlock-chat-history";

function loadStoredMessages() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getNextId(messages) {
  const maxId = messages.reduce((max, m) => Math.max(max, m.id || 0), 0);
  return maxId + 1;
}

export function ChatProvider({ children }) {
  const [messages, setMessages] = useState(() => loadStoredMessages());
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);

  // Cada vez que cambia el historial, lo guardamos en localStorage.
  useEffect(() => {
    try {
      if (messages.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Si localStorage falla (modo privado, cuota llena, etc.) seguimos igual.
    }
  }, [messages]);

  const sendMessage = useCallback(
    async (text) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      const userMessage = {
        id: getNextId(messages),
        role: "user",
        text: trimmed,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setError(null);
      setIsTyping(true);

      try {
        const history = [...messages, userMessage].map((m) => ({
          role: m.role,
          text: m.text,
        }));

        const replyText = await sendMessageToCharacter(history);

        const assistantMessage = {
          id: getNextId([...messages, userMessage]),
          role: "assistant",
          text: replyText,
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (err) {
        console.error("Error enviando mensaje:", err);
        setError(
          err.message || "Ocurrió un error al hablar con el personaje. Probá de nuevo."
        );
      } finally {
        setIsTyping(false);
      }
    },
    [messages]
  );

  const clearError = useCallback(() => setError(null), []);

  const clearHistory = useCallback(() => {
    setMessages([]);
    setError(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // no-op
    }
  }, []);

  const value = { messages, isTyping, error, sendMessage, clearError, clearHistory };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) {
    throw new Error("useChat debe usarse dentro de un ChatProvider");
  }
  return ctx;
}