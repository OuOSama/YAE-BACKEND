// src/__test__/broadcast.integration.test.ts

import {
	afterAll,
	beforeAll,
	beforeEach,
	describe,
	expect,
	test,
} from 'bun:test'
import Elysia from 'elysia'

import { broadcast } from '@/modules/broadcast'
import type { BroadcastModel } from '@/modules/broadcast/model'
import { BroadcastService } from '@/modules/broadcast/service'

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
