// src/lib/auth/requireScope.ts

import { jwt } from '@elysiajs/jwt'
import type { Elysia } from 'elysia'

export const requireScope = (value: string[] | string) => {
	const requiredScopes = Array.isArray(value) ? value : [value]

	return (app: Elysia) =>
		app
			.use(
				jwt({
					name: 'jwt',
					secret: process.env.SERVICE_JWT_SECRET,
				}),
			)
			.onBeforeHandle(async ({ headers, jwt, set }) => {
				const token = headers.authorization?.replace('Bearer ', '')
				if (!token) {
					set.status = 401
					return Error('401, Token missing! 🛡️')
				}

				const payload = await jwt.verify(token)
				if (!payload) {
					set.status = 401

					return Error('401, Invalid token! ❌')
				}

				const userScopes = (payload.scopes as string[]) ?? []
				const hasPermission = requiredScopes.every((s) =>
					userScopes.includes(s),
				)

				if (!hasPermission) {
					set.status = 401

					return Error('403, Insufficient permissions! ❌')
				}
			})
}
