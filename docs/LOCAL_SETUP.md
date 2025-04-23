# Guide d'installation locale du projet Avolta

## Table des matières

1. [Préparation de l'environnement](#1-préparation-de-lenvironnement)
2. [Structure des dossiers](#2-structure-des-dossiers)
3. [Installation du Backend (API)](#3-installation-du-backend-api)
4. [Installation du Frontend (UI)](#4-installation-du-frontend-ui)
5. [Configuration de la base de données](#5-configuration-de-la-base-de-données)
6. [Lancement du projet](#6-lancement-du-projet)
7. [Dépannage](#7-dépannage)

## 1. Préparation de l'environnement

### 1.1. Prérequis

Installez les outils suivants sur votre machine :

- [Java JDK 17+](https://adoptium.net/)
- [Node.js 18+](https://nodejs.org/)
- [PostgreSQL 14+](https://www.postgresql.org/download/)
- [Maven 3.8+](https://maven.apache.org/download.cgi)
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

Créez la structure de dossiers suivante sur votre machine :

```bash
mkdir avolta
cd avolta
mkdir backend frontend
```

## 3. Installation du Backend (API)

### 3.1. Configuration du projet Spring Boot

1. Dans le dossier `backend`, créez la structure suivante :

```
backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── be/
│   │   │       └── avolta/
│   │   │           ├── config/
│   │   │           ├── controllers/
│   │   │           ├── models/
│   │   │           ├── repositories/
│   │   │           ├── services/
│   │   │           └── AvolteApplication.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
│       └── java/
└── pom.xml
```

2. Créez le fichier `pom.xml` :

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
    </parent>
    
    <groupId>be.avolta</groupId>
    <artifactId>avolta-backend</artifactId>
    <version>1.0.0</version>
    
    <properties>
        <java.version>17</java.version>
    </properties>
    
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>0.11.5</version>
        </dependency>
    </dependencies>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

3. Configurez la base de données dans `src/main/resources/application.properties` :

```properties
# Configuration de la base de données
spring.datasource.url=jdbc:postgresql://localhost:5432/avolta
spring.datasource.username=votre_username
spring.datasource.password=votre_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# Configuration de l'API
server.port=8080
server.servlet.context-path=/api

# Configuration de la sécurité
jwt.secret=votre_secret_jwt_tres_long_et_securise
jwt.expiration=86400000
```

4. Copiez tous les fichiers Java du dossier `src/server` vers leurs emplacements respectifs dans le dossier `backend/src/main/java/be/avolta/`.

### 3.2. Installation des dépendances

Dans le terminal, exécutez :

```bash
cd backend
mvn clean install
```

## 4. Installation du Frontend (UI)

### 4.1. Configuration du projet React

1. Dans le dossier `frontend`, initialisez un nouveau projet :

```bash
cd frontend
npm create vite@latest . -- --template react-ts
```

2. Installez les dépendances nécessaires :

```bash
npm install react-router-dom @types/react-router-dom lucide-react i18next react-i18next tailwindcss postcss autoprefixer
```

3. Copiez les fichiers suivants du projet source vers le dossier `frontend` :

- Tout le contenu du dossier `src`
- `index.html`
- `package.json`
- `tsconfig.json`
- `vite.config.ts`
- `tailwind.config.js`
- `postcss.config.js`

4. Créez le fichier `.env` :

```env
VITE_API_URL=http://localhost:8080/api
```

### 4.2. Installation des dépendances

```bash
npm install
```

## 5. Configuration de la base de données

1. Créez la base de données PostgreSQL :

```sql
CREATE DATABASE avolta;
```

2. Exécutez les scripts de migration :

Copiez tous les fichiers de migration du dossier `supabase/migrations` vers `backend/src/main/resources/db/migration/`.

## 6. Lancement du projet

### 6.1. Démarrer le Backend

Dans un premier terminal :

```bash
cd backend
mvn spring-boot:run
```

Le backend sera accessible sur `http://localhost:8080/api`

### 6.2. Démarrer le Frontend

Dans un second terminal :

```bash
cd frontend
npm run dev
```

Le frontend sera accessible sur `http://localhost:5173`

## 7. Dépannage

### 7.1. Problèmes courants

1. **Erreur de connexion à la base de données**
   - Vérifiez que PostgreSQL est bien démarré
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

Les principaux endpoints sont :

- `POST /api/auth/login` : Authentification
- `GET /api/publications` : Liste des publications
- `POST /api/publications` : Créer une publication
- `PUT /api/publications/{id}` : Modifier une publication
- `DELETE /api/publications/{id}` : Supprimer une publication

Pour tester l'API, vous pouvez utiliser l'interface Swagger UI disponible sur `http://localhost:8080/api/swagger-ui.html`