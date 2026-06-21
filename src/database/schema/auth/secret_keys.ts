// src/database/schema/auth/secret_keys.ts

import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const secretKeys = pgTable('secret_keys', {
	id: text('id').primaryKey(),
	key: text('key').notNull().unique(),
	hash_value: text('hash_value').notNull(),
	createdAt: timestamp('created_at', { precision: 6, withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp('updated_at', { precision: 6, withTimezone: true })
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
})

// คลีนขึ้นกว่าเดิมตอนเอาไปอ้างอิง Type ค่ะซามะ
export type InsertSecretKey = typeof secretKeys.$inferInsert
export type SelectSecretKey = typeof secretKeys.$inferSelect
