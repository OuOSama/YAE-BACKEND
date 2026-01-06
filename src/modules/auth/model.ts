// src/modules/auth/model.ts

import { t } from 'elysia'

export namespace AuthModel {
	export const GetAccessHeader = t.Object({
		'x-service-key': t.String({
			error: 'Missing or invalid x-service-key',
		}),
	})

	export type GetAccessHeader = typeof GetAccessHeader.static
}
