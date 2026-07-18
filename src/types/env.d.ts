declare module 'bun' {
	interface Env {
		PORT: string;

		DISCORD_CLIENT_ID: string;
		DISCORD_CLIENT_SECRET: string;
	}
}
