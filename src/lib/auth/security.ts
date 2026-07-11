// src/lib/auth/security.ts

import { bearer } from '@elysia/bearer'
import { jwt } from '@elysiajs/jwt'
import { Elysia, t } from 'elysia'
import { getDatabaseKeys } from './env'

const jwtSecretFromDb = await getDatabaseKeys('SERVICE_JWT_SECRET')

export const security = new Elysia({ name: 'security-plugin' })
	.use(bearer())
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
	// 👇 resolve ทำงานทุก route เสมอ (unconditional) TS เลยเห็น `user` ชัวร์เสมอ
	.resolve(async ({ jwt, bearer }) => {
		if (!bearer) return { user: null }
		const payload = await jwt.verify(bearer)
		return { user: payload ?? null }
	})
	.macro({
		isAuth: (enabled: boolean) => ({
			beforeHandle({ user, status }) {
				if (!enabled) return
				if (!user) return status(401, 'Unauthorized: Token is missing! 🛡️')
			},
		}),
		permission: (scopes: string[] | string) => {
			const required = Array.isArray(scopes) ? scopes : [scopes]
			return {
				beforeHandle({ user, status }) {
					if (!user) {
						return status(401, 'Unauthorized: Token is missing! 🛡️')
					}

					const hasAllScopes = required.every((s) => user.scopes?.includes(s))

					if (!hasAllScopes) {
						return status(
							403,
							`Forbidden: Required scopes [${required.join(', ')}] 🔑`,
						)
					}
				},
			}
		},
	})
