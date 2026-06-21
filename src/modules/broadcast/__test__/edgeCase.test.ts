// src/modules/broadcast/__test__/edgeCase.test.ts

import { beforeEach, describe, expect, it } from 'bun:test'
import { redis } from '@/lib/redis' // นำเข้าท่อจำลองมาจัดการล้างข้อมูลในแรม
import type { BroadcastModel } from '@/modules/broadcast/model'
import { BroadcastService } from '@/modules/broadcast/service'

describe('edge cases (ioredis-mock)', () => {
	const REDIS_KEY = 'broadcast:statuses'
	const mockWsId = 'edge-case-ws-999'

	// 🧹 เคลียร์สนามจำลองก่อนเริ่มรันเคสใหม่ทุกครั้ง
	beforeEach(async () => {
		await redis.flushall()
	})

	it('should handle error status', async () => {
		const errorStatus: BroadcastModel.Status = {
			service_name: 'broken-service',
			status: 'error',
			timestamp: new Date(),
			message: 'Connection timeout',
		}

		// ยิงอัปเดตสถานะแบบ Asynchronous เข้าระบบ
		await BroadcastService.updateStatus(errorStatus, mockWsId)

		// ขุดข้อมูลจาก Redis มาเช็คว่าบันทึกประเภทสถานะ 'error' ลงไปได้สมบูรณ์ไหม
		const storedJson = await redis.hget(REDIS_KEY, 'broken-service')
		expect(storedJson).not.toBeNull()

		if (storedJson) {
			const parsed = JSON.parse(storedJson)
			expect(parsed.status).toBe('error')
			expect(parsed.message).toBe('Connection timeout')
		}
	})

	it('should handle status without optional message', async () => {
		const minimalStatus: BroadcastModel.Status = {
			service_name: 'minimal-service',
			status: 'running',
			timestamp: new Date(),
			// message เป็น optional เลยไม่ต้องส่งมาในเคสนี้ค่ะ
		}

		await BroadcastService.updateStatus(minimalStatus, mockWsId)

		const storedJson = await redis.hget(REDIS_KEY, 'minimal-service')
		expect(storedJson).not.toBeNull()

		if (storedJson) {
			const parsed = JSON.parse(storedJson)
			expect(parsed.service_name).toBe('minimal-service')
			expect(parsed.status).toBe('running')

			// เช็คว่าฟิลด์ตัวเลือกเดี้ยง/ว่างเปล่าจริง ๆ ตามกฎกติกาของ Linter (ไม่ใช้เครื่องหมาย !)
			expect(parsed.message).toBeUndefined()
		}
	})
})
