import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="page page--home">
      <h1>Sherlock Holmes</h1>
      <p className="page__subtitle">Detective consultor · Baker Street 221B</p>

      <p>
        Sherlock Holmes es el detective más célebre de la literatura: observador
        implacable, maestro de la deducción e impaciente con lo obvio. En este chat,
        potenciado por Google Gemini AI, podés conversar con él, plantearle un misterio
        cotidiano o simplemente ponerlo a prueba con tus preguntas.
      </p>

      <ul className="home-traits">
        <li>🔍 Deduce cosas sobre vos a partir de cómo escribís</li>
        <li>🎩 Tono formal, ingenioso y un poco arrogante</li>
        <li>💬 Respuestas cortas, pensadas para el chat</li>
      </ul>

      <Link to="/chat" className="btn btn--primary">
        Empezar a chatear
      </Link>
    </section>
  );
}
