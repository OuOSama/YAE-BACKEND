export * from './schema/auth/accounts';
export * from './schema/auth/sessions';
export * from './schema/auth/users';
export * from './schema/auth/verifications';
export * from './schema/test_users';

import { accounts } from './schema/auth/accounts';
import { sessions } from './schema/auth/sessions';
import { users } from './schema/auth/users';
import { verifications } from './schema/auth/verifications';
import { test_users } from './schema/test_users';

export const table = {
	test_users,
	sessions,
	users,
	verifications,
	accounts,
} as const;

export type Table = typeof table;
