// src/modules/broadcast/service.ts

import type { BroadcastModel } from './model'

export namespace BroadcastService {
	export const latestStatus = new Map<string, BroadcastModel.Status>()

	export function getAllStatuses(): BroadcastModel.Status[] {
		return Array.from(latestStatus.values())
	}

	export function updateStatus(status: BroadcastModel.Status): void {
		latestStatus.set(status.service_name, status)
	}
}
