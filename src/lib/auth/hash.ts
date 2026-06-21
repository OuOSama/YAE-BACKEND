// src/lib/auth/hash.ts

import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto'
import { getRequiredEnv } from './env'

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 12
const KEY = Buffer.from(getRequiredEnv('DB_ENCRYPTION_KEY'), 'hex')

export function encryptKey(text: string): string {
	const iv = randomBytes(IV_LENGTH)
	const cipher = createCipheriv(ALGORITHM, KEY, iv)

	const encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex')
	const authTag = cipher.getAuthTag().toString('hex')

	return `${iv.toString('hex')}:${authTag}:${encrypted}`
}

export function decryptKey(encryptedData: string): string {
	const [ivHex, authTagHex, encryptedHex] = encryptedData.split(':')
	const decipher = createDecipheriv(ALGORITHM, KEY, Buffer.from(ivHex, 'hex'))

	decipher.setAuthTag(Buffer.from(authTagHex, 'hex'))

	return decipher.update(encryptedHex, 'hex', 'utf8') + decipher.final('utf8')
}
