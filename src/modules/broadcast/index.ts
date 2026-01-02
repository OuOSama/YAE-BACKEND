// src/modules/broadcast/index.ts

import { Elysia } from 'elysia'
import { BroadcastModel } from './model'
import { BroadcastService } from './service'

export const broadcast = new Elysia().ws('/broadcast', {
	body: BroadcastModel.Status,
	open(ws) {
		ws.subscribe('broadcast')
		const statuses = BroadcastService.getAllStatuses()
		if (statuses.length > 0) {
			ws.send(JSON.stringify(statuses))
		}
	},

	close(ws) {
		ws.unsubscribe('broadcast')
	},

	message(ws, message) {
		BroadcastService.updateStatus(message)
		ws.publish('broadcast', JSON.stringify([message]))
	},
})
