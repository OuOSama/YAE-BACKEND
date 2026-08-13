<div align="center">

# 🌸 YAE Backend

**Next-gen VTuber AI character platform and orchestrator for everything and anything in YAE Ecosystem seamlessly**

*powered by Bun & Elysia.js*

[![TypeScript](https://img.shields.io/badge/TypeScript-7.x-blue?style=flat-square)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Bun-latest-000?style=flat-square)](https://bun.sh)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

</div>

---

## 🎯 Features

| Feature | Description |
|---------|-------------|
| 🧬 **Type-Safe** | Full TypeScript + Drizzle ORM inference |
| 📚 **Auto-Docs** | OpenAPI 3.0 auto-generated |

---

## 🏃 Quick Start

```bash
# 1️⃣  Install & configure
bun install && cp .env.example .env

# 2️⃣  Database setup
bun run db:migrate

# 3️⃣  Run development server
bun run dev
```

🎉 Server running at `http://localhost:3001`

---

## 🎮 Commands

| Command | Purpose |
|---------|---------|
| `bun run dev` | 🔥 Development (hot-reload) |
| `bun run start` | ⚙️ Production mode |
| `bun test` | 🧪 Run tests with coverage |
| `bun check` | ✨ Format & lint |
| `bun run db:gen` | 🗄️ Generate migration |
| `bun run db:migrate` | 🗄️ Apply migrations |

---

## 🏛️ Architecture

**Modular Monolith** → 3 independent modules:

```
📦 src/
 ├─ 📡 modules/broadcast/ → WebSocket pub/sub
 ├─ 🗄️  database/         → Drizzle ORM schemas
 └─ 🛡️  lib/auth.ts         → Auth utilities
```

**Each module:**
- `index.ts` — Routes & handlers
- `model.ts` — TypeBox validation schemas  
- `service.ts` — Business logic

### Endpoints

| Module | Endpoints |
|--------|-----------|
coming soon

---

## 🛠️ Tech Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Runtime | **Bun** | latest | Fast TypeScript execution & testing |
| Framework | **Elysia.js** | latest | Type-safe HTTP framework with macros |
| Database | **PostgreSQL** | 14+ | Reliable persistent data storage |
| ORM | **Drizzle** | 0.45.1 | Type-safe queries with inference |
| Auth | **better-auth** | 1.4.10 | OAuth + session management |
| Validation | **TypeBox** | - | Runtime schema validation |
| Linter | **Biome** | 2.3.11 | Format & lint automation |

---

## 🔧 Environment Setup

```env
# .env
DATABASE_URL=postgres://user:pass@localhost:5432/yae_db
SERVICE_JWT_SECRET=your-jwt-secret
SERVICE_BOT_TOKEN=your-service-key
OPENAI_API_KEY=http://localhost:8000/v1
```

---

## 🧪 Testing

```bash
bun test          # All tests + coverage
bun test:prod     # Production environment
```

📍 Tests located in `__test__/**/*.test.ts`

---

## ⚡ Pro Tips

| ⚠️ | Details |
|----|---------|
| **vLLM** | OpenAI-compatible endpoint (not official API) |
| **CORS** | Hardcoded to `localhost:3000` → use env var for prod |
| **Broadcast** | In-memory only → use Redis for production |

---

## 📚 Learn More

| Resource | Link |
|----------|------|
| **Development** | [AGENTS.md](AGENTS.md) — Patterns & conventions |
| **Architecture** | [docs/systems/](docs/systems/) — Deep-dives |
| **Framework** | [Elysia Docs](https://elysiajs.com) |
| **Database** | [Drizzle Docs](https://orm.drizzle.team) |
| **Auth** | [better-auth](https://www.better-auth.com) |

---

## ✅ Pre-Commit Checklist

```bash
bun check    # ✨ Format & lint
bun test     # 🧪 Run tests
```

Husky enforces automatically on commit.

---

<div align="center">

### 🚀 Ready to build something amazing?

Start with `bun run dev` and dive into [AGENTS.md](AGENTS.md)

**MIT License** 

</div>
