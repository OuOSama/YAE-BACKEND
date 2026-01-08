// src/app.ts

import openapi from '@elysiajs/openapi'
import { Elysia } from 'elysia'

// lib
import { security } from './lib/auth'

// modules
import { ai } from './modules/ai'
import { authRoute } from './modules/auth'
import { broadcast } from './modules/broadcast'

const app = new Elysia()

	// --- 🌍 Public Zone ---
	.use(authRoute)
	.use(openapi())
	.get('/', () => ({ message: '⚡ Hello YAE-BACKEND!' }))

	// --- 🛡️ Private Zone (Protected) ---
	.use(security)
	.group('/api', { isAuth: true }, (app) =>
		app
			.use(ai)
			.use(broadcast)
			.get('/test-auth', () => 'hi this is auth'),
	)

app.listen(process.env.PORT ?? 3000)
console.log(`🦊 http://${app.server?.hostname}:${app.server?.port}`)

// TODO: for Eden in future
// REPO: https://github.com/elysiajs/eden
export type App = typeof app
