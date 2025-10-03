# Tâche 17.2 : Configuration domaine et SSL

## Configuration DNS (Hostinger)
1. Aller dans le panneau de contrôle Hostinger
2. Section "Domaines" > "DNS Zone"
3. Ajouter un enregistrement A :
   - Type: A
   - Name: @
   - Value: IP_DU_SERVEUR
   - TTL: 14400

4. Ajouter un enregistrement CNAME (optionnel pour www) :
   - Type: CNAME
   - Name: www
   - Value: votre-domaine.com
   - TTL: 14400

## Installation SSL avec Let's Encrypt
```bash
# Installer Certbot
apt install -y certbot python3-certbot-nginx

# Obtenir le certificat SSL
certbot --nginx -d votre-domaine.com -d www.votre-domaine.com

# Le certificat sera automatiquement configuré dans Nginx
# Vérifier le renouvellement automatique
certbot renew --dry-run

# Certbot ajoute automatiquement un cron job pour le renouvellement
```

## Configuration Nginx après SSL
```nginx
# /etc/nginx/sites-available/royalmatch (mis à jour par Certbot)
server {
    listen 80;
    server_name votre-domaine.com www.votre-domaine.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name votre-domaine.com www.votre-domaine.com;

    ssl_certificate /etc/letsencrypt/live/votre-domaine.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/votre-domaine.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # ... reste de la configuration
}
```

## Vérification
```bash
# Tester le SSL
curl -I https://votre-domaine.com

# Vérifier le grade SSL
# Aller sur https://www.ssllabs.com/ssltest/
```
