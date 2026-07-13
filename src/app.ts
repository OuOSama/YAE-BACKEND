// src/app.ts

import { Elysia } from 'elysia'
import { rateLimit } from 'elysia-rate-limit'

// lib
import { security } from './lib/auth'

// modules
import { ai } from './modules/ai'
import { authRoute } from './modules/auth'
import { broadcast } from './modules/broadcast'

// utils
import { openapiPlugin } from './utils/openapi'

// 🔐 Private API
const privateApi = new Elysia({ name: 'yae-private' })
	.use(security) // โหลดระบบ Auth ให้พร้อม
	.group('/api', (app) =>
		app.guard({ isAuth: true }, (safeApp) =>
			safeApp
				.use(ai)
				.use(broadcast)
				.get('/test-auth', () => 'hi this is auth'),
		),
	)
// 🌍 Public API
const publicApi = new Elysia({ name: 'yae-public' })
	.get('/', () => ({ message: '⚡ Hello YAE-BACKEND!' }))
	.get('/health', () => ({
		status: 'ok',
		timestamp: new Date().toISOString(),
	}))

export const createApp = () =>
	new Elysia({ name: 'yae-app' })
		.use(rateLimit({ max: 45, duration: 60000 }))
		.use(openapiPlugin)
		.use(authRoute)

		.use(security)
		// 🌍 Public API
		.use(publicApi)
		// 🔐 Private API
		.use(privateApi)

export const app = createApp()

if (import.meta.main) {
	const port = Number(process.env.PORT ?? 3001)
	app.listen(port)
	console.log(`🦊 http://${app.server?.hostname}:${app.server?.port}`)
}

// TODO: for Eden in future
// REPO: https://github.com/elysiajs/eden
export type App = typeof app
