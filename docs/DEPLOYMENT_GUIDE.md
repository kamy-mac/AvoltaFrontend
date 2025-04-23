# Guide de Déploiement - Avolta Belgique

Ce document fournit des instructions détaillées pour déployer l'application Avolta Belgique en environnement de production.

## Table des matières

1. [Prérequis système](#1-prérequis-système)
2. [Configuration de la base de données](#2-configuration-de-la-base-de-données)
3. [Déploiement du backend Java](#3-déploiement-du-backend-java)
4. [Déploiement du frontend](#4-déploiement-du-frontend)
5. [Configuration Docker](#5-configuration-docker)
6. [Vérifications post-déploiement](#6-vérifications-post-déploiement)
7. [Tests](#7-tests)
8. [Maintenance](#8-maintenance)

## 1. Prérequis système

### 1.1. Serveur backend

- Java JDK 17 ou supérieur
- Maven 3.8 ou supérieur
- MySQL 8.0 ou supérieur
- Minimum 2 Go de RAM
- 10 Go d'espace disque
- Système d'exploitation: Linux (recommandé), Windows Server ou macOS

### 1.2. Serveur frontend

- Node.js 18 ou supérieur
- npm 9 ou supérieur
- Serveur web (Nginx recommandé)
- 1 Go de RAM
- 5 Go d'espace disque

### 1.3. Outils recommandés

- Docker et Docker Compose (pour le déploiement conteneurisé)
- Git
- Postman (pour tester l'API)

## 2. Configuration de la base de données

### 2.1. Installation de MySQL

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install mysql-server

# CentOS/RHEL
sudo yum install mysql-server
sudo systemctl start mysqld
sudo systemctl enable mysqld
```

### 2.2. Création de la base de données

```bash
# Se connecter à MySQL
mysql -u root -p

# Créer la base de données et l'utilisateur
CREATE DATABASE avolta CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'avolta_user'@'localhost' IDENTIFIED BY 'votre_mot_de_passe_sécurisé';
GRANT ALL PRIVILEGES ON avolta.* TO 'avolta_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 2.3. Configuration de la sécurité

```bash
# Exécuter l'utilitaire de sécurisation MySQL
sudo mysql_secure_installation
```

## 3. Déploiement du backend Java

### 3.1. Compilation du projet

```bash
# Cloner le dépôt
git clone https://github.com/votre-organisation/avolta-backend.git
cd avolta-backend

# Compiler le projet
mvn clean package -DskipTests
```

### 3.2. Configuration

Créez un fichier `application-prod.properties` dans `src/main/resources` avec les paramètres suivants:

```properties
# Configuration de la base de données
spring.datasource.url=jdbc:mysql://localhost:3306/avolta?useSSL=true&serverTimezone=UTC
spring.datasource.username=avolta_user
spring.datasource.password=votre_mot_de_passe_sécurisé
spring.jpa.hibernate.ddl-auto=validate

# Configuration du serveur
server.port=8080
server.servlet.context-path=/api

# Configuration JWT
jwt.secret=votre_clé_secrète_très_longue_et_aléatoire
jwt.expiration=86400000

# Configuration des logs
logging.file.name=/var/log/avolta/backend.log
logging.level.root=WARN
logging.level.com.avolta=INFO

# Configuration CORS
cors.allowed-origins=https://votre-domaine.com
```

### 3.3. Déploiement

#### Option 1: Service systemd

Créez un fichier service systemd:

```bash
sudo nano /etc/systemd/system/avolta-backend.service
```

Contenu du fichier:

```
[Unit]
Description=Avolta Backend Service
After=network.target mysql.service

[Service]
User=avolta
Group=avolta
WorkingDirectory=/opt/avolta/backend
ExecStart=/usr/bin/java -jar /opt/avolta/backend/target/avolta-backend-1.0.0.jar --spring.profiles.active=prod
SuccessExitStatus=143
TimeoutStopSec=10
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Démarrez le service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable avolta-backend.service
sudo systemctl start avolta-backend.service
```

#### Option 2: Déploiement avec JAR

```bash
# Copier le JAR dans le répertoire de déploiement
sudo mkdir -p /opt/avolta/backend
sudo cp target/avolta-backend-1.0.0.jar /opt/avolta/backend/

# Démarrer l'application
java -jar /opt/avolta/backend/avolta-backend-1.0.0.jar --spring.profiles.active=prod
```

## 4. Déploiement du frontend

### 4.1. Construction du projet

```bash
# Cloner le dépôt
git clone https://github.com/votre-organisation/avolta-frontend.git
cd avolta-frontend

# Installer les dépendances
npm install

# Créer un fichier .env.production
echo "VITE_API_URL=https://api.votre-domaine.com/api" > .env.production

# Construire le projet
npm run build
```

### 4.2. Configuration Nginx

Installez Nginx:

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nginx

# CentOS/RHEL
sudo yum install nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

Créez une configuration pour le site:

```bash
sudo nano /etc/nginx/sites-available/avolta
```

Contenu du fichier:

```nginx
server {
    listen 80;
    server_name votre-domaine.com www.votre-domaine.com;

    root /var/www/avolta;
    index index.html;

    # Compression gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Redirection vers HTTPS (à activer après configuration SSL)
    # return 301 https://$host$request_uri;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:8080/api;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Cache pour les ressources statiques
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
}
```

Activez la configuration:

```bash
sudo ln -s /etc/nginx/sites-available/avolta /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 4.3. Déploiement des fichiers

```bash
# Créer le répertoire de déploiement
sudo mkdir -p /var/www/avolta

# Copier les fichiers
sudo cp -r dist/* /var/www/avolta/

# Définir les permissions
sudo chown -R www-data:www-data /var/www/avolta
```

### 4.4. Configuration HTTPS (recommandé)

Utilisez Certbot pour configurer HTTPS avec Let's Encrypt:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d votre-domaine.com -d www.votre-domaine.com
```

## 5. Configuration Docker

### 5.1. Préparation

Installez Docker et Docker Compose:

```bash
# Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.18.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 5.2. Fichier docker-compose.yml

Créez un fichier `docker-compose.yml` à la racine du projet:

```yaml
version: '3.8'

services:
  # Base de données MySQL
  mysql:
    image: mysql:8.0
    container_name: avolta-mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: avolta
      MYSQL_USER: avolta_user
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
    networks:
      - avolta-network
    command: --default-authentication-plugin=mysql_native_password

  # Backend Spring Boot
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: avolta-backend
    restart: always
    depends_on:
      - mysql
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/avolta?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
      SPRING_DATASOURCE_USERNAME: avolta_user
      SPRING_DATASOURCE_PASSWORD: ${MYSQL_PASSWORD}
      SPRING_JPA_HIBERNATE_DDL_AUTO: update
      JWT_SECRET: ${JWT_SECRET}
      JWT_EXPIRATION: 86400000
    ports:
      - "8080:8080"
    networks:
      - avolta-network

  # Frontend Nginx
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: avolta-frontend
    restart: always
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - backend
    volumes:
      - ./nginx/conf:/etc/nginx/conf.d
      - ./nginx/certbot/conf:/etc/letsencrypt
      - ./nginx/certbot/www:/var/www/certbot
    networks:
      - avolta-network

networks:
  avolta-network:
    driver: bridge

volumes:
  mysql_data:
```

### 5.3. Fichier .env

Créez un fichier `.env` à la racine du projet:

```
MYSQL_ROOT_PASSWORD=votre_mot_de_passe_root_sécurisé
MYSQL_PASSWORD=votre_mot_de_passe_sécurisé
JWT_SECRET=votre_clé_secrète_très_longue_et_aléatoire
```

### 5.4. Dockerfile pour le backend

Créez un fichier `Dockerfile` dans le dossier `backend`:

```dockerfile
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### 5.5. Dockerfile pour le frontend

Créez un fichier `Dockerfile` dans le dossier `frontend`:

```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 5.6. Démarrage des conteneurs

```bash
# Démarrer les conteneurs
docker-compose up -d

# Vérifier l'état des conteneurs
docker-compose ps
```

## 6. Vérifications post-déploiement

### 6.1. Vérification du backend

```bash
# Vérifier les logs du backend
sudo journalctl -u avolta-backend.service -f

# Ou avec Docker
docker logs -f avolta-backend
```

Testez l'API avec curl:

```bash
curl -i http://localhost:8080/api/health
```

### 6.2. Vérification du frontend

Ouvrez un navigateur et accédez à votre domaine:

```
https://votre-domaine.com
```

Vérifiez les éléments suivants:
- La page d'accueil se charge correctement
- Les ressources statiques (CSS, JS, images) sont chargées
- La connexion à l'API fonctionne (essayez de vous connecter)

### 6.3. Surveillance

Configurez la surveillance avec Prometheus et Grafana (optionnel):

```bash
# Installer Prometheus
sudo apt install prometheus

# Installer Grafana
sudo apt install grafana
```

## 7. Tests

### 7.1. Tests du backend

```bash
# Exécuter les tests unitaires
cd backend
mvn test

# Exécuter les tests d'intégration
mvn verify
```

### 7.2. Tests du frontend

```bash
# Exécuter les tests unitaires
cd frontend
npm test

# Exécuter les tests end-to-end (si configurés)
npm run test:e2e
```

### 7.3. Tests de charge

Utilisez JMeter ou k6 pour tester les performances:

```bash
# Exemple avec k6
k6 run load-test.js
```

## 8. Maintenance

### 8.1. Sauvegardes

Configurez des sauvegardes régulières de la base de données:

```bash
# Créer un script de sauvegarde
nano backup.sh
```

Contenu du script:

```bash
#!/bin/bash
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/var/backups/avolta"
mkdir -p $BACKUP_DIR

# Sauvegarde de la base de données
mysqldump -u avolta_user -p'votre_mot_de_passe_sécurisé' avolta > $BACKUP_DIR/avolta_$TIMESTAMP.sql

# Compression
gzip $BACKUP_DIR/avolta_$TIMESTAMP.sql

# Nettoyage des anciennes sauvegardes (garder les 7 dernières)
ls -tp $BACKUP_DIR/*.gz | grep -v '/$' | tail -n +8 | xargs -I {} rm -- {}
```

Ajoutez le script au cron:

```bash
chmod +x backup.sh
crontab -e

# Ajouter la ligne suivante pour une sauvegarde quotidienne à 2h du matin
0 2 * * * /chemin/vers/backup.sh
```

### 8.2. Mises à jour

Procédure de mise à jour du backend:

```bash
# Arrêter le service
sudo systemctl stop avolta-backend.service

# Mettre à jour le code
git pull

# Compiler
mvn clean package -DskipTests

# Déployer
sudo cp target/avolta-backend-1.0.0.jar /opt/avolta/backend/

# Redémarrer le service
sudo systemctl start avolta-backend.service
```

Procédure de mise à jour du frontend:

```bash
# Mettre à jour le code
git pull

# Installer les dépendances
npm install

# Construire
npm run build

# Déployer
sudo cp -r dist/* /var/www/avolta/
```

---

Pour toute assistance supplémentaire, contactez l'équipe technique à support@avolta.be.