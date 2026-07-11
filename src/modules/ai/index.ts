// src/modules/ai/index.ts

import Elysia from 'elysia'
import { security } from '@/lib/auth' // 👈 import เข้ามา
import { AiModel } from './model'
import { AiService } from './service'

export const ai = new Elysia({ prefix: '/ai' })
	.use(security) // 👈 เติมตรงนี้ TS จะรู้จัก permission ทันที
	.post(
		'/chat',
		async ({ body }) => {
			const result = await AiService.Chat(body.user_message)
			return result
		},
		{
			body: AiModel.ChatRequest,
			response: AiModel.ChatResponse,
			permission: ['ai:chat'],
		},
	)
	.post('/rag', () => {}, {
		permission: ['ai:rag'],
	})
	.get('/hi', () => 'hi', {
		permission: ['ai:read'],
	})
