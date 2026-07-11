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
	.macro({
		isAuth: (enabled: boolean) => ({
			async beforeHandle({ jwt, bearer, status, store }) {
				if (!enabled) return

				// ใช้ bearer จากปลั๊กอินตรงๆ ไม่ต้องสไลด์เองแบบโค้ดเก่า
				if (!bearer) {
					return status(401, 'Unauthorized: Token is missing! 🛡️')
				}

				const payload = await jwt.verify(bearer)
				if (!payload) {
					return status(401, 'Unauthorized: Invalid Token! 🛡️')
				}

				// ฝาก payload ไว้ใน store หรือเอาไปใช้ต่อใน context อื่นๆ ได้ค่ะ
				// (ถ้าอยากให้ Route ถัดๆ ไปเรียกใช้ได้ ให้ใส่ไว้ใน Object Context)
				Object.assign(store, { user: payload })
			},
		}),
		permission: (scopes: string[] | string) => {
			const required = Array.isArray(scopes) ? scopes : [scopes]
			return {
				async beforeHandle({ jwt, bearer, status }) {
					if (!bearer) {
						return status(401, 'Unauthorized: Token is missing! 🛡️')
					}

					const payload = await jwt.verify(bearer)
					if (!payload) {
						return status(401, 'Unauthorized: Invalid Token! 🛡️')
					}

					const hasAllScopes = required.every((s) =>
						payload.scopes?.includes(s),
					)

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
