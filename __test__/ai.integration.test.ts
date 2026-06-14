// __test__/ai.integration.test.ts

import { describe, expect, it } from 'bun:test'
import Elysia from 'elysia'

import { AiModel } from '@/modules/ai/model'
import { AiService } from '@/modules/ai/service'

// ⏱ Helper to set test timeout (vLLM might be slow)
const TEST_TIMEOUT = 20000 // 10s

;(process.env.NODE_ENV === 'test' ? describe.skip : describe)(
	'AiService',
	() => {
		it(
			'should return ChatResponse with text and timestamp',
			async () => {
				const response = await AiService.Chat('What is your name?')

				// Check if response has the correct structure
				expect(response).toHaveProperty('response')
				expect(response).toHaveProperty('timestamp')

				// Verify types
				expect(typeof response.response).toBe('string')
				expect(response.timestamp).toBeInstanceOf(Date)

				// Verify text is not empty
				expect(response.response.length).toBeGreaterThan(0)
			},
			TEST_TIMEOUT,
		)

		it(
			'should handle multiple user inputs',
			async () => {
				const testInputs = [
					'What is your name?',
					'Tell me about the Grand Narukami Shrine',
					'Do you like fried tofu?',
				]

				for (const input of testInputs) {
					const response = await AiService.Chat(input)
					expect(response.response).toBeTruthy()
					expect(response.timestamp).toBeInstanceOf(Date)
				}
			},
			TEST_TIMEOUT,
		)
	},
)
;(process.env.NODE_ENV === 'test' ? describe.skip : describe)(
	'Elysia with AiService',
	() => {
		it('returns a response with answer from Ai Service', async () => {
			const app = new Elysia().post(
				'/chat',
				async ({ body }) => {
					return await AiService.Chat(body.user_message)
				},
				{
					body: AiModel.ChatRequest,
				},
			)

			const raw = await app.handle(
				new Request('http://localhost/chat', {
					method: 'POST',
					body: JSON.stringify({ user_message: 'Hello' }),
					headers: { 'Content-Type': 'application/json' },
				}),
			)

			const response = await raw.json()

			expect(response.response).toBeTruthy()
			expect(response.timestamp).toBeTruthy()
		})
	},
)
