import { Elysia } from 'elysia';
import { openApiPlugin } from './plugins/openapi';

const app = new Elysia()
	.use(openApiPlugin)
	.get('/', () => 'Hello Elysia')
	.listen(process.env.PORT ?? 3000);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
