// src/modules/ai/index.ts

import Elysia from 'elysia'
import { requireScope } from 'src/lib/auth'
import { AiModel } from './model'
import { AiService } from './service'

export const ai = new Elysia({ prefix: '/ai' })
	.use(requireScope(['ai:write']))
	.post(
		'/chat',
		async ({ body }) => {
			const result = await AiService.Chat(body.user_message)
			return result
		},
		{
			body: AiModel.ChatRequest,
			response: AiModel.ChatResponse,
		},
	)
	.post('/rag', () => {})
	.get('/hi', () => 'hi')
