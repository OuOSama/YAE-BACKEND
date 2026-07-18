export * from './schema/test_users';

import { test_users } from './schema/test_users';

export const table = {
	test_users,
} as const;

export type Table = typeof table;
