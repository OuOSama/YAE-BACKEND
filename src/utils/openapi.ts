// src/utils/openapi.ts

import { openapi } from '@elysiajs/openapi'
import { Elysia } from 'elysia'

const isProd = process.env.NODE_ENV === 'production'

const docsPlugin = openapi({
	documentation: {
		info: {
			title: 'YAE Backend API',
			version: '1.0.0',
			description: 'Elysia backend for the YAE ecosystem.',
			license: {
				name: 'OuOSama',
				url: 'https://github.com/OuOSama/YAE-BACKEND',
			},
			contact: {
				name: 'OuOSama',
				url: 'https://github.com/OuOSama',
				email: 'real.ouosama@gmail.com',
			},
		},
	},
})

export const openapiPlugin = isProd ? new Elysia() : docsPlugin
