export function getRequiredEnv(name: string): string {
	const value = process.env[name]?.trim()

	if (!value) {
		throw new Error(`Missing required environment variable: ${name}`)
	}

	return value
}

export function getTrustedOrigins(): string[] {
	const configured = process.env.TRUSTED_ORIGINS?.split(',')
		.map((origin) => origin.trim())
		.filter(Boolean)

	return configured?.length ? configured : ['http://localhost:3000']
}

export function getBackendBaseUrl(): string {
	return process.env.BACKEND_URL?.trim() || 'http://localhost:3001'
}
