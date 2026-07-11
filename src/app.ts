// src/app.ts

import openapi from '@elysiajs/openapi'
import { Elysia } from 'elysia'
import { rateLimit } from 'elysia-rate-limit'

// lib
import { security } from './lib/auth'

// modules
import { ai } from './modules/ai'
import { authRoute } from './modules/auth'
import { broadcast } from './modules/broadcast'

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
		.use(authRoute)
		.use(
			openapi({
				documentation: {
					info: {
						title: 'YAE Backend API',
						version: '1.0.0',
						description: 'Elysia backend for the YAE!.',
					},
				},
			}),
		)
		.use(security)
		// 🌍 Public API
		.use(publicApi)
		// 🔐 Private API
		.use(privateApi)
		.onError(({ code, error, set }) => {
			if (code === 'NOT_FOUND') {
				set.status = 404
				console.log('NOOO')
				return { error: 'Not found' }
			}

			const message =
				error instanceof Error ? error.message : 'Internal Server Error'
			set.status = code === 'VALIDATION' ? 400 : 500
			return { error: message }
		})

export const app = createApp()

if (import.meta.main) {
	const port = Number(process.env.PORT ?? 3001)
	app.listen(port)
	console.log(`🦊 http://${app.server?.hostname}:${app.server?.port}`)
}

// TODO: for Eden in future
// REPO: https://github.com/elysiajs/eden
export type App = typeof app
