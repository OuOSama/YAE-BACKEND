// src/modules/broadcast/index.ts

import { jwt } from '@elysiajs/jwt'
import { Elysia } from 'elysia'
import { getDatabaseKeys } from '@/lib/auth/env'
import { BroadcastModel } from './model'
import { BroadcastService } from './service'

const jwtSecretFromDb = await getDatabaseKeys('SERVICE_JWT_SECRET')

export const broadcast = new Elysia()
	.use(
		jwt({
			name: 'jwt',
			secret: jwtSecretFromDb,
		}),
	)
	.ws('/broadcast', {
		body: BroadcastModel.Status,

		async open(ws) {
			ws.subscribe('broadcast')

			const authHeader = ws.data.headers.authorization
			const token = authHeader?.split(' ')[1]

			if (!token) {
				ws.close(4001, 'Unauthorized')
				return
			}

			const payload = await ws.data.jwt.verify(token)
			if (!payload) {
				ws.close(4001, 'Invalid Token')
				return
			}

			console.log(payload)

			const statuses = await BroadcastService.getAllStatuses()
			if (statuses.length > 0) {
				ws.send(JSON.stringify(statuses))
			}
			console.log(statuses)
		},

		async close(ws) {
			ws.unsubscribe('broadcast')

			// ✅ 1. ต้องตามล่าหาชื่อ service_name จาก ws.id เก็บไว้ก่อนที่มันจะโดนลบค่ะ!
			const serviceName = await BroadcastService.getServiceNameByWsId(ws.id)

			// ✅ 2. พอได้ชื่อมาเซฟเก็บไว้ในตัวแปรแล้ว ค่อยสั่งลบข้อมูลออกจาก Redis อย่างปลอดภัย
			await BroadcastService.deleteStatus(ws.id)

			if (serviceName) {
				// แจ้งเตือน service อื่นๆ ว่าตัวนี้เดี้ยงไปแล้ว
				const offlinePayload = {
					service_name: serviceName,
					status: 'offline',
					timestamp: new Date().toISOString(),
					ws_id: ws.id,
				}
				ws.publish('broadcast', JSON.stringify([offlinePayload]))
			} else {
				console.log(
					`⚠️ No service found for ws.id: ${ws.id}, skip offline broadcast`,
				)
			}
		},

		async message(ws, message) {
			await BroadcastService.updateStatus(message, ws.id)

			const messageWithWsId = {
				...message,
				ws_id: ws.id,
			}

			ws.publish('broadcast', JSON.stringify([messageWithWsId]))
		},
	})
