import { useEffect, useRef, useState } from "react";
import { useChat } from "../context/ChatContext";
import ChatMessage from "../components/ChatMessage";
import TypingIndicator from "../components/TypingIndicator";
import ChatInput from "../components/ChatInput";

const NEAR_BOTTOM_THRESHOLD = 80;

export default function Chat() {
  const { messages, isTyping, error, sendMessage, clearError, clearHistory } = useChat();
  const windowRef = useRef(null);
  const bottomRef = useRef(null);
  const [isNearBottom, setIsNearBottom] = useState(true);

  function handleScroll() {
    const el = windowRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setIsNearBottom(distanceFromBottom < NEAR_BOTTOM_THRESHOLD);
  }

  useEffect(() => {
    if (isNearBottom) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isNearBottom]);

  function handleClearHistory() {
    const confirmed = window.confirm(
      "¿Borrar todo el historial de esta conversación? Esta acción no se puede deshacer."
    );
    if (confirmed) {
      clearHistory();
    }
  }

  return (
    <section className="page page--chat">
      <div className="chat-toolbar">
        {messages.length > 0 && (
          <span className="chat-saved-indicator" title="El historial se guarda en este navegador">
            ● Conversación guardada
          </span>
        )}
        <button
          className="chat-clear-btn"
          onClick={handleClearHistory}
          disabled={messages.length === 0}
        >
          Borrar historial
        </button>
      </div>

      <div className="chat-window" ref={windowRef} onScroll={handleScroll}>
        {messages.length === 0 && (
          <p className="chat-window__empty">
            Escribile algo a Sherlock para empezar la conversación.
          </p>
        )}

        {messages.map((m) => (
          <ChatMessage key={m.id} message={m} />
        ))}

        {isTyping && <TypingIndicator />}

        {error && (
          <div className="chat-error" role="alert">
            <span>{error}</span>
            <button onClick={clearError} aria-label="Cerrar error">
              ✕
            </button>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <ChatInput onSend={sendMessage} disabled={isTyping} />
    </section>
  );
}