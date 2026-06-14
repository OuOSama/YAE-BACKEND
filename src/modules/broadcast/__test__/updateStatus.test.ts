// src/modules/broadcast/__test__/updateStatus.test.ts

import { beforeEach, describe, expect, it } from 'bun:test'

import type { BroadcastModel } from '@/modules/broadcast/model'
import { BroadcastService } from '@/modules/broadcast/service'

describe('updateStatus', () => {
	beforeEach(() => {
		BroadcastService.latestStatus.clear()
	})
	it('should add new status to the map', () => {
		const mockStatus: BroadcastModel.Status = {
			service_name: 'chat-service',
			status: 'online',
			timestamp: new Date(),
			message: 'Service is running smoothly',
		}

		BroadcastService.updateStatus(mockStatus)

		expect(BroadcastService.latestStatus.size).toBe(1)
		expect(BroadcastService.latestStatus.get('chat-service')).toEqual(
			mockStatus,
		)
	})

	it('should update existing status when service_name already exists', () => {
		const firstStatus: BroadcastModel.Status = {
			service_name: 'api-gateway',
			status: 'running',
			timestamp: new Date('2024-01-01'),
		}

		const updatedStatus: BroadcastModel.Status = {
			service_name: 'api-gateway',
			status: 'offline',
			timestamp: new Date('2024-01-02'),
			message: 'Maintenance mode',
		}

		BroadcastService.updateStatus(firstStatus)
		BroadcastService.updateStatus(updatedStatus)

		expect(BroadcastService.latestStatus.size).toBe(1)
		expect(BroadcastService.latestStatus.get('api-gateway')).toEqual(
			updatedStatus,
		)
	})

	it('should handle multiple different services', () => {
		const status1: BroadcastModel.Status = {
			service_name: 'auth-service',
			status: 'online',
			timestamp: new Date(),
		}

		const status2: BroadcastModel.Status = {
			service_name: 'payment-service',
			status: 'running',
			timestamp: new Date(),
		}

		BroadcastService.updateStatus(status1)
		BroadcastService.updateStatus(status2)

		expect(BroadcastService.latestStatus.size).toBe(2)
		expect(BroadcastService.latestStatus.get('auth-service')).toEqual(status1)
		expect(BroadcastService.latestStatus.get('payment-service')).toEqual(
			status2,
		)
	})
})
