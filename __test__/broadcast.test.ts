// __test__/broadcast.test.ts

import {
	afterAll,
	beforeAll,
	beforeEach,
	describe,
	expect,
	it,
	test,
} from 'bun:test'
import Elysia from 'elysia'

import { broadcast } from 'src/modules/broadcast'
import type { BroadcastModel } from 'src/modules/broadcast/model'
import { BroadcastService } from 'src/modules/broadcast/service'

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

describe('Elysia with BroadcastService', () => {
	let app: ReturnType<typeof createApp>
	let port: number | undefined

	function createApp() {
		return new Elysia().use(broadcast).listen(0)
	}
	// Setup shared server once for all tests
	beforeAll(async () => {
		app = new Elysia().use(broadcast).listen(0)
		port = app.server?.port

		// Wait for server to be ready
		await Bun.sleep(50)
	})

	afterAll(() => {
		app.stop()
	})

	beforeEach(() => {
		BroadcastService.latestStatus.clear()
	})

	async function createWebSocket() {
		const ws = new WebSocket(`ws://localhost:${port}/broadcast`)
		await new Promise<void>((resolve) => {
			ws.addEventListener('open', () => resolve())
		})
		return ws
	}
	test('WebSocket open and message flow', async () => {
		const ws = await createWebSocket()

		try {
			const msg: BroadcastModel.Status = {
				service_name: 'test-service',
				status: 'online',
				timestamp: new Date(),
			}

			ws.send(JSON.stringify(msg))
			await Bun.sleep(50)

			const stored_service = BroadcastService.getAllStatuses()
			expect(stored_service.length).toBe(1)
			expect(stored_service[0].service_name).toBe('test-service')
			expect(stored_service[0].status).toBe('online')
		} finally {
			ws.close()
		}
	})

	test('should send existing statuses when client connects', async () => {
		BroadcastService.updateStatus({
			service_name: 'test',
			status: 'online',
			timestamp: new Date(),
		})

		const ws = await createWebSocket()

		try {
			const receivedMessage = await Promise.race([
				new Promise<string>((resolve) => {
					ws.addEventListener('message', (event) => {
						resolve(event.data)
					})
				}),
			])

			const parsed = JSON.parse(receivedMessage)
			expect(parsed.length).toBe(1)
			expect(parsed[0].service_name).toBe('test')
			expect(parsed[0].status).toBe('online')
		} finally {
			ws.close()
		}
	})

	test('should handle client disconnect properly', async () => {
		const ws = await createWebSocket()

		ws.close()
		await Bun.sleep(50)

		expect(ws.readyState).toBe(WebSocket.CLOSED)
	})
})
