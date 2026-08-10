import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Home from "../pages/Home";

describe("Home page", () => {
  it("muestra el botón para empezar a chatear", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(screen.getByRole("link", { name: /empezar a chatear/i })).toBeInTheDocument();
  });
});
