// src/index.ts

import cluster from 'node:cluster'
import os from 'node:os'
import process from 'node:process'

if (cluster.isPrimary) {
	const workerCount = Math.max(
		1,
		Number(process.env.CLUSTER_WORKERS ?? os.availableParallelism()),
	)

	for (let i = 0; i < workerCount; i++) cluster.fork()
} else {
	const { app } = await import('./app')
	const port = Number(process.env.PORT ?? 3001)

	app.listen(port)
	console.log(
		`Worker ${process.pid} started on http://${app.server?.hostname}:${app.server?.port}`,
	)
}
