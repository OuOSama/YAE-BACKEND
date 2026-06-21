// src/modules/broadcast/__test__/getAllStatus.test.ts

import { beforeEach, describe, expect, it } from 'bun:test'
import { redis } from '@/lib/redis' // ดึงตัวแปรเชื่อมต่อจำลองมาเคลียร์แรมค่ะ
import type { BroadcastModel } from '@/modules/broadcast/model'
import { BroadcastService } from '@/modules/broadcast/service'

describe('getAllStatuses (ioredis-mock)', () => {
	const mockWsId = 'test-ws-id-123'

	// 🧹 เคลียร์ถังข้อมูล Redis จำลองให้สะอาดหมดจดทุกครั้งก่อนเริ่มแต่ละเคส
	beforeEach(async () => {
		await redis.flushall()
	})

	it('should return empty array when no statuses exist', async () => {
		// เปลี่ยนมาเติม await เพื่อรองรับ Asynchronous Method ของจริงค่ะ
		const statuses = await BroadcastService.getAllStatuses()

		expect(statuses).toBeArray()
		expect(statuses).toHaveLength(0)
	})

	it('should return all statuses as an array', async () => {
		const status1: BroadcastModel.Status = {
			service_name: 'database',
			status: 'online',
			timestamp: new Date(),
		}

		const status2: BroadcastModel.Status = {
			service_name: 'cache',
			status: 'running',
			timestamp: new Date(),
		}

		// สั่งอัปเดตผ่าน async/await และส่ง wsId ประกบเข้าไปตามกฎของฟังก์ชันปัจจุบันค่ะ
		await BroadcastService.updateStatus(status1, mockWsId)
		await BroadcastService.updateStatus(status2, mockWsId)

		const statuses = await BroadcastService.getAllStatuses()

		expect(statuses).toHaveLength(2)

		// ตรวจสอบข้อมูลภายใน Object โดยเช็คคุณสมบัติหลัก เพราะในระบบจริงจะมีการแนบ ws_id เพิ่มเข้ามาด้วยค่ะ
		const dbStatus = statuses.find((s) => s.service_name === 'database')
		const cacheStatus = statuses.find((s) => s.service_name === 'cache')

		expect(dbStatus).toBeDefined()
		expect(dbStatus?.status).toBe('online')

		expect(cacheStatus).toBeDefined()
		expect(cacheStatus?.status).toBe('running')
	})

	it('should return the latest status when service is updated multiple times', async () => {
		const serviceName = 'worker'

		const oldStatus: BroadcastModel.Status = {
			service_name: serviceName,
			status: 'offline',
			timestamp: new Date('2024-01-01'),
		}

		const newStatus: BroadcastModel.Status = {
			service_name: serviceName,
			status: 'online',
			timestamp: new Date('2024-01-02'),
		}

		// ยิงอัปเดตซ้ำที่ชื่อ Service เดิมเพื่อจำลองการโดน Overwrite ใน Redis Hashes
		await BroadcastService.updateStatus(oldStatus, mockWsId)
		await BroadcastService.updateStatus(newStatus, mockWsId)

		const statuses = await BroadcastService.getAllStatuses()

		// ใน Redis Hashes ฟิลด์ที่ซ้ำกันจะโดนเขียนทับทันที ความยาวเลยต้องเหลือ 1 ค่ะ
		expect(statuses).toHaveLength(1)
		expect(statuses[0].service_name).toBe(serviceName)
		expect(statuses[0].status).toBe('online')
	})
})
