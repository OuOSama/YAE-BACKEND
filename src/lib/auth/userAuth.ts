// src/lib/auth/userAuth.ts

import { apiKey } from '@better-auth/api-key'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '@/database/client'
import * as schema from '@/database/schema'
import { redis } from '../redis'
import { getBackendBaseUrl, getTrustedOrigins } from './env'

export const userAuth = betterAuth({
	database: drizzleAdapter(db, {
		schema: schema,
		usePlural: true,
		provider: 'pg', // or "mysql", "sqlite"
	}),
	baseURL: getBackendBaseUrl(),
	trustedOrigins: getTrustedOrigins(),
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
	// 💡 ลบก้อน secondaryStorage นี้ออกถ้าระบบเริ่มใหญ่ขึ้น แล้วอยากตัดค่าใช้จ่าย
	// เพื่อสลับไปให้ Better-Auth จัดเก็บและจัดการ Session/API Key บน Database หลัก (Supabase) แบบอัตโนมัติ
	secondaryStorage: {
		get: async (key) => await redis.get(key),
		set: async (key, value, ttl) => {
			if (ttl) await redis.set(key, value, 'EX', ttl)
			else await redis.set(key, value)
		},
		delete: async (key) => {
			await redis.del(key)
		},
	},
	plugins: [apiKey({ storage: 'secondary-storage' })],
})
