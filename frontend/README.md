# Nova AI — Stateless React Frontend

This frontend is adapted from the uploaded Nova AI UI and connects to the stateless Spring Boot + Gemini backend.

## Backend contract

`POST http://localhost:8080/api/chat`

Request:
```json
{
  "message": "Explain Spring Boot"
}
```

Response:
```json
{
  "response": "Spring Boot is..."
}
```

The frontend sends only the current message. It does not call session, history, or delete-session endpoints. The displayed messages are held temporarily in React state so the current page looks and behaves like a chat; they are not sent back as context, saved to a database, or restored after refresh. Gemini therefore treats every prompt independently.

## Run

Requirements: Node.js 20+ (Node.js 22 LTS recommended).

```bash
npm install
```

Optional: copy `.env.example` to `.env` and adjust the backend base URL:
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

Then:
```bash
npm run dev
```

Open `http://localhost:5173`.

## CORS

The Spring Boot backend must allow this frontend origin:
`http://localhost:5173`

Configure CORS in the backend, not in the browser frontend.

## Troubleshooting

- `ERR_CONNECTION_REFUSED`: start the Spring Boot backend and confirm port 8080.
- `404`: backend mapping should be `@RequestMapping("/api/chat")` and `@PostMapping`.
- CORS error: allow `http://localhost:5173` in the backend CORS configuration.
- Gemini/API error: check the backend logs and `GEMINI_API_KEY` environment variable.
- Response parsing error: backend should return JSON with a string property named `response`.

Do not put the Gemini API key in this frontend. Keep it in the backend environment.
