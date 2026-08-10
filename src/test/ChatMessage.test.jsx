import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ChatMessage from "../components/ChatMessage";

describe("ChatMessage", () => {
  it("renderiza el texto del mensaje", () => {
    render(
      <ChatMessage
        message={{
          id: 1,
          role: "user",
          text: "Hola Sherlock",
          timestamp: new Date().toISOString(),
        }}
      />
    );
    expect(screen.getByText("Hola Sherlock")).toBeInTheDocument();
  });

  it("aplica la clase de usuario cuando role es 'user'", () => {
    render(
      <ChatMessage
        message={{ id: 1, role: "user", text: "Hola", timestamp: new Date().toISOString() }}
      />
    );
    const bubble = screen.getByTestId("chat-message");
    expect(bubble).toHaveClass("chat-message--user");
  });

  it("aplica la clase de asistente cuando role es 'assistant'", () => {
    render(
      <ChatMessage
        message={{ id: 2, role: "assistant", text: "Elemental", timestamp: new Date().toISOString() }}
      />
    );
    const bubble = screen.getByTestId("chat-message");
    expect(bubble).toHaveClass("chat-message--assistant");
  });
});
