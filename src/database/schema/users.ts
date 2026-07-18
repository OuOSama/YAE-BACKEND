import { randomUUIDv7 } from 'bun';
import { pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('user', {
	id: varchar('id')
		.$defaultFn(() => randomUUIDv7())
		.primaryKey(),
	username: varchar('username').notNull().unique(),
	password: varchar('password').notNull(),
	email: varchar('email').notNull().unique(),
	salt: varchar('salt', { length: 64 }).notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
});
