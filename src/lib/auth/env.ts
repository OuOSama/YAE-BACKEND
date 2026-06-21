// src/lib/auth/env.ts

import { eq } from 'drizzle-orm'
import { db } from '@/database/client'
import { secretKeys } from '@/database/schema'
import { decryptKey } from './hash'

export function getRequiredEnv(name: string): string {
	const value = process.env[name]?.trim()

	if (!value) {
		throw new Error(`Missing required environment variable: ${name}`)
	}

	return value
}

export async function getDatabaseKeys(keyName: string): Promise<string> {
	try {
		const [row] = await db
			.select()
			.from(secretKeys)
			.where(eq(secretKeys.key, keyName))
			.limit(1)

		if (!row) {
			throw new Error(`Key for service "${keyName}" not found in database.`)
		}

		return decryptKey(row.hash_value)
	} catch (error) {
		console.error(`❌ Failed to fetch database key for: ${keyName}`, error)
		throw error
	}
}

export function getTrustedOrigins(): string[] {
	const configured = process.env.TRUSTED_ORIGINS?.split(',')
		.map((origin) => origin.trim())
		.filter(Boolean)

	return configured?.length ? configured : ['http://localhost:3000']
}

export function getBackendBaseUrl(): string {
	return process.env.BACKEND_URL?.trim() || 'http://localhost:3001'
}
