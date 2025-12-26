// src/app.ts

import jwt from '@elysiajs/jwt'
import openapi from '@elysiajs/openapi'
import { Elysia, t } from 'elysia'
import { ai } from './modules/ai'
import { broadcast } from './modules/broadcast'
import type { jwtPayload } from './types/jwt'

const app = new Elysia()
	.decorate('store', {
		jwtPayload: null as jwtPayload['jwtPayload'],
	})
	.use(jwt({ name: 'jwt', secret: process.env.JWT_SECRET }))

// 🏠 public
app
	.get('/', () => ({ message: '⚡ Hello YAE-BACKEND!' }))
	.use(openapi())
	.post(
		'/get-access',
		async ({ body, jwt, status }) => {
			// TODO: impairment with database to store password and scope | Supabase, Surrealdb ?
			if (body.secret !== process.env.BACKEND_KEY) return status(403)
			const token = await jwt.sign({
				iss: 'yae-core',
				scope: ['broadcast'],
				exp: '24h',
			})
			return {
				token: token,
			}
		},
		{
			body: t.Object({ secret: t.String() }),
		},
	)

// 🔒 private
app.guard(
	{
		async beforeHandle({ headers, status, jwt, store }) {
			const token = headers.authorization?.replace('Bearer ', '')
			if (!token) return status(401)

			const payload = await jwt.verify(token)
			if (!payload) return status(401)

			store.jwtPayload = payload
		},
	},
	(app) =>
		app
			.use(broadcast)
			.use(ai)
			.get('/test', () => ({ name: 'hello from authentication!' })),
)

app.listen(process.env.PORT ?? 3000)

console.log(`🦊 http://${app.server?.hostname}:${app.server?.port}`)
