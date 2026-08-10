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

  return (
    <div
      className={`chat-message ${isUser ? "chat-message--user" : "chat-message--assistant"}`}
      data-testid="chat-message"
    >
      <div className="chat-message__bubble">
        <p className="chat-message__text">{message.text}</p>
        <span className="chat-message__time">{formatTime(message.timestamp)}</span>
      </div>
    </div>
  );
}
