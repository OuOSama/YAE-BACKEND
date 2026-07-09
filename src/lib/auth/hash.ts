// src/lib/auth/hash.ts

import {
	type CipherGCMTypes,
	createCipheriv,
	createDecipheriv,
	randomBytes,
} from 'node:crypto'

const ALGORITHM: CipherGCMTypes = 'aes-256-gcm'
const IV_LENGTH = 12
const KEY = Buffer.from(process.env.DB_ENCRYPTION_KEY, 'hex')

export function encryptKey(text: string): string {
	const iv = randomBytes(IV_LENGTH)
	const cipher = createCipheriv(ALGORITHM, KEY, iv)
	const encrypted = `${cipher.update(text, 'utf8', 'hex')}${cipher.final('hex')}`

	return `${iv.toString('hex')}:${cipher.getAuthTag().toString('hex')}:${encrypted}`
}

export function decryptKey(encryptedData: string): string {
	const [ivHex, authTagHex, encryptedHex] = encryptedData.split(':') as [
		string,
		string,
		string,
	]
	const decipher = createDecipheriv(ALGORITHM, KEY, Buffer.from(ivHex, 'hex'))
	decipher.setAuthTag(Buffer.from(authTagHex, 'hex'))

	return `${decipher.update(encryptedHex, 'hex', 'utf8')}${decipher.final('utf8')}`
}
