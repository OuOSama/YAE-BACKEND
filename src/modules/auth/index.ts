// src/modules/auth/index.ts

import cors from '@elysiajs/cors'
import Elysia from 'elysia'
import { serviceAuth, userAuth } from 'src/lib/auth'

export const authRoute = new Elysia()
	// frontend
	.use(cors({ origin: ['http://localhost:3000'], credentials: true }))
	// user auth
	.mount(userAuth.handler)
	// service auth
	.use(serviceAuth)
