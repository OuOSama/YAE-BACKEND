import { Elysia } from 'elysia';

// modules
import { userManage } from '@/modules/users';

// plugin
import { yaeAuthPlugin } from '@/plugins/betterAuth';
import { yaeCorsPlugin } from '@/plugins/cors';
import { yaeLoggerPlugin } from '@/plugins/logger';
import { memCheckPlugin } from '@/plugins/mem-check';
import { yaeOpenApiPlugin } from '@/plugins/openapi';

const app = new Elysia({ name: 'YAE-BACKEND' })
	.use(yaeLoggerPlugin)
	.use(yaeOpenApiPlugin)
	.use(yaeCorsPlugin)
	.use(yaeAuthPlugin)
	.use(memCheckPlugin)
	.use(userManage)
	.get('/', () => 'Hello Elysia')
	.get('/user', ({ user }) => user, {
		auth: true,
	});

app.listen(process.env.PORT ?? 3001);
