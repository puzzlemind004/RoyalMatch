# Tâche 18.2 : Compression des données

## Compression HTTP (Nginx)
```nginx
# /etc/nginx/nginx.conf
http {
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/rss+xml
        font/truetype
        font/opentype
        application/vnd.ms-fontobject
        image/svg+xml;
}
```

## Compression côté serveur (AdonisJS)
```typescript
// start/kernel.ts
Server.middleware.register([
  () => import('@adonisjs/core/bodyparser_middleware'),
  () => import('@adonisjs/compress')
])
```

## Minification frontend
```json
// angular.json
{
  "configurations": {
    "production": {
      "optimization": true,
      "outputHashing": "all",
      "sourceMap": false,
      "namedChunks": false,
      "aot": true,
      "extractLicenses": true,
      "vendorChunk": false,
      "buildOptimizer": true
    }
  }
}
```

## Compression des images
- Utiliser WebP au lieu de PNG/JPG
- Lazy loading des images
- Sprites pour les icônes
