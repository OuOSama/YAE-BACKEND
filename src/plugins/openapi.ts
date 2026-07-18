import { openapi } from '@elysia/openapi';
import { Elysia } from 'elysia';

const isDev = process.env.NODE_ENV !== 'production';

export const openApiPlugin = isDev
	? new Elysia().use(
			openapi({
				documentation: {
					info: {
						title: 'YAE Backend API',
						version: '1.0.0',
						description: 'Elysia backend for the YAE ecosystem.',
						license: {
							name: 'MIT',
							url: 'https://github.com/OuOSama/YAE-BACKEND/blob/main/LICENSE',
						},
					},
					components: {
						securitySchemes: {
							bearerAuth: {
								type: 'http',
								scheme: 'bearer',
								bearerFormat: 'JWT',
							},
						},
					},
				},
			}),
		)
	: new Elysia();
