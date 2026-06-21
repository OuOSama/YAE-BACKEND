// src/lib/auth/requireScope.ts

import { jwt } from '@elysiajs/jwt'
import { Elysia, t } from 'elysia'
import { getDatabaseKeys } from './env'

const jwtSecretFromDb = await getDatabaseKeys('SERVICE_JWT_SECRET')

export const requiredScope = new Elysia({
	name: 'required-scopes-plugin',
})
	.use(
		jwt({
			name: 'jwt',
			secret: jwtSecretFromDb,
			schema: t.Object({
				scopes: t.Array(t.String()),
			}),
		}),
	)
	.macro({
		permission: (scopes: string[] | string) => {
			const required = Array.isArray(scopes) ? scopes : [scopes]
			return {
				async beforeHandle({ jwt, headers, set }) {
					const auth = headers.authorization
					const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null

					if (!token) {
						set.status = 401
						throw new Error('Unauthorized: Token is missing! 🛡️')
					}

					const payload = await jwt.verify(token)

					const hasAllScopes =
						payload && required.every((s) => payload.scopes.includes(s))

					if (!hasAllScopes) {
						set.status = 403
						throw new Error(
							`Forbidden: Required scopes [${required.join(', ')}] 🔑`,
						)
					}
				},
			}
		},
	})
