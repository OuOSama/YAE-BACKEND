// src/lib/auth/serviceAuth.ts

import { jwt } from '@elysiajs/jwt'
import { eq } from 'drizzle-orm'
import { Elysia } from 'elysia'
import { db } from '@/database/client'
import { appServices } from '@/database/schema/app_services' // 🚀 มุ่งตรงมาที่นี่ตารางเดียวเลยค่ะ!
import { AuthModel } from '@/modules/auth/model'
import { getDatabaseKeys } from './env'
import { decryptKey } from './hash'

// 🔐 ดึงคีย์หลักสำหรับเซ็นสิทธิ์ JWT จากฐานข้อมูลตอนเริ่มรันระบบ (ยังอยู่เพื่อความปลอดภัยระดับ Core)
const jwtSecretFromDb = await getDatabaseKeys('SERVICE_JWT_SECRET')

export const serviceAuth = new Elysia({ prefix: '/service' })
	.use(
		jwt({
			name: 'jwt',
			secret: jwtSecretFromDb,
			exp: '7d',
		}),
	)
	.get(
		'/get-access',
		async ({ headers, jwt, status }) => {
			const serviceName = headers['x-service-name']
			const serviceKey = headers['x-service-key']

			if (!serviceKey || !serviceName) {
				return status(401, 'Forbidden: Missing Service Key or Service Name')
			}

			try {
				// 🔍 1. วิ่งไปส่องตาราง app_services ตรวจหาตามชื่อบริการที่ยิงเข้ามาในรอบเดียวจบ!
				const [serviceRow] = await db
					.select()
					.from(appServices)
					.where(eq(appServices.name, serviceName))
					.limit(1)

				if (!serviceRow) {
					return status(403, 'Forbidden: Service Name not registered')
				}

				// 🔓 2. ถอดรหัสคีย์ (API Key ย่อยเช่น OpenAI, Claude) จากคอลัมน์ key มาเทียบหน้างาน
				const expectedServiceKey = decryptKey(serviceRow.key)
				if (serviceKey !== expectedServiceKey) {
					return status(403, 'Forbidden: Invalid Service Key')
				}

				// 🎫 3. คีย์ตรง สิทธิ์ผ่าน! เจนตั๋ว Access Token ออกไปให้ตาม Role และ Scopes ในแถวนั้นทันที
				const accessToken = await jwt.sign({
					iss: 'yae-core',
					sub: serviceRow.name,
					role: serviceRow.role, // ดึงจาก Enum ตารางจริง
					aud: 'yae-backend',
					iat: true,
					scopes: serviceRow.scopes, // ดึง Array สิทธิ์จาก Enum ตารางจริง
				})

				return {
					access_token: accessToken,
				}
			} catch (error) {
				console.error(
					`❌ Failed to process service access for [${serviceName}]:`,
					error,
				)
				return status(500, 'Internal Server Error')
			}
		},
		{
			headers: AuthModel.GetAccessHeader,
		},
	)
