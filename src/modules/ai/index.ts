// src/modules/ai/index.ts

import Elysia from 'elysia'
import { AiModel } from './model'
import { AiService } from './service'

export const ai = new Elysia({ prefix: '/ai' })
	.post(
		'/chat',
		async ({ body }) => {
			const result = await AiService.Chat(body.user_text)
			return result
		},
		{
			body: AiModel.ChatRequest,
			response: AiModel.ChatResponse,
		},
	)
	.post('/rag', () => {})
