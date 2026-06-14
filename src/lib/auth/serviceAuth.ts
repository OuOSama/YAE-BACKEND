// src/lib/auth/serviceAuth.ts

import { jwt } from '@elysiajs/jwt'
import { Elysia } from 'elysia'
import { AuthModel } from '@/modules/auth/model'
import { getRequiredEnv } from './env'

export const serviceAuth = new Elysia()
	.use(
		jwt({
			name: 'jwt',
			secret: getRequiredEnv('SERVICE_JWT_SECRET'),
			exp: '7d',
		}),
	)
	.get(
		'/get-access',
		async ({ headers, jwt, status }) => {
			const serviceKey = headers['x-service-key']
			const expectedServiceKey = getRequiredEnv('SERVICE_BOT_TOKEN')

			if (!serviceKey) return status(401, 'Forbidden: Invalid Service Key')

			// 💡 FUTURE-PROOF: Implement DB storage to manage dynamic scopes and service-level rotation.
			// BOT service
			if (serviceKey !== expectedServiceKey) {
				return status(403, 'Forbidden: Invalid Service Key')
			}

			const accessToken = await jwt.sign({
				iss: 'yae-core',
				sub: 'bot-service',
				role: 'service',
				aud: 'yae-backend',
				iat: true,
				scopes: ['ai:write'],
			})

			return {
				access_token: accessToken,
			}
		},
		{
			headers: AuthModel.GetAccessHeader,
		},
	)
