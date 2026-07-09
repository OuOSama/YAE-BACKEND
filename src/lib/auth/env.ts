// src/lib/auth/env.ts

import { eq } from 'drizzle-orm'
import { db } from '@/database/client'
import { secretKeys } from '@/database/schema'
import { decryptKey } from './hash'

export async function getDatabaseKeys(keyName: string): Promise<string> {
	try {
		const [row] = await db
			.select()
			.from(secretKeys)
			.where(eq(secretKeys.key, keyName))
			.limit(1)

		if (!row)
			throw new Error(`Key for service "${keyName}" not found in database.`)
		return decryptKey(row.hash_value)
	} catch (error) {
		console.error(`❌ Failed to fetch database key for: ${keyName}`, error)
		throw error
	}
}
