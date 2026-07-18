import { Elysia } from 'elysia';
import { userManage } from '@/modules/users';
import { openApiPlugin } from './plugins/openapi';

const app = new Elysia()
	.use(openApiPlugin)
	.use(userManage)
	.get('/', () => 'Hello Elysia')
	.listen(process.env.PORT ?? 3000);

console.log(
	`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`,
);
