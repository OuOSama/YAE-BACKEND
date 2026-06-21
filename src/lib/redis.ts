// src/lib/redis.ts
import Redis from 'ioredis'

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'

export const redis =
	process.env.NODE_ENV === 'test'
		? new (require('ioredis-mock'))() // 💻 รันตอนเทส: สลับร่างเป็นตู้เซฟจำลองใน Memory ทันที
		: new Redis(redisUrl) // 🚀 รันบนระบบจริง: เชื่อมต่อท่อตรงเข้า Redis Server ปกติ
