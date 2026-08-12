export default function About() {
  return (
    <section className="page page--about">
      <h1>Acerca del proyecto</h1>
      <p>
        Esta es una Single Page Application construida con React y React Router, que
        permite chatear con un personaje ficticio impulsado por Google Gemini AI. Las
        llamadas al modelo se hacen desde una Vercel Function, así la API key nunca
        queda expuesta en el código del cliente.
      </p>

      <h2>El personaje</h2>
      <p>
        Elegí a Sherlock Holmes por su personalidad fuerte y reconocible: la lógica
        deductiva y el tono particular se prestan muy bien para definir un system
        prompt claro y para generar respuestas breves y con carácter, ideales para un
        chat.
      </p>

      <h2>Stack técnico</h2>
      <ul>
        <li>React + Vite</li>
        <li>React Router (routing en el cliente, con History API)</li>
        <li>Vercel Functions (serverless) para conectar con Gemini AI</li>
        <li>Vitest + React Testing Library para tests unitarios</li>
        <li>CSS mobile-first con media queries</li>
      </ul>

      <h2>Notas</h2>
      <p>
        El historial de la conversación se guarda en el navegador (localStorage), así que
  persiste aunque recargues la página. Hay un botón para borrarlo cuando quieras
  empezar de cero.
      </p>
    </section>
  );
}
