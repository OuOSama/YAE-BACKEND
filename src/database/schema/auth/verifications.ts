// src/database/schema/auth/verification.ts

import * as t from 'drizzle-orm/pg-core'
import { pgTable } from 'drizzle-orm/pg-core'

export const verifications = pgTable('verification', {
	id: t.text('id').primaryKey(),
	identifier: t.text('identifier').notNull(),
	value: t.text('value').notNull(),
	expiresAt: t
		.timestamp('expires_at', { precision: 6, withTimezone: true })
		.notNull(),
	createdAt: t
		.timestamp('created_at', { precision: 6, withTimezone: true })
		.notNull(),
	updatedAt: t
		.timestamp('updated_at', { precision: 6, withTimezone: true })
		.notNull(),
})

export type InsertVerification = typeof verifications.$inferInsert
export type SelectVerification = typeof verifications.$inferSelect
