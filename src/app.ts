// src/app.ts

import { cors } from '@elysiajs/cors'
import openapi from '@elysiajs/openapi'
import { Elysia } from 'elysia'

// lib
import { security } from './lib/auth'

// modules
import { ai } from './modules/ai'
import { authRoute } from './modules/auth'
import { broadcast } from './modules/broadcast'

// 🔐 Private API: isolated sub-app — ไม่มีทาง leak ออกไป public zone
const privateApi = new Elysia({ name: 'yae-private' })
	.use(security)
	.group('/api', { isAuth: true }, (app) =>
		app
			.use(ai)
			.use(broadcast)
			.get('/test-auth', () => 'hi this is auth'),
	)

export const createApp = () =>
	new Elysia({ name: 'yae-public' })
		.use(
			cors({
				// 2. อนุญาตเฉพาะ Origin ของ Frontend ซามะ
				origin: ['http://10.101.0.108:3000', 'http://localhost:3000'],
				methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
				allowedHeaders: ['Content-Type', 'Authorization'],
				credentials: true, // ใส่เป็น true ถ้ามีการใช้ Cookies หรือ Session ร่วมกันค่ะ
			}),
		)
		// 🌍 Public API: open routes for auth, health, and docs
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
		.get('/', () => ({ message: '⚡ Hello YAE-BACKEND!' }))
		.get('/health', () => ({
			status: 'ok',
			timestamp: new Date().toISOString(),
		}))
		.onError(({ code, error, set }) => {
			if (code === 'NOT_FOUND') {
				set.status = 404
				return { error: 'Not found' }
			}

			const message =
				error instanceof Error ? error.message : 'Internal Server Error'
			set.status = code === 'VALIDATION' ? 400 : 500
			return { error: message }
		})
		// 🔐 Private API: mount isolated sub-app
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
