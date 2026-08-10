import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import App from "../App";

function renderWithRouter(initialRoute = "/home") {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <App />
    </MemoryRouter>
  );
}

describe("App routing", () => {
  it("redirige la raíz a /home y muestra la página de inicio", () => {
    renderWithRouter("/");
    expect(screen.getByRole("heading", { name: /sherlock holmes/i })).toBeInTheDocument();
  });

  it("muestra la página About en /about", () => {
    renderWithRouter("/about");
    expect(screen.getByRole("heading", { name: /acerca del proyecto/i })).toBeInTheDocument();
  });

  it("navega a /chat al hacer click en el link del header", async () => {
    const user = userEvent.setup();
    renderWithRouter("/home");

    await user.click(screen.getByRole("link", { name: "Chat" }));

    expect(
      screen.getByPlaceholderText(/escribile algo a sherlock/i)
    ).toBeInTheDocument();
  });

  it("redirige rutas desconocidas a /home", () => {
    renderWithRouter("/ruta-que-no-existe");
    expect(screen.getByRole("heading", { name: /sherlock holmes/i })).toBeInTheDocument();
  });
});
