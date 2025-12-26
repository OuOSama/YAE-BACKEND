declare module 'bun' {
	interface Env {
		JWT_SECRET: string
		BACKEND_KEY: string
		PORT: string

		VLLM_LLM_KEY: string
		VLLM_LLM_URL: string
		VLLM_EMB_KEY: string
		VLLM_EMB_URL: string

		NODE_ENV: 'test' | 'production'
	}
}
