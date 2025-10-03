# Tâche 18.3 : Cache côté serveur

## Redis pour le cache
```typescript
// config/redis.ts
import { redisManager } from '@adonisjs/redis/services/main'

export default class CacheService {
  async get<T>(key: string): Promise<T | null> {
    const cached = await redisManager.get(key)
    return cached ? JSON.parse(cached) : null
  }

  async set(key: string, value: any, ttl: number = 3600) {
    await redisManager.setex(key, ttl, JSON.stringify(value))
  }

  async del(key: string) {
    await redisManager.del(key)
  }
}
```

## Cache des données statiques
```typescript
class GameDataService {
  private cache = new CacheService()

  async getObjectives(): Promise<ObjectiveDefinition[]> {
    const cached = await this.cache.get<ObjectiveDefinition[]>('objectives:all')

    if (cached) return cached

    const objectives = await this.loadObjectives()
    await this.cache.set('objectives:all', objectives, 86400) // 24h

    return objectives
  }
}
```

## Cache HTTP avec Nginx
```nginx
location /api/static/ {
    proxy_pass http://localhost:3333;
    proxy_cache my_cache;
    proxy_cache_valid 200 1h;
    proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;
    add_header X-Cache-Status $upstream_cache_status;
}
```
