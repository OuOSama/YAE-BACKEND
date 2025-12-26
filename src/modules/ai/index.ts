// src/modules/ai/index.ts

import Elysia from 'elysia'
import { requireScope } from 'src/plugins/requireScope'
import { AiModel } from './model'
import { AiService } from './service'

export const ai = new Elysia({ prefix: '/ai' })
	.use(requireScope(['ai']))
	.get('/test-scope', () => {
		return { auth: 'Hello!' }
	})
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
