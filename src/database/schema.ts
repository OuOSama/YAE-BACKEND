import { users } from './schema/users';

export const table = {
	users,
} as const;

export type Table = typeof table;
