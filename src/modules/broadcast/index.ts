// src/modules/broadcast/index.ts

import { Elysia } from 'elysia'
import { BroadcastModel } from './model'
import { BroadcastService } from './service'

export const broadcast = new Elysia().ws('/broadcast', {
	body: BroadcastModel.Status,

	open(ws) {
		ws.subscribe('broadcast')
		console.log('🔌 New client connected')

		const statuses = BroadcastService.getAllStatuses()
		if (statuses.length > 0) {
			ws.send(JSON.stringify(statuses))
		}
	},

	close(ws) {
		ws.unsubscribe('broadcast')
		console.log('👋 Client disconnected')
	},

	message(ws, message) {
		BroadcastService.updateStatus(message)
		ws.publish('broadcast', JSON.stringify([message]))
		console.log('✅', message.service_name, '→', message.status)
	},
})
