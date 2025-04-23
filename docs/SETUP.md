# Guide d'installation et de configuration du projet Avolta

## Table des matières
1. [Prérequis](#prérequis)
2. [Structure du projet](#structure-du-projet)
3. [Configuration du Backend (Java/Spring Boot)](#configuration-du-backend)
4. [Configuration du Frontend (React)](#configuration-du-frontend)
5. [Base de données](#base-de-données)
6. [Lancement du projet](#lancement-du-projet)
7. [Outils et dépendances](#outils-et-dépendances)

## Prérequis

Assurez-vous d'avoir installé les outils suivants :

- Java JDK 17 ou supérieur
- Node.js 18 ou supérieur
- PostgreSQL 14 ou supérieur
- Maven 3.8 ou supérieur
- Visual Studio Code
- Git

Extensions VS Code recommandées :
- Extension Pack for Java
- Spring Boot Extension Pack
- ESLint
- Prettier
- TypeScript and JavaScript Language Features

## Structure du projet

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

## Configuration du Backend

1. Ouvrir le dossier `backend` dans VS Code :
```bash
cd backend
code .
```

2. Configurer la base de données dans `src/main/resources/application.properties` :
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/avolta
spring.datasource.username=votre_username
spring.datasource.password=votre_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
```

3. Installer les dépendances Maven :
```bash
mvn clean install
```

4. Lancer le backend :
```bash
mvn spring-boot:run
```

Le backend sera accessible sur `http://localhost:8080`

## Configuration du Frontend

1. Ouvrir le dossier `frontend` dans VS Code :
```bash
cd frontend
code .
```

2. Installer les dépendances :
```bash
npm install
```

3. Configurer l'URL du backend dans `.env` :
```env
VITE_API_URL=http://localhost:8080/api
```

4. Lancer le frontend en développement :
```bash
npm run dev
```

Le frontend sera accessible sur `http://localhost:5173`

## Base de données

1. Créer une base de données PostgreSQL :
```sql
CREATE DATABASE avolta;
```

2. Les tables seront créées automatiquement par Hibernate au démarrage du backend.

3. Pour accéder à la base de données :
```bash
psql -U votre_username -d avolta
```

## Lancement du projet

Pour lancer le projet complet, vous devez :

1. Démarrer PostgreSQL
2. Lancer le backend Spring Boot
3. Lancer le frontend React

Dans deux terminaux séparés :

Terminal 1 (backend) :
```bash
cd backend
mvn spring-boot:run
```

Terminal 2 (frontend) :
```bash
cd frontend
npm run dev
```

## Outils et dépendances

### Backend (Spring Boot)

Principales dépendances :
- Spring Boot 3.x
- Spring Data JPA
- Spring Security
- PostgreSQL Driver
- Lombok
- Jakarta Validation

### Frontend (React)

Principales dépendances :
- React 18
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Lucide React (icons)
- i18next (internationalisation)

### Outils de développement

- ESLint : Linting JavaScript/TypeScript
- Prettier : Formatage du code
- Maven : Build et gestion des dépendances Java
- npm : Gestion des packages JavaScript
- Git : Contrôle de version

## Commandes utiles

### Backend

```bash
# Compiler le projet
mvn clean install

# Lancer les tests
mvn test

# Lancer en développement
mvn spring-boot:run

# Package pour production
mvn package
```

### Frontend

```bash
# Installation des dépendances
npm install

# Développement
npm run dev

# Build production
npm run build

# Linting
npm run lint

# Tests
npm run test
```

## Accès à l'application

- Frontend : http://localhost:5173
- Backend API : http://localhost:8080/api
- Swagger UI : http://localhost:8080/swagger-ui.html

## Comptes de test

```
Super Admin:
- Email: superadmin@avolta.be
- Password: superadmin123

Admin:
- Email: admin@avolta.be
- Password: admin123
```