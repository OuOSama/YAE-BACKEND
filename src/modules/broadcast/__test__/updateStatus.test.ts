// src/modules/broadcast/__test__/updateStatus.test.ts

import { beforeEach, describe, expect, test } from 'bun:test'
import { redis } from '@/lib/redis' // คลีน ๆ เลยค่ะ
import type { BroadcastModel } from '@/modules/broadcast/model'
import { BroadcastService } from '@/modules/broadcast/service'

describe('update status in broadcast (ioredis-mock)', () => {
	const REDIS_KEY = 'broadcast:statuses'

	beforeEach(async () => {
		// เคลียร์ข้อมูลใน Memory Redis จำลองทุกครั้งก่อนเริ่มเคสใหม่
		// สั่ง flushall ทีเดียวเกลี้ยงแผง สะอาดสะอ้านแน่
		await redis.flushall()
	})

	test('✅ should successfully save service status into redis with ws_id', async () => {
		const mockStatus: BroadcastModel.Status = {
			service_name: 'yae-vtuber-gateway',
			status: 'running',
			timestamp: new Date(),
			message: 'System is healthy',
		}
		const mockWsId = 'ws-connection-xyz-123'

		// สั่งอัปเดตสถานะผ่าน Service หลัก (มันจะวิ่งเข้า ioredis-mock อัตโนมัติ)
		await BroadcastService.updateStatus(mockStatus, mockWsId)

		// ดึงข้อมูลออกมาเช็คผ่านช่องทางของ ioredis-mock
		const servicePayloadString = await redis.hget(
			REDIS_KEY,
			mockStatus.service_name,
		)

		// ✅ เช็คให้แน่ใจว่าได้ string แน่นอน ไม่ใช่ null
		expect(servicePayloadString).toBeTypeOf('string')

		// ✅ ใช้ Type Casting ด้วย 'as string' แทนการใช้เครื่องหมาย '!'
		const parsedPayload = JSON.parse(servicePayloadString as string)
		expect(parsedPayload.service_name).toBe(mockStatus.service_name)
		expect(parsedPayload.status).toBe('running')
		expect(parsedPayload.ws_id).toBe(mockWsId)
	})

	test('✅ should overwrite existing status when the same service updates again', async () => {
		const serviceName = 'delunium-game-server'
		const mockWsId = 'ws-id-456'

		const firstStatus: BroadcastModel.Status = {
			service_name: serviceName,
			status: 'online',
			timestamp: new Date(),
		}

		const secondStatus: BroadcastModel.Status = {
			service_name: serviceName,
			status: 'error',
			timestamp: new Date(),
			message: 'Database connection failed',
		}

		await BroadcastService.updateStatus(firstStatus, mockWsId)
		await BroadcastService.updateStatus(secondStatus, mockWsId)

		const allStatuses = await BroadcastService.getAllStatuses()

		// ตรวจสอบว่าโดนเขียนทับข้อมูลใน Hash field เดิมเรียบร้อย
		expect(allStatuses.length).toBe(1)
		expect(allStatuses[0].status).toBe('error')
		expect(allStatuses[0].message).toBe('Database connection failed')
	})
})
