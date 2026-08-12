# Chat con Sherlock Holmes 🕵️

Este es mi TP de SPA: una app en React donde podés chatear con Sherlock Holmes,
potenciado por Google Gemini AI. La idea era practicar routing, conexión segura
a una IA externa (sin exponer la key en el cliente) y deploy en Vercel.

Elegí a Sherlock porque tiene una personalidad bien marcada y eso ayuda mucho
a la hora de armar un buen system prompt: deductivo, un poco arrogante, con
tono formal pero con humor.

👉 **Probalo en vivo:** https://sherlock-chat-iota.vercel.app

## Qué tiene

- Rutas: `/home`, `/chat`, `/about` (con React Router, back/forward andan bien)
- Chat con Sherlock: burbujas diferenciadas, "está escribiendo...", manejo de
  errores si falla la API, scroll automático (pero inteligente: si scrolleás
  para arriba a leer algo viejo, no te empuja de nuevo abajo)
- El historial se guarda en el navegador (localStorage), así que si recargás
  la página no perdés la conversación. Hay un botón para borrarlo si querés
  empezar de cero, con confirmación antes de borrar
- Botón para copiar las respuestas de Sherlock
- Enter para enviar, además del botón
- Timestamps en cada mensaje
- Diseño responsive, mobile-first (probado en mobile / tablet / desktop)
- La API key de Gemini nunca toca el navegador: todo pasa por una Vercel
  Function (`api/chat.js`) que corre en el servidor
- 11 tests unitarios con Vitest + Testing Library

## Cómo correrlo en tu máquina

```bash
npm install
cp .env.example .env
```

Completá tu `.env` con tu propia API key de Gemini (ver más abajo cómo
conseguirla).

Para ver solo el diseño de las páginas, alcanza con:

```bash
npm run dev
```

Pero como el chat necesita la función serverless (`/api/chat`), y `vite` solo
no la corre, para probar el chat completo en local hace falta la CLI de
Vercel:

```bash
npm install -g vercel
vercel dev
```

Y ahí sí, `http://localhost:3000/chat` funciona igual que en producción.

## Conseguir tu propia API key de Gemini (gratis)

1. Entrá a https://aistudio.google.com/apikey con tu cuenta de Google
2. "Create API key"
3. Copiá la key y pegala en tu `.env`:
GEMINI_API_KEY=tu_key_aca
GEMINI_MODEL=gemini-3.5-flash
Un par de cosas que aprendí en el camino, por si a alguien más le pasa:
- El nivel gratuito tiene un límite bajo de pedidos por día (20 para este
  modelo). Si ves un error 429 en los logs, es por eso, no es un bug.
- A veces Google devuelve un formato de key distinto al `AIzaSy...` de
  siempre. Si te tira "API key not valid" aunque la key sea correcta, probá
  mandarla como parámetro `?key=` en la URL en vez de como header
  `x-goog-api-key` — a mí me lo solucionó.

## Deploy en Vercel

1. Subí el repo a GitHub
2. En vercel.com, "Add New > Project" y importá el repo (detecta Vite solo)
3. Antes de deployar, cargá las Environment Variables: `GEMINI_API_KEY` y
   `GEMINI_MODEL`
4. Deploy

Si cambiás alguna variable de entorno después, hay que hacer un Redeploy
manual para que el cambio se aplique — no pasa solo.

## Tests

```bash
npm test
```

Corre los tests de componentes, routing y del cliente que llama a
`/api/chat`.

## Stack

React + Vite, React Router, Vercel Functions, Vitest + React Testing
Library, CSS puro (mobile-first, con media queries en 600px y 1024px).