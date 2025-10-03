# Tâche 17.5 : Monitoring et alertes

## PM2 Monitoring
```bash
# Démarrer l'application avec PM2
pm2 start server.js --name royalmatch-api

# Configurer PM2 pour démarrer au boot
pm2 startup
pm2 save

# Monitoring en temps réel
pm2 monit

# Logs
pm2 logs royalmatch-api
```

## UptimeRobot (gratuit)
1. Créer un compte sur uptimerobot.com
2. Ajouter un monitor HTTP(S)
   - URL: https://votre-domaine.com/api/health
   - Interval: 5 minutes
3. Configurer les alertes (email/SMS)

## Endpoint de health check
```typescript
// app/Controllers/Http/HealthController.ts
export default class HealthController {
  async check({ response }: HttpContext) {
    try {
      // Vérifier la BDD
      await Database.rawQuery('SELECT 1')

      return response.ok({
        status: 'healthy',
        timestamp: new Date(),
        uptime: process.uptime()
      })
    } catch (error) {
      return response.serviceUnavailable({
        status: 'unhealthy',
        error: error.message
      })
    }
  }
}
```

## Grafana + Prometheus (optionnel, avancé)
```yaml
# docker-compose.monitoring.yml
version: '3'
services:
  prometheus:
    image: prom/prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"

  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
```
