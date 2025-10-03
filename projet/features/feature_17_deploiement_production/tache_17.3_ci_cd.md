# Tâche 17.3 : CI/CD (GitHub Actions)

## Workflow GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies (backend)
        working-directory: ./server
        run: npm ci

      - name: Run tests (backend)
        working-directory: ./server
        run: npm test

      - name: Install dependencies (frontend)
        working-directory: ./client
        run: npm ci

      - name: Run tests (frontend)
        working-directory: ./client
        run: npm test

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Build backend
        working-directory: ./server
        run: |
          npm ci
          node ace build --production

      - name: Build frontend
        working-directory: ./client
        run: |
          npm ci
          npm run build --configuration=production

      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-artifacts
          path: |
            server/build
            client/dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Download artifacts
        uses: actions/download-artifact@v3
        with:
          name: build-artifacts

      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /var/www/royalmatch
            git pull origin main

            # Backend
            cd server
            npm ci --production
            node ace migration:run --force
            pm2 restart royalmatch-api

            # Frontend
            cd ../client
            npm ci
            npm run build --configuration=production
            rm -rf /var/www/royalmatch/client/dist/*
            cp -r dist/* /var/www/royalmatch/client/dist/

            echo "Deployment complete!"
```

## Secrets à configurer
1. Aller dans Settings > Secrets > Actions
2. Ajouter :
   - `SERVER_HOST` : IP du serveur
   - `SERVER_USER` : utilisateur SSH
   - `SSH_PRIVATE_KEY` : clé SSH privée
