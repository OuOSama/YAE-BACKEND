import { Elysia } from 'elysia';

// lib
import { auth } from '@/lib/auth';

// modules
import { betterAuth } from '@/modules/auth/betterAuth';
import { userManage } from '@/modules/users';

// plugin
import { yaeCorsPlugin } from '@/plugins/cors';
import { openApiPlugin } from '@/plugins/openapi';

const app = new Elysia()
	.use(openApiPlugin)
	.use(yaeCorsPlugin)
	.use(userManage)
	.use(betterAuth)
	.get('/', () => 'Hello Elysia')
	.get('/user', ({ user }) => user, {
		auth: true,
	})
	.mount(auth.handler)
	.listen(process.env.PORT ?? 3001);

console.log(
	`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`,
);
