// src/modules/broadcast/service.ts

import { redis } from '@/lib/redis'
import type { BroadcastModel } from './model'

export namespace BroadcastService {
	const REDIS_KEY = 'broadcast:statuses'

	export async function getAllStatuses(): Promise<BroadcastModel.Status[]> {
		try {
			const allStatuses = await redis.hgetall(REDIS_KEY)
			if (!allStatuses) return []

			return Object.values(allStatuses).map((statusStr) =>
				JSON.parse(statusStr as string),
			)
		} catch (error) {
			console.error('❌ Redis hgetall error:', error)
			return []
		}
	}

	export async function updateStatus(
		status: BroadcastModel.Status,
		wsId: string,
	): Promise<void> {
		try {
			const statusWithWsId = {
				...status,
				ws_id: wsId,
			}
			await redis.hset(
				REDIS_KEY,
				status.service_name,
				JSON.stringify(statusWithWsId),
			)
			console.log(
				`✅ Updated status for ${status.service_name} with ws.id: ${wsId}`,
			)
		} catch (error) {
			console.error('❌ Redis hset error:', error)
		}
	}

	// ✅ แก้ไข deleteStatus ให้รับ wsId และค้นหา service_name ก่อนลบ
	export async function deleteStatus(wsId: string): Promise<void> {
		try {
			// 1. ค้นหา service_name ที่มี ws_id นี้
			const serviceName = await getServiceNameByWsId(wsId)

			if (!serviceName) {
				console.log(`⚠️ No service found with ws.id: ${wsId}`)
				return
			}

			// 2. ลบข้อมูลออกจาก Redis
			await redis.hdel(REDIS_KEY, serviceName)
			console.log(
				`🗑️ Removed status for ${serviceName} (ws.id: ${wsId}) from Redis`,
			)
		} catch (error) {
			console.error('❌ Redis hdel error:', error)
		}
	}

	// ✅ ฟังก์ชันค้นหา service_name จาก ws_id
	export async function getServiceNameByWsId(
		wsId: string,
	): Promise<string | null> {
		try {
			const allStatuses = await redis.hgetall(REDIS_KEY)
			if (!allStatuses) return null

			for (const [serviceName, statusStr] of Object.entries(allStatuses)) {
				const status = JSON.parse(statusStr as string)
				if (status.ws_id === wsId) {
					return serviceName
				}
			}
			return null
		} catch (error) {
			console.error('❌ Redis search error:', error)
			return null
		}
	}

	// ✅ ฟังก์ชันดึง ws_id จาก service_name (เผื่อต้องการใช้)
	export async function getWsIdByServiceName(
		serviceName: string,
	): Promise<string | null> {
		try {
			const statusStr = await redis.hget(REDIS_KEY, serviceName)
			if (!statusStr) return null

			const status = JSON.parse(statusStr as string)
			return status.ws_id || null
		} catch (error) {
			console.error('❌ Redis hget error:', error)
			return null
		}
	}
}
