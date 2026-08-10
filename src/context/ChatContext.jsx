import { createContext, useContext, useState, useCallback } from "react";
import { sendMessageToCharacter } from "../api/geminiClient";

const ChatContext = createContext(null);

let idCounter = 0;
function nextId() {
  idCounter += 1;
  return idCounter;
}

export function ChatProvider({ children }) {
  // El historial vive solo en memoria: se pierde al recargar la app (a propósito).
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = useCallback(
    async (text) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      const userMessage = {
        id: nextId(),
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
          id: nextId(),
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

  const value = { messages, isTyping, error, sendMessage, clearError };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) {
    throw new Error("useChat debe usarse dentro de un ChatProvider");
  }
  return ctx;
}
