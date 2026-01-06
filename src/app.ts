// src/app.ts

import openapi from '@elysiajs/openapi'
import { Elysia } from 'elysia'

// lib
import { authGuard } from './lib/auth'

// modules
import { ai } from './modules/ai'
import { auth } from './modules/auth'
import { broadcast } from './modules/broadcast'

const app = new Elysia()

	// --- 🌍 Public Zone ---
	.use(auth)
	.use(openapi())
	.get('/', () => ({ message: '⚡ Hello YAE-BACKEND!' }))

	// --- 🛡️ Private Zone (Protected) ---
	.group('/api', (app) =>
		app
			.use(authGuard)
			.use(ai)
			.use(broadcast)
			.get('/test-auth', () => 'hi this is auth'),
	)

app.listen(process.env.PORT ?? 3000)
console.log(`🦊 http://${app.server?.hostname}:${app.server?.port}`)

// TODO: for Eden in future
// REPO: https://github.com/elysiajs/eden
export type App = typeof app
