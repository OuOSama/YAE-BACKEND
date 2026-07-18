import { Elysia } from 'elysia';

export const memCheckPlugin = new Elysia()
	.get('/mem', () => {
		const before = process.memoryUsage();

		Bun.gc(true);

		const after = process.memoryUsage();

		return {
			beforeGC: {
				heapUsed: formatBytes(before.heapUsed),
				rss: formatBytes(before.rss),
			},
			afterGC: {
				heapUsed: formatBytes(after.heapUsed),
				rss: formatBytes(after.rss),
			},
		};
	})
	.onStart(() => {
		setInterval(() => {
			Bun.gc(true);
			const mem = process.memoryUsage();
			console.log(
				`[MEM CHECK] Heap Used: ${formatBytes(mem.heapUsed)} | RSS: ${formatBytes(mem.rss)}`,
			);
		}, 10000);
	});

function formatBytes(bytes: number) {
	if (bytes < 1024) return `${bytes} B`;
	const mb = bytes / (1024 * 1024);
	return `${mb.toFixed(2)} MB`;
}
