# AGENTS.md

This repository is a Bun + Elysia backend for the YAE VTuber platform.

## What to know first

- Use Bun for dev, tests, and DB tooling.
- The app entrypoint is `src/app.ts`; the cluster wrapper is `src/index.ts`.
- The main runtime structure is modular:
  - `src/modules/ai/` for chat/RAG endpoints
  - `src/modules/auth/` for auth route mounting
  - `src/modules/broadcast/` for WebSocket status updates
  - `src/lib/auth/` for JWT, scopes, and auth helpers
  - `src/database/` for Drizzle schema and client setup

## Commands

Use these as the default verification flow:

- `bun install`
- `bun run dev` for local development
- `bun test` for the current test suite
- `bun check` for Biome formatting/linting
- `bun run db:migrate` to apply migrations
- `bun run db:gen` to create a new migration

## Project conventions

- Keep feature work inside the existing module folders instead of creating new top-level patterns.
- Follow the current Elysia layout:
  - `index.ts` for routes/handlers
  - `model.ts` for TypeBox validation
  - `service.ts` for business logic
- Prefer existing auth helpers in `src/lib/auth/` rather than duplicating permission logic.
- Keep environment variables aligned with `.env.example`; the AI and auth paths depend on `SERVICE_JWT_SECRET`, `SERVICE_BOT_TOKEN`, `VLLM_LLM_URL`, and `VLLM_LLM_KEY`.

## Available skills

The repository currently includes these reusable skills under `.agents/skills/`:

- `better-auth-best-practices` — Better Auth server/client setup, adapters, sessions, and plugin wiring.
- `better-auth-security-best-practices` — Auth hardening, rate limiting, secrets, CSRF, trusted origins, and session protection.
- `create-auth-skill` — Scaffold and implement authentication flows with Better Auth.
- `elysiajs` — ElysiaJS backend patterns and type-safe route setup.
- `email-and-password-best-practices` — Email/password auth, verification, reset flows, and password policy guidance.
- `organization-best-practices` — Organizations, members, roles, teams, and RBAC with Better Auth.
- `two-factor-authentication-best-practices` — MFA/TOTP/OTP setup and secure login flows.

Use these skills when you need to extend or harden auth, routing, or backend conventions in this repo.

## Important pitfalls

- The current test suite is not fully green in this checkout: `bun test` currently fails because the tests import `src/...` paths while the repo’s TypeScript path mapping only resolves `@/*` and `~/*`.
- The AI module uses an OpenAI-compatible vLLM endpoint; do not assume the official OpenAI API is available.
- The auth flow uses both Better Auth user sessions and JWT-based service tokens with scope checks.

## Reference docs

- `README.md` for quick start and command overview
- `docs/systems/ai.md` for AI module details
- `docs/systems/authentication.md` for auth and scope behavior
- `docs/systems/broadcast.md` for WebSocket status updates
