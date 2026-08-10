/**
 * Llama a nuestra propia Vercel Function (/api/chat), que a su vez habla con
 * Gemini de forma segura en el servidor. El navegador nunca ve la API key.
 *
 * @param {Array<{role: 'user'|'assistant', text: string}>} messages
 * @returns {Promise<string>} el texto de respuesta del personaje
 */
export async function sendMessageToCharacter(messages) {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    let errorMessage = "No se pudo obtener respuesta del personaje.";
    try {
      const data = await response.json();
      if (data?.error) errorMessage = data.error;
    } catch {
      // el body no era JSON, usamos el mensaje genérico
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();
  return data.text;
}
