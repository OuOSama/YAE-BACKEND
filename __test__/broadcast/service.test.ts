// __test__/broadcast/service.test.ts

import { beforeEach, describe, expect, it } from 'bun:test'
import type { BroadcastModel } from '../../src/modules/broadcast/model'
import { BroadcastService } from '../../src/modules/broadcast/service'

describe('BroadcastService', () => {
	beforeEach(() => {
		BroadcastService.latestStatus.clear()
	})

	describe('updateStatus', () => {
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

	describe('getAllStatuses', () => {
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

		it('should return the latest status for each service', () => {
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

	describe('edge cases', () => {
		it('should handle error status', () => {
			const errorStatus: BroadcastModel.Status = {
				service_name: 'broken-service',
				status: 'error',
				timestamp: new Date(),
				message: 'Connection timeout',
			}

			BroadcastService.updateStatus(errorStatus)

			expect(BroadcastService.latestStatus.get('broken-service')?.status).toBe(
				'error',
			)
		})

		it('should handle status without optional message', () => {
			const minimalStatus: BroadcastModel.Status = {
				service_name: 'minimal-service',
				status: 'running',
				timestamp: new Date(),
			}

			BroadcastService.updateStatus(minimalStatus)

			const retrieved = BroadcastService.latestStatus.get('minimal-service')
			expect(retrieved?.message).toBeUndefined()
		})
	})
})
