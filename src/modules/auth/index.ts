// src/modules/auth/index.ts

import cors from '@elysiajs/cors'
import Elysia from 'elysia'
import { serviceAuth, userAuth } from '@/lib/auth'

export const authRoute = new Elysia()
	// frontend
	.use(
		cors({
			origin: 'http://localhost:3000',
			methods: ['GET', 'POST'],
			credentials: true,
			allowedHeaders: ['Content-Type', 'Authorization'],
		}),
	)
	// user auth
	.mount(userAuth.handler)
	.macro({
		auth: {
			async resolve({ status, request: { headers } }) {
				const session = await userAuth.api.getSession({
					headers,
				})
				if (!session) return status(401)
				return {
					user: session.user,
					session: session.session,
				}
			},
		},
	})
	// service auth
	.use(serviceAuth)
