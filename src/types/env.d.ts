declare module 'bun' {
	interface Env {
		PORT: string
		VLLM_LLM_KEY: string
		VLLM_LLM_URL: string
		VLLM_EMB_KEY: string
		VLLM_EMB_URL: string

		NODE_ENV: 'test' | 'production'
	}
}
