// src/scripts/add_key.ts

import { randomBytes } from 'node:crypto'
import { db } from '@/database/client'
import { secretKeys } from '@/database/schema'
import { encryptKey } from '@/lib/auth/hash'

async function insertServiceKey(keyName: string, rawSecretKey: string) {
	try {
		console.log(`⏳ Start creating a key for the service.: [${keyName}]...`)

		const encryptedKey = encryptKey(rawSecretKey)

		await db
			.insert(secretKeys)
			.values({
				id: crypto.randomUUID(),
				key: keyName,
				hash_value: encryptedKey,
			})
			.onConflictDoUpdate({
				target: secretKeys.key,
				set: {
					key: encryptedKey,
					updatedAt: new Date(),
				},
			})

		console.log(
			`✅ Success! Key saved. [${keyName}] The data has been successfully entered into the database! ✨`,
		)
	} catch (error) {
		console.info('🔑 DB_ENCRYPTION_KEY: ', randomBytes(32).toString('hex'))
		console.error(
			"❌ No worries! Maybe you just forgot to add DB_ENCRYPTION_KEY to your .env file. It's right up there! 👆🏻",
			error,
		)
	}
}

const args = process.argv.slice(2)
const serviceNameInput = args[0]
const secretValueInput = args[1]

if (!serviceNameInput || !secretValueInput) {
	console.log('\n💡 YAE Script Usage Guide:')
	console.log('👉 bun run src/scripts/init.ts <service_name> <secret_key>')
	console.log(
		'📌 Example: bun run src/scripts/init.ts yae-bot MY_SUPER_SECRET_JWT_KEY_123\n',
	)
	process.exit(0)
}

insertServiceKey(serviceNameInput, secretValueInput)
