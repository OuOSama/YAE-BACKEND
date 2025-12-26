// src/plugins/requireScope.ts

import Elysia from 'elysia'
import type { jwtPayload } from 'src/types/jwt'

export const requireScope = (required: string[]) =>
	new Elysia({
		name: 'require-scope',
	})
		.derive({ as: 'global' }, ({ store }) => ({
			store: store as jwtPayload,
		}))
		.onBeforeHandle(({ store, set }) => {
			const payload = (store as jwtPayload).jwtPayload

			if (!payload) {
				set.status = 401
				return { error: 'Unauthorized' }
			}

			const userScopes = payload.scope ?? []
			const ok = required.some((s) => userScopes.includes(s))

			if (!ok) {
				set.status = 403
				return {
					error: `Missing required scope: ${required.join(' | ')}`,
				}
			}
		})
