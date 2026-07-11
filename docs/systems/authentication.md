# 🔒 Authentication System

*Secure, type-safe auth layer with M2M flows, OAuth, and scope-based access control.*

---

## 🚀 Quick Start

**Get Access Token:** 
```
GET http://localhost:3001/get-access
```
---

## 📁 Module Structure

| File | Purpose |
| :--- | :--- |
| **[index.ts](../../src/modules/auth/index.ts)** | 🚦 HTTP/HTTPS endpoint handler |
| **[model.ts](../../src/modules/auth/model.ts)** | 🛡️ Type-safe models with Elysia validation |
| **[security.ts](../../src/lib/auth/security.ts)** | 🛡️ JWT & session verification middleware |
| **[serviceAuth.ts](../../src/lib/auth/serviceAuth.ts)** | 🤖 Service-to-service token flow |
| **[userAuth.ts](../../src/lib/auth/userAuth.ts)** | 👥 Better Auth + Drizzle + OAuth config |

---

## ✨ Features

- 🤖 **M2M Auth** — JWT-based service-to-service flows
- 🛡️ **Type-Safe** — Full TypeScript + Elysia validation
- 🔑 **Smart Scopes** — Route-level permission control
- 👥 **Unified Identity** — OAuth (Discord) + credentials support

---

## 🎮 How It Works

### 👤 User Flow
```
Client Login → OAuth Provider → Backend Auth → Set Session → Return User Data
```

### 🤖 Service Flow
```
Service → Request with Token → Generate JWT → Bearer Auth → Protected Endpoint
```

---

## 📦 API Models

### Get Token
**Request:**
```typescript
headers: { "x-service-key": string }
```

**Response:**
```typescript
{
  "access_token": string,
}
```

---

## 💻 Usage

### Service Auth
```typescript
// Get token
const res = await fetch("http://localhost:3001/get-access", {
  headers: { "x-service-key": process.env.SERVICE_KEY }
});
const { access_token } = await res.json();

// Use token
await fetch("http://localhost:3001/api/service", {
  headers: { "Authorization": `Bearer ${access_token}` }
});
```

## 🛠️ Config

```bash
# OAuth
DISCORD_CLIENT_ID     = your_id
DISCORD_CLIENT_SECRET = your_secret

# JWT
using `bun run key:add <SERVICE_JWT_SECRET> <value>` 

# Service
using `bun run key:add <SERVICE_BOT_TOKEN> <value>` 

# DB
DATABASE_URL          = postgresql://user:pass@localhost:5432/db
```

---

## 🎯 Best Practices

- Use `requireScope` for access control
- Rotate service keys regularly
- Always use HTTPS in production
- Implement rate limiting on auth endpoints

---

## 🔗 Resources

- [Elysia Docs](https://elysiajs.com)
- [Better Auth](https://www.better-auth.com)
- [Elysia Macros](https://elysiajs.com/patterns/macro)

---

**💫 Pro tip:** Mix user sessions with service tokens, layer scopes for granular control, and extend with custom providers as you scale