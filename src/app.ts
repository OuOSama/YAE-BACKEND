import { Elysia } from 'elysia';

// modules
import { userManage } from '@/modules/users';

// plugin
import { yaeAuthPlugin } from '@/plugins/betterAuth';
import { yaeCorsPlugin } from '@/plugins/cors';
import { yaeLogger } from '@/plugins/logger';
import { yaeOpenApiPlugin } from './plugins/openapi';

const app = new Elysia()
	.use(yaeLogger)
	.use(yaeOpenApiPlugin)
	.use(yaeCorsPlugin)
	.use(yaeAuthPlugin)
	.use(userManage)
	.get('/', () => 'Hello Elysia')
	.get('/user', ({ user }) => user, {
		auth: true,
	})
	.get('/users/:id', ({ request, store, params }) => {
		store.logger.mergeContext(request, { userId: params.id });
		return { ok: true };
	})
	.listen(process.env.PORT ?? 3001);

console.log(
	`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`,
);
