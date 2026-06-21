// src/lib/auth/security.ts

import { jwt } from '@elysiajs/jwt'
import { Elysia, t } from 'elysia'
import { getDatabaseKeys } from './env'

const jwtSecretFromDb = await getDatabaseKeys('SERVICE_JWT_SECRET')

export const security = new Elysia({ name: 'security-plugin' })
	.use(
		jwt({
			name: 'jwt',
			secret: jwtSecretFromDb,
			schema: t.Object({
				scopes: t.Optional(t.Array(t.String())),
				iss: t.Optional(t.String()),
				aud: t.Optional(t.String()),
			}),
		}),
	)
	.macro({
		isAuth: (enabled: boolean) => ({
			async beforeHandle({ jwt, headers, status }) {
				if (!enabled) return

				const token = headers.authorization?.startsWith('Bearer ')
					? headers.authorization.slice(7)
					: null
				if (!token) return status('Unauthorized')

				const payload = await jwt.verify(token)
				if (!payload) return status('Unauthorized')
			},
		}),
	})
