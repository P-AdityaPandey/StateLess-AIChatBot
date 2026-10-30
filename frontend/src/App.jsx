import { useEffect, useRef, useState } from "react";
import {
  Bot, Plus, Send, Sparkles, PanelLeftClose, PanelLeftOpen,
  CircleStop, ShieldCheck
} from "lucide-react";
import { sendMessage } from "./api";

const starterPrompts = [
  {
    title: "Explain a concept",
    text: "Explain Spring Boot dependency injection in simple words with a small example."
  },
  {
    title: "Write some code",
    text: "Show me a clean Java 21 example of using records and explain when to use them."
  },
  {
    title: "Plan a project",
    text: "Help me break an AI chatbot project into small development milestones."
  }
];

function makeId() {
  return globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`;
}

export default function App() {
  // Messages exist only in this browser tab's React state.
  // Only the current message is sent to the backend; no session or history API is used.
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);

  function newConversation() {
    setMessages([]);
    setInput("");
    setError("");
    inputRef.current?.focus();
  }

  async function submit(text = input) {
    const content = text.trim();
    if (!content || busy) return;

    setInput("");
    setError("");
    setMessages((current) => [
      ...current,
      { id: makeId(), role: "USER", content }
    ]);
    setBusy(true);

    try {
      // Backend contract: POST /api/chat with { "message": "..." }
      // Expected response: { "response": "..." }
      const result = await sendMessage({ message: content });

      if (!result || typeof result.response !== "string") {
        throw new Error(
          "Unexpected backend response. Expected JSON containing a 'response' field."
        );
      }

      setMessages((current) => [
        ...current,
        { id: makeId(), role: "ASSISTANT", content: result.response }
      ]);
    } catch (err) {
      const serverMessage =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message;

      setError(
        `${serverMessage || "The request failed."} Check that Spring Boot is running at the configured API URL and that Gemini is configured on the backend.`
      );
      // Keep the user's message visible and restore it for an easy retry.
      setInput(content);
    } finally {
      setBusy(false);
      inputRef.current?.focus();
    }
  }

  function onKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  }

  return (
    <div className={`app-shell ${sidebarOpen ? "" : "sidebar-collapsed"}`}>
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><Sparkles size={19} /></div>
          <span>nova<span className="brand-light">.ai</span></span>
          <button
            className="icon-btn collapse-btn"
            title="Collapse sidebar"
            onClick={() => setSidebarOpen(false)}
          >
            <PanelLeftClose size={18} />
          </button>
        </div>

        <button className="new-chat" onClick={newConversation}>
          <Plus size={17} /> New chat
        </button>

        <div className="side-label">CHAT MODE</div>
        <div className="session-list">
          <div className="session-item selected">
            <Bot size={16} />
            <span>Direct Gemini chat</span>
          </div>
          <p className="empty-sessions">
            No account, sessions, or server-side conversation history.
          </p>
        </div>

        <div className="sidebar-bottom">
          <div className="profile-avatar"><ShieldCheck size={16} /></div>
          <div className="profile-text">
            <strong>Stateless mode</strong>
            <span>Current prompt only</span>
          </div>
          <span className="online-dot" />
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div className="topbar-left">
            {!sidebarOpen && (
              <button
                className="icon-btn"
                onClick={() => setSidebarOpen(true)}
                title="Open sidebar"
              >
                <PanelLeftOpen size={19} />
              </button>
            )}
            <div className="model-select-wrap">
              <span className="model-status" />
              <span className="fixed-model-label">Google Gemini</span>
            </div>
            <span className="topbar-divider">/</span>
            <span className="current-chat-title">New conversation</span>
          </div>
          <div className="topbar-right">
            <span className="secure-label">
              <span className="secure-dot" /> Direct API mode
            </span>
          </div>
        </header>

        <section className="chat-scroll">
          {messages.length === 0 ? (
            <div className="welcome">
              <div className="welcome-icon"><Sparkles size={25} /></div>
              <div className="eyebrow">YOUR AI WORKSPACE</div>
              <h1>What can I help you<br /><span>figure out today?</span></h1>
              <p className="welcome-subtitle">
                Ask a question and get a response from your Spring Boot + Gemini backend.
              </p>
              <div className="prompt-grid">
                {starterPrompts.map((prompt, index) => (
                  <button
                    key={prompt.title}
                    className="prompt-card"
                    onClick={() => submit(prompt.text)}
                    disabled={busy}
                  >
                    <span className={`prompt-icon prompt-icon-${index}`}>
                      {index === 0 ? "✳" : index === 1 ? "⌘" : "↗"}
                    </span>
                    <strong>{prompt.title}</strong>
                    <span>{prompt.text}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="message-list">
              {messages.map((message) => (
                <article
                  key={message.id}
                  className={`message-row ${message.role === "USER" ? "user-row" : "assistant-row"}`}
                >
                  <div className={`message-avatar ${message.role === "USER" ? "user-avatar" : ""}`}>
                    {message.role === "USER" ? "A" : <Bot size={18} />}
                  </div>
                  <div className="message-body">
                    <div className="message-meta">
                      <strong>{message.role === "USER" ? "You" : "Nova"}</strong>
                      <span>{message.role === "USER" ? "You asked" : "Google Gemini"}</span>
                    </div>
                    <div className="message-content">{message.content}</div>
                  </div>
                </article>
              ))}

              {busy && (
                <div className="message-row assistant-row">
                  <div className="message-avatar"><Bot size={18} /></div>
                  <div className="message-body">
                    <div className="message-meta">
                      <strong>Nova</strong><span>Thinking</span>
                    </div>
                    <div className="typing"><i /><i /><i /></div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}
        </section>

        <footer className="composer-area">
          {error && <div className="error-banner" role="alert">{error}</div>}
          <div className="composer">
            <textarea
              ref={inputRef}
              rows="1"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Message Nova..."
              disabled={busy}
              aria-label="Message Nova"
            />
            <div className="composer-bottom">
              <div className="composer-hint">
                <span className="kbd">↵</span> to send
                <span className="hint-separator">·</span>
                <span className="kbd">Shift + ↵</span> for new line
              </div>
              <button
                className="send-btn"
                disabled={!input.trim() || busy}
                onClick={() => submit()}
                title="Send message"
              >
                {busy ? <CircleStop size={17} /> : <Send size={17} />}
                <span>Send</span>
              </button>
            </div>
          </div>
          <p className="disclaimer">
            AI can make mistakes. Only the current prompt is sent; the AI does not retain chat context.
          </p>
        </footer>
      </main>
    </div>
  );
}
