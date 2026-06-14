// src/modules/broadcast/__test__/edgeCase.test.ts

import { beforeEach, describe, expect, it } from 'bun:test'

import type { BroadcastModel } from '@/modules/broadcast/model'
import { BroadcastService } from '@/modules/broadcast/service'

describe('edge cases', () => {
	beforeEach(() => {
		BroadcastService.latestStatus.clear()
	})
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
