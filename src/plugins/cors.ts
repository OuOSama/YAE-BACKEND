import { cors } from '@elysia/cors';
import { Elysia } from 'elysia';

export const yaeCors = new Elysia().use(
	cors({
		origin: process.env.BACKEND_URL,
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
		credentials: true,
		allowedHeaders: ['Content-Type', 'Authorization'],
	}),
);
