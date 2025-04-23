# Guide de lancement local - Avolta

Ce guide explique comment lancer l'application Avolta en local pour le développement.

## Prérequis

- Java JDK 17 ou supérieur
- Node.js 18 ou supérieur
- MySQL 8.0 ou supérieur
- Maven 3.8 ou supérieur
- Git

## Configuration de la base de données

1. Démarrer MySQL et créer la base de données :

```sql
CREATE DATABASE avolta;
```

2. Configurer les accès dans `backend/src/main/resources/application.properties` :

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/avolta?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=
```

## Lancement du Backend

1. Ouvrir un terminal dans le dossier `backend`

2. Compiler le projet :
```bash
mvn clean install
```

3. Lancer l'application :
```bash
mvn spring-boot:run
```

Le backend sera accessible sur `http://localhost:8090/api`

## Lancement du Frontend

1. Ouvrir un nouveau terminal dans le dossier `frontend`

2. Installer les dépendances :
```bash
npm install
```

3. Créer un fichier `.env` :
```
VITE_API_URL=http://localhost:8090/api
```

4. Lancer l'application :
```bash
npm run dev
```

Le frontend sera accessible sur `http://localhost:5173`

## Tester l'API

1. Utiliser le fichier `backend/src/test/http/request.http` pour tester les endpoints

2. Comptes de test :
```
Super Admin:
- Email: superadmin@avolta.be
- Password: superadmin123

Admin:
- Email: admin@avolta.be
- Password: admin123
```

## Vérification du fonctionnement

1. Ouvrir `http://localhost:5173` dans le navigateur

2. Se connecter avec un compte de test

3. Vérifier dans la console du navigateur (F12) que les requêtes API fonctionnent :
   - Pas d'erreurs CORS
   - Les tokens JWT sont bien envoyés
   - Les réponses sont reçues avec succès

## Résolution des problèmes courants

### Erreur CORS

Si vous rencontrez des erreurs CORS :

1. Vérifier que le backend est bien lancé sur le port 8090
2. Vérifier que l'URL dans `.env` est correcte
3. Vérifier que les origines sont bien configurées dans `CorsConfig.java`

### Erreur d'authentification (403)

1. Vérifier que le token JWT est bien envoyé dans le header `Authorization`
2. Vérifier que le token n'est pas expiré
3. Se reconnecter pour obtenir un nouveau token

### Erreur de base de données

1. Vérifier que MySQL est démarré
2. Vérifier les identifiants dans `application.properties`
3. Vérifier que la base de données existe