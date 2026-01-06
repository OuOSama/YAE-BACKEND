// src/lib/auth/serviceAuth.ts

import { jwt } from '@elysiajs/jwt'
import { Elysia } from 'elysia'
import { AuthModel } from 'src/modules/auth/model'

export const serviceAuth = new Elysia()
	.use(
		jwt({
			name: 'jwt',
			secret: process.env.SERVICE_JWT_SECRET,
			exp: '7d',
		}),
	)
	.get(
		'/get-access',
		async ({ headers, jwt, set }) => {
			const serviceKey = headers['x-service-key']

			if (!serviceKey) {
				set.status = 401
				return Error('Unauthorized: Missing Service Key')
			}

			// TODO: Implement database-backed service key and scope management
			// BOT service
			if (serviceKey !== process.env.SERVICE_BOT_TOKEN) {
				set.status = 403
				return Error('Forbidden: Invalid Service Key')
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
