# Guide d'installation locale du projet Avolta avec Java Backend

## Table des matières

1. [Préparation de l'environnement](#1-préparation-de-lenvironnement)
2. [Structure des dossiers](#2-structure-des-dossiers)
3. [Installation du Backend (Java Spring Boot)](#3-installation-du-backend-java-spring-boot)
4. [Installation du Frontend (React)](#4-installation-du-frontend-react)
5. [Configuration de la base de données MySQL](#5-configuration-de-la-base-de-données-mysql)
6. [Lancement du projet](#6-lancement-du-projet)
7. [Dépannage](#7-dépannage)

## 1. Préparation de l'environnement

### 1.1. Prérequis

Installez les outils suivants sur votre machine :

- [Java JDK 17+](https://adoptium.net/)
- [Node.js 18+](https://nodejs.org/)
- [MySQL 8+](https://dev.mysql.com/downloads/mysql/)
- [Maven 3.8+](https://maven.apache.org/download.cgi)
- [Docker](https://www.docker.com/products/docker-desktop/) (optionnel, pour l'installation avec Docker)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Git](https://git-scm.com/downloads)

### 1.2. Extensions VS Code recommandées

Installez les extensions suivantes dans VS Code :

- Extension Pack for Java
- Spring Boot Extension Pack
- ESLint
- Prettier
- TypeScript and JavaScript Language Features

## 2. Structure des dossiers

Le projet est divisé en deux parties principales :

```
avolta/
├── backend/                 # Projet Spring Boot
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   └── resources/
│   │   └── test/
│   └── pom.xml
│
└── frontend/               # Projet React
    ├── src/
    ├── public/
    ├── package.json
    └── vite.config.ts
```

## 3. Installation du Backend (Java Spring Boot)

### 3.1. Installation manuelle

1. Clonez le dépôt et accédez au dossier backend :

```bash
git clone https://github.com/votre-organisation/avolta.git
cd avolta/backend
```

2. Configurez la base de données dans `src/main/resources/application.properties` :

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/avolta?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=votre_username
spring.datasource.password=votre_password
```

3. Compilez le projet avec Maven :

```bash
mvn clean install
```

4. Lancez l'application :

```bash
mvn spring-boot:run
```

### 3.2. Installation avec Docker

1. Assurez-vous que Docker et Docker Compose sont installés.

2. Lancez les conteneurs avec Docker Compose :

```bash
docker-compose up -d
```

## 4. Installation du Frontend (React)

1. Accédez au dossier frontend :

```bash
cd avolta/frontend
```

2. Installez les dépendances :

```bash
npm install
```

3. Configurez l'URL du backend dans `.env` :

```env
VITE_API_URL=http://localhost:8080/api
```

4. Lancez l'application en mode développement :

```bash
npm run dev
```

## 5. Configuration de la base de données MySQL

### 5.1. Installation manuelle

1. Installez MySQL Server 8.0+ sur votre machine.

2. Créez une base de données pour le projet :

```sql
CREATE DATABASE avolta;
```

3. Créez un utilisateur et accordez-lui les privilèges :

```sql
CREATE USER 'avolta'@'localhost' IDENTIFIED BY 'votre_mot_de_passe';
GRANT ALL PRIVILEGES ON avolta.* TO 'avolta'@'localhost';
FLUSH PRIVILEGES;
```

4. Importez le schéma initial (si nécessaire) :

```bash
mysql -u avolta -p avolta < scripts/schema.sql
```

### 5.2. Installation avec Docker

Le fichier `docker-compose.yml` inclut déjà un service MySQL configuré. Aucune action supplémentaire n'est nécessaire.

## 6. Lancement du projet

### 6.1. Démarrage manuel

1. Démarrez le backend :

```bash
cd backend
mvn spring-boot:run
```

2. Dans un autre terminal, démarrez le frontend :

```bash
cd frontend
npm run dev
```

### 6.2. Démarrage avec Docker

```bash
docker-compose up -d
```

## 7. Dépannage

### 7.1. Problèmes courants

1. **Erreur de connexion à la base de données**
   - Vérifiez que MySQL est bien démarré
   - Vérifiez les identifiants dans `application.properties`
   - Vérifiez que la base de données existe

2. **Erreur de compilation du backend**
   - Vérifiez la version de Java
   - Exécutez `mvn clean install -U` pour forcer la mise à jour des dépendances

3. **Erreur de compilation du frontend**
   - Supprimez le dossier `node_modules`
   - Supprimez le fichier `package-lock.json`
   - Réexécutez `npm install`

### 7.2. Logs et debugging

1. **Backend** : Les logs sont disponibles dans la console et dans `backend/logs/`
2. **Frontend** : Utilisez la console du navigateur (F12)
3. **Docker** : Utilisez `docker-compose logs -f` pour voir les logs en temps réel

### 7.3. Comptes de test

```
Super Admin:
- Email: superadmin@avolta.be
- Password: superadmin123

Admin:
- Email: admin@avolta.be
- Password: admin123
```

### 7.4. Endpoints API

Les principaux endpoints sont documentés via Swagger UI, disponible à l'adresse :
`http://localhost:8080/api/swagger-ui.html`