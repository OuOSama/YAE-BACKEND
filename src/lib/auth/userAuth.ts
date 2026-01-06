// src/lib/auth/userAuth.ts

import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '../../database/client'
import * as schema from '../../database/schema'

export const userAuth = betterAuth({
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
