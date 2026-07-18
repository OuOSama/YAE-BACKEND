import { Elysia } from 'elysia';
import logixlysia from 'logixlysia';

export const yaeLogger = new Elysia({ name: 'yae-logger' }).use(
	logixlysia({
		config: {
			service: 'api-server',
			showStartupMessage: true,
			startupMessageFormat: 'banner',
			showContextTree: true,
			contextDepth: 2,
			slowThreshold: 500,
			verySlowThreshold: 1000,
			timestamp: {
				translateTime: 'yyyy-mm-dd HH:MM:ss.SSS',
			},
			ip: true,
		},
	}),
);
