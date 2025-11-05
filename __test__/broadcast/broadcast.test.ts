// __test__/broadcast/broadcast.test.ts

import {
	afterAll,
	beforeAll,
	beforeEach,
	describe,
	expect,
	test,
} from 'bun:test'
import Elysia from 'elysia'
import { broadcast } from '../../src/modules/broadcast'
import type { BroadcastModel } from '../../src/modules/broadcast/model'
import { BroadcastService } from '../../src/modules/broadcast/service'

describe('Test broadcast service', () => {
	beforeEach(() => {
		BroadcastService.latestStatus.clear()
	})

	test('should update and retrieve statuses', () => {
		const mock_service: BroadcastModel.Status = {
			service_name: 'test service',
			status: 'online',
			timestamp: new Date(),
			message: 'This is test simple',
		}
		BroadcastService.updateStatus(mock_service)

		const data = BroadcastService.getAllStatuses()

		expect(data.length).toBe(1)
		expect(data[0].service_name).toBe('test service')
		expect(data[0].status).toBe('online')
		expect(data[0].message).toBe('This is test simple')
	})

	test('should override status if service_name already exists', () => {
		const s1: BroadcastModel.Status = {
			service_name: 'backend',
			status: 'offline',
			timestamp: new Date(),
		}

		const s2: BroadcastModel.Status = {
			service_name: 'backend',
			status: 'running',
			timestamp: new Date(),
		}

		const s3: BroadcastModel.Status = {
			service_name: 'backend',
			status: 'online',
			timestamp: new Date(),
		}

		BroadcastService.updateStatus(s1)
		BroadcastService.updateStatus(s2)
		BroadcastService.updateStatus(s3)

		const service = BroadcastService.getAllStatuses()
		expect(service.length).toBe(1)
		expect(service[0].service_name).toBe('backend')
		expect(service[0].status).toBe('online')
	})
})

describe('Test WebSocket', () => {
	let app: Elysia
	let port: number | undefined

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
