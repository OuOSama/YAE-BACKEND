declare module 'bun' {
	interface Env {
		BACKEND_URL: string;
		PORT: string;

		DATABASE_URL: string;

		DISCORD_CLIENT_ID: string;
		DISCORD_CLIENT_SECRET: string;
	}
}
