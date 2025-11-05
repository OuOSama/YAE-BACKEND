// src/modules/broadcast/model.ts

import { t } from 'elysia'

export namespace BroadcastModel {
	export const Status = t.Object({
		service_name: t.String(),
		status: t.Union([
			t.Literal('online'),
			t.Literal('offline'),
			t.Literal('running'),
			t.Literal('error'),
		]),
		timestamp: t.Date(),
		message: t.Optional(t.String()),
	})

	export type Status = typeof Status.static

	export const ErrorResponse = t.Object({
		error: t.String(),
		timestamp: t.Date(),
	})
}
