import { useEffect, useRef } from "react";
import { useChat } from "../context/ChatContext";
import ChatMessage from "../components/ChatMessage";
import TypingIndicator from "../components/TypingIndicator";
import ChatInput from "../components/ChatInput";

export default function Chat() {
  const { messages, isTyping, error, sendMessage, clearError } = useChat();
  const bottomRef = useRef(null);

  // Scroll automático al último mensaje (o al indicador de "escribiendo...")
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <section className="page page--chat">
      <div className="chat-window">
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
