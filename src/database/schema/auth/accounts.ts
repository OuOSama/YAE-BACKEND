// src/database/schema/auth/account.ts

import * as t from 'drizzle-orm/pg-core'
import { pgTable } from 'drizzle-orm/pg-core'
import { users } from './users'

export const accounts = pgTable('account', {
	id: t.text('id').primaryKey(),
	userId: t
		.text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	accountId: t.text('account_id').notNull(),
	providerId: t.text('provider_id').notNull(),
	accessToken: t.text('access_token'),
	refreshToken: t.text('refresh_token'),
	accessTokenExpiresAt: t.timestamp('access_token_expires_at', {
		precision: 6,
		withTimezone: true,
	}),
	refreshTokenExpiresAt: t.timestamp('refresh_token_expires_at', {
		precision: 6,
		withTimezone: true,
	}),
	scope: t.text('scope'),
	idToken: t.text('id_token'),
	password: t.text('password'),
	createdAt: t
		.timestamp('created_at', { precision: 6, withTimezone: true })
		.notNull(),
	updatedAt: t
		.timestamp('updated_at', { precision: 6, withTimezone: true })
		.notNull(),
})

export type InsertAccount = typeof accounts.$inferInsert
export type SelectAccount = typeof accounts.$inferSelect
