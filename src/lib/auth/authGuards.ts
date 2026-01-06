// src/lib/auth/authGuards.ts

import { jwt } from '@elysiajs/jwt'
import type { Elysia } from 'elysia'
import { userAuth } from './userAuth'

export const authGuard = (app: Elysia) =>
	app
		.use(
			jwt({
				name: 'jwt',
				secret: process.env.SERVICE_JWT_SECRET,
			}),
		)
		.derive(async ({ headers, request, jwt }) => {
			const authHeader = headers.authorization
			const token = authHeader?.startsWith('Bearer ')
				? authHeader.split(' ')[1]
				: null

			const payload = token ? await jwt.verify(token) : null
			const session = await userAuth.api.getSession({
				headers: request.headers,
			})

			return {
				user: session?.user ?? null,
				service: payload ?? null,
				isAuthorized: !!session || !!payload,
			}
		})
		.onBeforeHandle(({ isAuthorized, set }) => {
			if (!isAuthorized) {
				set.status = 401
				return { error: 'unauthorized', message: 'Credentials required' }
			}
		})
