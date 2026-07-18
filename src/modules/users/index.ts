import { createInsertSchema } from 'drizzle-typebox';
import Elysia, { t } from 'elysia';
import { table } from '@/database/schema';

const _createUser = createInsertSchema(table.users, {
	// Replace email with Elysia's email type
	email: t.String({ format: 'email' }),
});

export const userManage = new Elysia().post(
	'/sign-up',
	({ body }) => {
		// Create a new user
		console.log(body);
	},
	{
		body: t.Omit(_createUser, ['id', 'salt', 'createdAt']),
	},
);
