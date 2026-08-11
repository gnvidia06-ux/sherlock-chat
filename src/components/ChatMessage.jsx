import { useState } from "react";

function formatTime(isoString) {
  try {
    return new Date(isoString).toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export default function ChatMessage({ message }) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(message.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Si el navegador no permite copiar, no hacemos nada más.
    }
  }

  return (
    <div
      className={`chat-message ${isUser ? "chat-message--user" : "chat-message--assistant"}`}
      data-testid="chat-message"
    >
      <div className="chat-message__bubble">
        <p className="chat-message__text">{message.text}</p>
        <div className="chat-message__footer">
          {!isUser && (
            <button
              className="chat-message__copy"
              onClick={handleCopy}
              aria-label="Copiar mensaje"
              title="Copiar mensaje"
            >
              {copied ? "Copiado ✓" : "Copiar"}
            </button>
          )}
          <span className="chat-message__time">{formatTime(message.timestamp)}</span>
        </div>
      </div>
    </div>
  );
}