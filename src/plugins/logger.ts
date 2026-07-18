import logixlysia from 'logixlysia';

export const yaeLoggerPlugin = logixlysia({
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
});

export const yaeLogger = yaeLoggerPlugin.store.pino;
