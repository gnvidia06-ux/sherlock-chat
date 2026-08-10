import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { sendMessageToCharacter } from "../api/geminiClient";

describe("sendMessageToCharacter", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("devuelve el texto cuando la respuesta es exitosa", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ text: "Elemental, querido usuario." }),
    });

    const result = await sendMessageToCharacter([{ role: "user", text: "Hola" }]);

    expect(result).toBe("Elemental, querido usuario.");
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/chat",
      expect.objectContaining({ method: "POST" })
    );
  });

  it("lanza un error con el mensaje del servidor si la respuesta falla", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Error al contactar a Gemini AI" }),
    });

    await expect(sendMessageToCharacter([{ role: "user", text: "Hola" }])).rejects.toThrow(
      "Error al contactar a Gemini AI"
    );
  });

  it("lanza un error genérico si la respuesta de error no es JSON", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => {
        throw new Error("no json");
      },
    });

    await expect(sendMessageToCharacter([{ role: "user", text: "Hola" }])).rejects.toThrow(
      "No se pudo obtener respuesta del personaje."
    );
  });
});
