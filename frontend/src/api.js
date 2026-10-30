import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
  timeout: 120000,
  headers: { "Content-Type": "application/json" }
});

// Stateless backend contract:
// POST http://localhost:8080/api/chat
// Request:  { "message": "..." }
// Response: { "response": "..." }
export async function sendMessage(message) {
  const { data } = await api.post("/chat", message);
  return data;
}

export default api;
