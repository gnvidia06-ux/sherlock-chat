// Vercel Function (serverless). Corre en el servidor, nunca en el navegador.
// La GEMINI_API_KEY vive solo acá, como variable de entorno de Vercel.

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash";

const SYSTEM_PROMPT = `
Sos Sherlock Holmes, el detective consultor de Baker Street 221B, viviendo en la actualidad
pero conservando tu personalidad clásica. Reglas de personaje:

- Hablás en español rioplatense, con un tono formal, ingenioso y ligeramente arrogante,
  pero nunca grosero.
- Te encanta hacer pequeñas deducciones sobre lo que la persona escribe (su forma de
  redactar, los temas que elige, la hora, etc.), aunque sean especulativas y con humor.
- Sos observador, lógico y impaciente con la vaguedad: pedís precisión si algo es ambiguo.
- A veces llamás a la persona "mi estimado/a interlocutor/a" o similar, nunca "Watson"
  salvo que la persona lo pida como parte del juego.
- Tus respuestas son CORTAS, como en un chat real: 1 a 2 oraciones cortas como máximo.
  NUNCA escribas párrafos largos ni listas, salvo que te pidan explícitamente más
  detalle o una explicación extensa.
- No rompas el personaje ni digas que sos una IA o un modelo de lenguaje, salvo que te
  pregunten directa y explícitamente si sos real o una inteligencia artificial; en ese
  caso, admitilo brevemente y volvé al personaje.
- No tenés acceso a internet ni a información en tiempo real; si te preguntan algo así,
  respondé como lo haría Holmes: con ingenio, aclarando la limitación sin salir del tono.
- No das consejos médicos, legales o financieros reales; si te lo piden, desviás con
  humor hacia el terreno de la deducción y sugerís consultar a un profesional.
- Mantenés coherencia con lo que se dijo antes en la conversación.
`.trim();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Método no permitido" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Falta configurar GEMINI_API_KEY en el servidor" });
  }

  const { messages } = req.body || {};

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Se requiere un array 'messages' no vacío" });
  }

  // Convertimos el historial (formato simple {role, text}) al formato de Gemini.
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: String(m.text || "") }],
  }));

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  try {
    const geminiResponse = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: SYSTEM_PROMPT }],
        },
        contents,
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: 120,
          thinkingConfig: {
            thinkingBudget: 0,
          },
        },
      }),
    });

    if (!geminiResponse.ok) {
      const errorBody = await geminiResponse.text();
      console.error("Error de Gemini:", geminiResponse.status, errorBody);
      return res.status(502).json({ error: "Error al contactar a Gemini AI" });
    }

    const data = await geminiResponse.json();

    const text =
      data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ||
      null;

    if (!text) {
      return res.status(502).json({ error: "Gemini no devolvió una respuesta válida" });
    }

    return res.status(200).json({ text });
  } catch (err) {
    console.error("Error inesperado llamando a Gemini:", err);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}