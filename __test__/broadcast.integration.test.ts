// src/__test__/broadcast.integration.test.ts

import {
	afterAll,
	beforeAll,
	beforeEach,
	describe,
	expect,
	test,
} from 'bun:test'

import { jwt } from '@elysiajs/jwt'
import { Elysia } from 'elysia'

import { getDatabaseKeys } from '@/lib/auth/env'
import { redis } from '@/lib/redis' // หอคอยเชื่อมต่อ ioredis-mock ของเราค่ะ
import { broadcast } from '@/modules/broadcast'
import type { BroadcastModel } from '@/modules/broadcast/model'
import { BroadcastService } from '@/modules/broadcast/service'

const REDIS_KEY = 'broadcast:statuses'

describe('Broadcast WebSocket Integration', () => {
	let app: ReturnType<typeof createApp>
	let port: number
	let validToken: string

	function createApp() {
		return new Elysia().use(broadcast).listen(0)
	}

	async function signToken(payload: Record<string, string | number | boolean>) {
		const secret = await getDatabaseKeys('SERVICE_JWT_SECRET')

		const signerApp = new Elysia()
			.use(jwt({ name: 'jwt', secret }))
			.get(
				'/api/get-access',
				async ({ jwt: jwtPlugin }) => await jwtPlugin.sign(payload),
			)

		const response = await signerApp.handle(
			new Request('http://localhost/api/get-access'),
		)
		return response.text()
	}

	function connect(token?: string): WebSocket {
		const headers: Record<string, string> = {}
		if (token) headers.Authorization = `Bearer ${token}`

		return new WebSocket(`ws://localhost:${port}/broadcast`, {
			headers,
		} as Record<string, unknown> as unknown as string[])
	}

	function waitForOpen(ws: WebSocket) {
		return new Promise<void>((resolve, reject) => {
			const timer = setTimeout(() => reject(new Error('WS open timeout')), 1000)
			ws.addEventListener('open', () => {
				clearTimeout(timer)
				resolve()
			})
			ws.addEventListener('error', (err) => {
				clearTimeout(timer)
				reject(err)
			})
		})
	}

	function waitForClose(ws: WebSocket) {
		return new Promise<{ code: number; reason: string }>((resolve, reject) => {
			const timer = setTimeout(
				() => reject(new Error('WS close timeout')),
				1000,
			)
			ws.addEventListener('close', (event) => {
				clearTimeout(timer)
				const e = event as unknown as { code: number; reason: string }
				resolve({ code: e.code, reason: e.reason })
			})
		})
	}

	function waitForMessage(ws: WebSocket) {
		return new Promise<string>((resolve, reject) => {
			const timer = setTimeout(() => reject(new Error('Message timeout')), 1000)
			ws.addEventListener('message', (event) => {
				clearTimeout(timer)
				resolve(event.data as string)
			})
		})
	}

	beforeAll(async () => {
		app = createApp()
		port = app.server?.port || 3000
		validToken = await signToken({ sub: 'test-service' })
		await Bun.sleep(50)
	})

	afterAll(async () => {
		app.stop()
		// ✅ ใช้ disconnect() เพื่อเคลียร์คิวประมวลผลค้างท่อใน ioredis-mock ให้เกลี้ยงสนิทค่ะ
		await redis.disconnect()
	})

	beforeEach(async () => {
		await redis.del(REDIS_KEY)
	})

	test('rejects connection with no token', async () => {
		const ws = connect()

		try {
			await waitForOpen(ws)
			const { code, reason } = await waitForClose(ws)
			expect(code).toBe(4001)
			expect(reason).toBe('Unauthorized')
		} catch {
			ws.close()
		}
	})

	test('rejects connection with invalid token', async () => {
		const ws = connect('abc.def.ghi')

		try {
			await waitForOpen(ws)
			const { code, reason } = await waitForClose(ws)
			expect(code).toBe(4001)
			expect(reason).toBe('Invalid Token')
		} catch {
			ws.close()
		}
	})

	test('accepts valid token and relays status messages', async () => {
		const ws = connect(validToken)
		await waitForOpen(ws)

		try {
			const payload: BroadcastModel.Status = {
				service_name: 'yae-bot',
				status: 'online',
				timestamp: new Date(),
			}

			ws.send(JSON.stringify(payload))
			await Bun.sleep(50)

			const stored = await BroadcastService.getAllStatuses()
			expect(stored.length).toBe(1)
			expect(stored[0].service_name).toBe('yae-bot')
			expect(stored[0].status).toBe('online')
		} finally {
			ws.close()
		}
	})

	test('sends existing statuses on connect', async () => {
		await BroadcastService.updateStatus(
			{
				service_name: 'yae-backend',
				status: 'running',
				timestamp: new Date(),
			},
			'mock-existing-ws-id',
		)

		const ws = connect(validToken)
		await waitForOpen(ws)

		try {
			const raw = await waitForMessage(ws)
			const parsed = JSON.parse(raw) as BroadcastModel.Status[]

			expect(parsed.length).toBe(1)
			expect(parsed[0].service_name).toBe('yae-backend')
			expect(parsed[0].status).toBe('running')
		} finally {
			ws.close()
		}
	})

	test('removes status and broadcasts offline on disconnect', async () => {
		const wsA = connect(validToken)
		await waitForOpen(wsA)

		wsA.send(
			JSON.stringify({
				service_name: 'yae-engine',
				status: 'online',
				timestamp: new Date(),
			} satisfies BroadcastModel.Status),
		)

		// ✅ เพิ่มเวลากล่อมระบบนิดนึงเพื่อให้เซิร์ฟเวอร์จับคู่จองห้องระหว่าง wsA กับ 'yae-engine' ในแรมเสร็จสมบูรณ์ชัวร์ ๆ ค่ะ
		await Bun.sleep(100)

		const wsB = connect(validToken)
		await waitForOpen(wsB)
		await waitForMessage(wsB) // ล้างข้อมูลสถานะเริ่มต้นที่ค้างในกระแสท่อทิ้งไปก่อนค่ะ

		const offlinePromise = waitForMessage(wsB)

		// สั่งปิดการเชื่อมต่อท่อ A ตอนที่ท่อ B เปิดสแตนด์บายรอฟังอยู่แล้ว
		wsA.close()

		const raw = await offlinePromise
		const parsed = JSON.parse(raw) as BroadcastModel.Status[]

		expect(parsed[0].service_name).toBe('yae-engine')
		expect(parsed[0].status).toBe('offline')

		const stored = await BroadcastService.getAllStatuses()
		expect(stored.length).toBe(0)

		wsB.close()
	})
})
