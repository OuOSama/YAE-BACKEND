// src/modules/ai/model.ts

import { t } from 'elysia'

export namespace AiModel {
	// Request model
	export const ChatRequest = t.Object({
		user_message: t.String(),
	})
	export type ChatRequest = typeof ChatRequest.static

	// Response model
	export const ChatResponse = t.Object({
		response: t.String(),
		timestamp: t.Date(),
	})
	export type ChatResponse = typeof ChatResponse.static
}
