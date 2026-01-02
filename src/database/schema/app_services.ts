// src/database/schema/app_services.ts

import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

export const appServices = pgTable('app_services', {
	id: uuid('id').primaryKey().defaultRandom(),

	name: varchar('name', { length: 255 }).notNull(),
	description: text('description'),

	// enum-like status
	status: varchar('status', { length: 50 }).notNull().default('operational'),

	metadata: text('metadata'),
	createdAt: timestamp('created_at', { withTimezone: true })
		.notNull()
		.defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true })
		.notNull()
		.$onUpdate(() => new Date()),
})

export type InsertAppService = typeof appServices.$inferInsert
export type SelectAppService = typeof appServices.$inferSelect
