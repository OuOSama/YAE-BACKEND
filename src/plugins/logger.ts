import { Elysia } from 'elysia';
import logixlysia from 'logixlysia';

export const logixlysiaPlugin = logixlysia({
	config: {
		service: 'yae-server',
		showStartupMessage: true,
		startupMessageFormat: 'banner',
		slowThreshold: 500,
		verySlowThreshold: 1000,
		timestamp: {
			translateTime: 'yyyy-mm-dd HH:MM:ss.SSS',
		},
		ip: true,
		autoRedact: true,
		pino: { level: 'debug' },
	},
});

export const yaeLoggerPlugin = new Elysia({ name: 'yae-logger' })
	.use(logixlysiaPlugin)
	.as('global');
