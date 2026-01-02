// src/app.ts

import cors from '@elysiajs/cors'
import openapi from '@elysiajs/openapi'
import { Elysia } from 'elysia'
import { auth } from './lib/auth'

// modules
import { ai } from './modules/ai'
import { broadcast } from './modules/broadcast'

const app = new Elysia()
	.use(
		cors({
			origin: ['http://localhost:3000'], // only frontend
			methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
			credentials: true,
		}),
	)
	.mount(auth.handler)

	// 🏠 public
	.get('/', () => ({
		message: '⚡ Hello YAE-BACKEND!',
	}))

	// 📦 feature modules (ตอนนี้ยัง public ทั้งหมด)
	.use(ai)
	.use(broadcast)

	// 📚 docs
	.use(openapi())

app.listen(process.env.PORT ?? 3000)

console.log(`🦊 http://${app.server?.hostname}:${app.server?.port}`)

export type App = typeof app
