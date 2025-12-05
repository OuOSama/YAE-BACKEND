// src/app.ts

import openapi from '@elysiajs/openapi'
import { Elysia } from 'elysia'
import { ai } from './modules/ai'
import { broadcast } from './modules/broadcast'

const app = new Elysia()
	.use(openapi())
	.use(broadcast)
	.use(ai)
	.get('/', () => {
		return { message: '⚡ Hello YAE-BACKEND!' }
	})
	.listen(process.env.PORT ?? 3000)

console.log(`🦊 http://${app.server?.hostname}:${app.server?.port}`)
