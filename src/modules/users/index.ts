import { createInsertSchema } from 'drizzle-typebox';
import Elysia, { t } from 'elysia';
import { table } from '@/database/schema';
import { yaeLogger } from '@/plugins/logger';

const _createUser = createInsertSchema(table.test_users, {
	email: t.String({ format: 'email' }),
});

export const userManage = new Elysia().post(
	'/sign-up',
	({ body }) => {
		// 🦊 พ่น Log ขอดู JSON body แบบสวยงาม
		yaeLogger.info({ body }, 'Sign-up request received');

		// Create a new user logic...
		return { success: true };
	},
	{
		body: t.Omit(_createUser, ['id', 'salt', 'createdAt']),
	},
);
