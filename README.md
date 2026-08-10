# Chat con Sherlock Holmes (Gemini AI)

SPA en React que permite chatear con Sherlock Holmes, usando Google Gemini AI a
través de una Vercel Function (así la API key nunca se expone en el cliente).

## Rutas

- `/home` — presentación del personaje
- `/chat` — el chat en sí
- `/about` — info del proyecto

## 1. Correr el proyecto en local

```bash
npm install
```

Copiá `.env.example` a `.env` y completá tu API key (ver paso 2):

```bash
cp .env.example .env
```

Para desarrollo local, `vite` solo sirve el frontend — **no** ejecuta las
funciones serverless de `/api`. Para probar el chat completo en tu máquina
necesitás la CLI de Vercel (ver paso 4, `vercel dev`). Si solo querés ver el
diseño de las páginas sin el chat funcionando, alcanza con:

```bash
npm run dev
```

## 2. Conseguir tu Gemini API Key (gratis)

1. Entrá a **https://aistudio.google.com/apikey** con tu cuenta de Google.
2. Hacé clic en **"Create API key"** (o "Crear clave de API").
3. Elegí un proyecto de Google Cloud existente o dejá que te cree uno nuevo.
4. Copiá la key generada (empieza con algo como `AIza...`). **No la compartas
   ni la subas a GitHub.**
5. El plan gratuito de Gemini tiene límites de uso por minuto/día — de sobra
   para este proyecto.

## 3. Configurar la key en local

En tu archivo `.env` (que ya está en `.gitignore`, nunca se sube):

```
GEMINI_API_KEY=tu_api_key_copiada
GEMINI_MODEL=gemini-3.5-flash
```

`GEMINI_MODEL` es opcional — si no lo ponés, se usa `gemini-3.5-flash` por
defecto. Revisá en https://ai.google.dev/gemini-api/docs/models cuál es el
modelo vigente al momento en que lo despliegues, porque Google va
discontinuando versiones viejas cada tanto.

## 4. Probar las funciones serverless en local (opcional pero recomendado)

```bash
npm install -g vercel
vercel dev
```

La primera vez te va a pedir loguearte y "linkear" el proyecto (podés crear
uno nuevo o usar uno existente). Con `vercel dev` corriendo, `/api/chat` va a
funcionar igual que en producción, así podés probar el chat completo antes de
desplegar.

## 5. Desplegar en Vercel

### Opción A — desde la web (más simple)

1. Subí este proyecto a un repositorio de GitHub.
2. Entrá a **https://vercel.com**, iniciá sesión (podés usar tu cuenta de
   GitHub) y hacé clic en **"Add New... > Project"**.
3. Elegí el repo. Vercel detecta automáticamente que es un proyecto Vite/React.
4. Antes de desplegar, andá a **"Environment Variables"** y agregá:
   - `GEMINI_API_KEY` → tu key de Gemini
   - `GEMINI_MODEL` → (opcional) el modelo que quieras usar
5. Hacé clic en **"Deploy"**.

### Opción B — desde la terminal

```bash
npm install -g vercel
vercel login
vercel
```

Seguí las preguntas (nombre de proyecto, framework detectado = Vite). Después
de crear el proyecto, configurá las variables de entorno:

```bash
vercel env add GEMINI_API_KEY
vercel env add GEMINI_MODEL
```

Y desplegá a producción:

```bash
vercel --prod
```

### Verificar que el deploy funciona

1. Abrí la URL que te da Vercel.
2. Andá a `/chat` y mandá un mensaje.
3. Si ves un error, revisá en el dashboard de Vercel: **Project → Deployments
   → (tu deploy) → Functions → api/chat** para ver los logs y el motivo del
   error (normalmente: falta la env var, o el nombre del modelo está mal).

## 6. Tests

```bash
npm test
```

Corre los tests unitarios con Vitest + React Testing Library (componentes,
routing y el cliente que llama a `/api/chat`).

## Notas de seguridad

- La `GEMINI_API_KEY` solo existe como variable de entorno del servidor
  (Vercel Function en `api/chat.js`). El navegador nunca la recibe.
- El historial de chat vive únicamente en memoria de React durante la sesión:
  se pierde al recargar la página (a propósito, según el alcance del
  proyecto).
