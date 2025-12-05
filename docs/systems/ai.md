# 🤖 AI Module

Seamless AI chat over HTTP/HTTPS — keeping your conversations with the AI smooth and alive ⚡✨

---

## 🔌 AI Endpoint

```
http://localhost:3001/ai/chat
```
```
http://localhost:3001/ai/rag
```

---

## 📁 Module Structure

| File                                           | Purpose                                         |
| ---------------------------------------------- | ----------------------------------------------- |
| **[index.ts](../src/modules/ai/index.ts)**     | HTTP/HTTPS endpoint handler                     |
| **[model.ts](../src/modules/ai/model.ts)**     | Type-safe models with Elysia validation         |
| **[service.ts](../src/modules/ai/service.ts)** | Core AI logic, message handling & response flow |

---

## ✨ Features

- 💬 **AI Chat** — Natural conversations with context-aware responses
- 🛡️ **Type-safe validation** — Runtime checks ensure data integrity

## (working)

- 🧠 **RAG Integration** — Retrieval-Augmented Generation for smarter, fact-based answers

---

## 🎮 How It Works

### Ai Flow

```
Client request → Send message to 'ai' → Receive & parse → Process with context → Return response
```

### RAG Flow

```
User input → Context building → RAG lookup (optional) → AI processing → Validation → Client delivery
```

---

## 📦 Message Model

```typescript
{
  user_message: string,              // User's message
}
```

### Response Model

```typescript
{
  response: string,            // AI's response
  timestamp: Date,            // Response timestamp
}
```

---

## 💻 Usage Example

### Frontend (Sending)

```typescript
const response = await fetch("http://localhost:3001/ai/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    user_message: "What's the best way to learn TypeScript?",
  }),
});

const data = await response.json();
console.log("AI:", data.response);
```

## 🔗 Learn More

- 📚 [Elysia Documentation](https://elysiajs.com/essential/route.html#http-verb)
- 🤖 [RAG Architecture Guide](https://medium.com/@o.anonthanasap/%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%97%E0%B8%B3%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1%E0%B9%80%E0%B8%82%E0%B9%89%E0%B8%B2%E0%B9%83%E0%B8%88-retrieval-augmented-generation-rag-%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B9%80%E0%B8%97%E0%B8%84%E0%B8%99%E0%B8%B4%E0%B8%84%E0%B8%82%E0%B8%B1%E0%B9%89%E0%B8%99%E0%B8%AA%E0%B8%B9%E0%B8%87-932d92fc4021)

---

**Pro tip:** use RAG when you need factual, grounded responses. Use conversation threading to build more natural, context-aware dialogues! 🌟💫

---
