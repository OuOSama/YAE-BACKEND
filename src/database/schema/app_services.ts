// src/database/schema/app_services.ts

import {
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
	varchar,
} from 'drizzle-orm/pg-core'

// 🎭 1. สร้าง Enum สำหรับประเภทของ Service Role
export const serviceRoleEnum = pgEnum('service_role', [
	'service',
	'admin',
	'bot',
])

// 🔑 2. สร้าง Enum สำหรับรายการ Scopes (สิทธิ์เฉพาะเจาะจง)
export const serviceScopeEnum = pgEnum('service_scope', [
	'ai:write',
	'ai:read',
	'db:write',
	'db:read',
])

export const appServices = pgTable('app_services', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: varchar('name', { length: 255 }).notNull().unique(),
	description: text('description'),
	key: varchar('key', { length: 255 }).notNull(),
	status: varchar('status', { length: 50 }).notNull().default('operational'),
	role: serviceRoleEnum('role').notNull().default('service'),
	scopes: serviceScopeEnum('scopes').array().notNull().default(['ai:write']),
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
