// src/modules/ai/index.ts

import Elysia from 'elysia'
import { requiredScope } from '@/lib/auth'
import { AiModel } from './model'
import { AiService } from './service'

export const ai = new Elysia({ prefix: '/ai' })
	.use(requiredScope)
	.post(
		'/chat',
		async ({ body }) => {
			const result = await AiService.Chat(body.user_message)
			return result
		},
		{
			body: AiModel.ChatRequest,
			response: AiModel.ChatResponse,
			permission: ['ai:write'],
		},
	)
	.post('/rag', () => {})
	.get('/hi', () => 'hi', {
		permission: ['ai:write'],
	})
