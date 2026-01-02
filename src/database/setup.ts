// src/database/setup.ts

/**
 * Database setup using Drizzle ORM + postgres.js
 *
 * Reference:
 * - Supabase Drizzle guide:
 *   https://supabase.com/docs/guides/database/drizzle
 *
 * Notes:
 * - Supabase local connection string uses an internal Docker hostname
 * - This replaces the hostname so postgres.js can connect correctly
 * - `prepare: false` is required for Transaction pool mode
 */

import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

let connectionString = process.env.DATABASE_URL

if (connectionString.includes('postgres:postgres@supabase_db_')) {
	const url = new URL(connectionString)
	url.hostname = url.hostname.split('_')[1]
	connectionString = url.toString()
}

// Disable prefetch as it is not supported for "Transaction" pool mode
export const client = postgres(connectionString, { prepare: false })
export const db = drizzle(client)
