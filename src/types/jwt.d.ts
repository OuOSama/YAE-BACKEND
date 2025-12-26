// src/types/jwt.d.ts

import 'elysia'

export type jwtPayload = {
	jwtPayload: {
		sub?: string
		scope?: string[]
		iat?: number
		exp?: number
	} | null
}

declare module 'elysia' {
	interface Store {
		jwtPayload?: jwtPayload
	}
}
