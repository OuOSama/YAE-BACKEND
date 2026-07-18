import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/database/client'; // your drizzle instance

import { table } from '@/database/schema';

export const auth = betterAuth({
	baseURL: process.env.BACKEND_URL,
	database: drizzleAdapter(db, {
		provider: 'pg', // or "mysql", "sqlite"
		schema: table,
		usePlural: true,
	}),
	trustedOrigins: [process.env.FRONTEND_URL],
	socialProviders: {
		discord: {
			clientId: process.env.DISCORD_CLIENT_ID,
			clientSecret: process.env.DISCORD_CLIENT_SECRET,
		},
	},
});
