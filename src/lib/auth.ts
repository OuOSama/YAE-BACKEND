// src/lib/auth.ts

import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import * as schema from '../database/schema'
import { db } from '../database/setup'

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		schema: schema,
		usePlural: true,
		provider: 'pg', // or "mysql", "sqlite"
	}),
	baseURL: 'http://localhost:3001', // backend (Elysia.js)
	trustedOrigins: ['http://localhost:3000'], // frontend (Next.Js)
	emailAndPassword: {
		enabled: true,
	},
	socialProviders: {
		discord: {
			clientId: process.env.DISCORD_CLIENT_ID,
			clientSecret: process.env.DISCORD_CLIENT_SECRET,
			scope: ['identify', 'email'],
		},
	},
})
