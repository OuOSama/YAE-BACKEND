import { cors } from '@elysia/cors';
import { Elysia } from 'elysia';

export const yaeCorsPlugin = new Elysia().use(
	cors({
		origin: process.env.FRONTEND_URL,
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
		credentials: true,
		allowedHeaders: ['Content-Type', 'Authorization'],
	}),
);
