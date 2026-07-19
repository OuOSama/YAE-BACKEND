import { createInsertSchema } from 'drizzle-typebox';
import Elysia, { t } from 'elysia';
import { table } from '@/database/schema';

const _createUser = createInsertSchema(table.test_users, {
	email: t.String({ format: 'email' }),
});

export const userManage = new Elysia().post(
	'/sign-up',
	() => {
		// Create a new user logic...
		return { success: true };
	},
	{
		body: t.Omit(_createUser, ['id', 'salt', 'createdAt']),
	},
);
