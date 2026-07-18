import { Elysia } from 'elysia';

// modules
import { userManage } from '@/modules/users';

// plugin
import { yaeAuthPlugin } from '@/plugins/betterAuth';
import { yaeCorsPlugin } from '@/plugins/cors';
import { yaeOpenApiPlugin } from './plugins/openapi';

const app = new Elysia()
	.use(yaeOpenApiPlugin)
	.use(yaeCorsPlugin)
	.use(yaeAuthPlugin)
	.use(userManage)
	.get('/', () => 'Hello Elysia')
	.get('/user', ({ user }) => user, {
		auth: true,
	})
	.listen(process.env.PORT ?? 3001);

console.log(
	`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`,
);
