# Spring Boot AI Chatbot Backend

A stateless REST API using Spring Boot, Spring AI and Google Gemini. It has no database, no session, and no conversation history.

## Requirements

- Java 21
- Maven 3.9+
- A Gemini API key

## Frontend connection

The API is configured for the React + Vite frontend at `http://localhost:5173`.

Global CORS configuration is in:

`src/main/java/com/example/aichatbot/config/CorsConfig.java`

It allows these development origins:

- `http://localhost:5173`
- `http://127.0.0.1:5173`

If your frontend runs on a different origin or port, add that exact origin to `allowedOrigins`.

## Configure Gemini API key (Windows PowerShell)

Set the key for the current terminal:

```powershell
$env:GEMINI_API_KEY="YOUR_REAL_GEMINI_API_KEY"
```

Then start the backend in the same terminal:

```powershell
mvn spring-boot:run
```

For a permanent Windows environment variable, use Windows Environment Variables settings or:

```powershell
[Environment]::SetEnvironmentVariable("GEMINI_API_KEY", "YOUR_REAL_GEMINI_API_KEY", "User")
```

Open a new terminal after setting a permanent variable. Never commit the real key to Git.

## Run

From the project root:

```bash
mvn clean spring-boot:run
```

Backend base URL:

`http://localhost:8080`

## API

### POST `/api/chat`

Request:

```json
{
  "message": "Explain Java Stream API"
}
```

Response:

```json
{
  "response": "The Java Stream API..."
}
```

The request contains only the current message. Each call is independent; no conversation memory is retained.

## Test with PowerShell

```powershell
Invoke-RestMethod `
  -Uri "http://localhost:8080/api/chat" `
  -Method Post `
  -ContentType "application/json" `
  -Body '{"message":"Explain dependency injection in Spring"}'
```

## Connect the React frontend

The supplied frontend expects:

- Backend URL: `http://localhost:8080`
- Endpoint: `POST /api/chat`
- Request JSON field: `message`
- Response JSON field: `response`

Start the backend first, then start the frontend using `npm install` and `npm run dev`.

## Notes

- No JPA, JDBC, MySQL, PostgreSQL, repository, entity, session, or chat-memory dependency is included.
- The Gemini model name is configured in `application.properties`.
- If you change the model or Spring AI version, verify compatibility with the selected Google GenAI integration.
