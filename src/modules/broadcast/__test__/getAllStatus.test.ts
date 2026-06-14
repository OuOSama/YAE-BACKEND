// src/modules/broadcast/__test__/getAllStatus.test.ts

import { beforeEach, describe, expect, it } from 'bun:test'

import type { BroadcastModel } from '@/modules/broadcast/model'
import { BroadcastService } from '@/modules/broadcast/service'

describe('getAllStatuses', () => {
	beforeEach(() => {
		BroadcastService.latestStatus.clear()
	})
	it('should return empty array when no statuses exist', () => {
		const statuses = BroadcastService.getAllStatuses()

		expect(statuses).toBeArray()
		expect(statuses).toHaveLength(0)
	})

	it('should return all statuses as an array', () => {
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

		BroadcastService.updateStatus(status1)
		BroadcastService.updateStatus(status2)

		const statuses = BroadcastService.getAllStatuses()

		expect(statuses).toHaveLength(2)
		expect(statuses).toContainEqual(status1)
		expect(statuses).toContainEqual(status2)
	})

	it('should return the latest status when service is updated multiple times', () => {
		const oldStatus: BroadcastModel.Status = {
			service_name: 'worker',
			status: 'offline',
			timestamp: new Date('2024-01-01'),
		}

		const newStatus: BroadcastModel.Status = {
			service_name: 'worker',
			status: 'online',
			timestamp: new Date('2024-01-02'),
		}

		BroadcastService.updateStatus(oldStatus)
		BroadcastService.updateStatus(newStatus)

		const statuses = BroadcastService.getAllStatuses()

		expect(statuses).toHaveLength(1)
		expect(statuses[0]).toEqual(newStatus)
	})
})
