// src/scripts/add_service.ts

import { db } from '@/database/client'
import { appServices } from '@/database/schema/app_services'
import { encryptKey } from '@/lib/auth/hash'

async function registerNewService(serviceName: string, rawSecretKey: string) {
	try {
		console.log(
			`⏳ [YAE Core] Registering dynamic service: [${serviceName}]...`,
		)

		// 🔐 1. แปลงโฉมคีย์ดิบย่อย (เช่น OpenAI Key) ด้วยการ Encrypt ก่อนลงฐานข้อมูล
		const encryptedKey = encryptKey(rawSecretKey)

		// 💾 2. บันทึกทุกอย่างจบในตารางเดียว (app_services)
		await db
			.insert(appServices)
			.values({
				id: crypto.randomUUID(),
				name: serviceName,
				key: encryptedKey, // 💡 เก็บ API Key ที่เข้ารหัสเสร็จแล้วลงคอลัมน์ key ตรงนี้เลยค่ะ!
				description: `Dynamic infrastructure entry for ${serviceName}`,
				status: 'operational',
				role: 'service', // Default Role จาก Enum
				scopes: ['ai:write'], // Default Scopes จาก Enum
			})
			.onConflictDoUpdate({
				target: [appServices.name], // 🎯 หากชื่อซ้ำกัน ระบบจะวิ่งมาอัปเดตข้อมูลชุดล่างนี้แทนค่ะ
				set: {
					key: encryptedKey, // อัปเดตคีย์ล่าสุด
					updatedAt: new Date(),
				},
			})

		console.log(
			`\n✅ Registration Success! [${serviceName}] is now synced and operational in database! ✨`,
		)
	} catch (error) {
		console.error('❌ Registration failed:', error)
	}
}

// 📥 รับค่าจาก Arguments ตอนสั่งรันผ่าน Command Line คลีนๆ
const args = process.argv.slice(2)
const serviceNameInput = args[0]
const secretValueInput = args[1]

if (!serviceNameInput || !secretValueInput) {
	console.log('\n💡 YAE Script Usage Guide:')
	console.log(
		'👉 bun run src/scripts/add_service.ts <service_name> <api_or_bot_key>',
	)
	console.log(
		'📌 Example: bun run src/scripts/add_service.ts openai-service sk-proj-xxxxxx...\n',
	)
	process.exit(0)
}

// ลุยเลยค่ะซามะ!
registerNewService(serviceNameInput, secretValueInput)
