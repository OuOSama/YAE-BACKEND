import { createInsertSchema } from 'drizzle-typebox';
import Elysia, { t } from 'elysia';
import { table } from '@/database/schema';

import { yaeLoggerPlugin } from '@/plugins/logger';

const _createUser = createInsertSchema(table.test_users, {
	email: t.String({ format: 'email' }),
});

export const userManage = new Elysia().use(yaeLoggerPlugin).post(
	'/sign-up',
	({ body, store, request }) => {
		store.logger.info(request, 'Creating new user', { body });
		return { success: true };
	},
	{
		body: t.Omit(_createUser, ['id', 'salt', 'createdAt']),
	},
);
