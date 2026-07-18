import { Elysia } from 'elysia';
import { userManage } from '@/modules/users';
import { auth } from './lib/auth';
import { yaeCors } from './plugins/cors';
import { openApiPlugin } from './plugins/openapi';

const app = new Elysia()
	.use(openApiPlugin)
	.use(yaeCors)
	.use(userManage)
	.get('/', () => 'Hello Elysia')
	.mount(auth.handler)
	.listen(process.env.PORT ?? 3000);

console.log(
	`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`,
);
