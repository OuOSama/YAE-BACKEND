declare module 'bun' {
	interface Env {
		PORT: string
		BACKEND_URL: string
		TRUSTED_ORIGINS: string

		BETTER_AUTH_URL: string
		BETTER_AUTH_SECRET: string
		DB_ENCRYPTION_KEY: string

		VLLM_LLM_URL: string
		VLLM_LLM_KEY: string
		VLLM_EMB_URL: string
		VLLM_EMB_KEY: string

		DATABASE_URL: string
		REDIS_URL: string

		NODE_ENV: 'test' | 'production'

		DISCORD_CLIENT_ID: string
		DISCORD_CLIENT_SECRET: string
	}
}
