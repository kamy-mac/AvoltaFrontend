# Guide de Migration de Supabase vers Java Spring Boot + MySQL

Ce document détaille le processus de migration de l'application Avolta Belgique depuis Supabase vers une architecture Java Spring Boot avec MySQL.

## Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture du nouveau système](#architecture-du-nouveau-système)
3. [Migration de la base de données](#migration-de-la-base-de-données)
4. [Migration du backend](#migration-du-backend)
5. [Adaptation du frontend](#adaptation-du-frontend)
6. [Déploiement](#déploiement)
7. [Tests et validation](#tests-et-validation)

## Vue d'ensemble

### Ancien système (Supabase)
- Base de données PostgreSQL gérée par Supabase
- Authentification via Supabase Auth
- Stockage de fichiers via Supabase Storage
- API REST générée automatiquement par Supabase

### Nouveau système
- Base de données MySQL
- Backend Java Spring Boot avec architecture MVC
- Authentification JWT
- API REST personnalisée
- Frontend React (conservé mais adapté)

## Architecture du nouveau système

### Structure du backend
```
backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── avolta/
│   │   │           ├── config/        # Configuration Spring
│   │   │           ├── controllers/   # Contrôleurs REST
│   │   │           ├── dto/           # Objets de transfert de données
│   │   │           ├── exceptions/    # Gestion des exceptions
│   │   │           ├── models/        # Entités JPA
│   │   │           ├── repositories/  # Accès aux données
│   │   │           ├── security/      # Configuration de sécurité
│   │   │           ├── services/      # Logique métier
│   │   │           └── Application.java
│   │   └── resources/
│   │       ├── application.properties # Configuration
│   │       └── db/
│   │           └── migration/         # Scripts de migration
│   └── test/                          # Tests unitaires et d'intégration
└── pom.xml                            # Dépendances Maven
```

### Structure du frontend
```
frontend/
├── src/
│   ├── components/   # Composants React
│   ├── context/      # Contextes React
│   ├── lib/          # Utilitaires et API
│   ├── pages/        # Pages de l'application
│   └── types/        # Types TypeScript
└── package.json      # Dépendances npm
```

## Migration de la base de données

### Étapes de migration

1. **Exportation du schéma Supabase**
   - Utilisation de l'interface Supabase pour exporter le schéma
   - Conversion des types PostgreSQL en types MySQL compatibles

2. **Création du schéma MySQL**
   - Adaptation des contraintes et index
   - Gestion des UUID (utilisation de VARCHAR(36) au lieu de UUID natif)
   - Adaptation des types JSON (utilisation de TEXT avec sérialisation/désérialisation)

3. **Migration des données**
   - Export des données depuis Supabase au format CSV
   - Transformation des données si nécessaire
   - Import dans MySQL

### Mappages de types

| Type PostgreSQL | Type MySQL       | Notes                                    |
|-----------------|------------------|------------------------------------------|
| uuid            | VARCHAR(36)      | Stocké comme chaîne                      |
| timestamptz     | TIMESTAMP        | Perte de la gestion des fuseaux horaires |
| jsonb           | TEXT/JSON        | MySQL 8+ supporte JSON nativement        |
| text            | TEXT             | Équivalent                               |
| boolean         | BOOLEAN/TINYINT  | TINYINT(1) pour compatibilité            |

## Migration du backend

### Authentification

1. **Remplacement de Supabase Auth par Spring Security**
   - Implémentation de l'authentification JWT
   - Gestion des rôles et autorisations
   - Stockage sécurisé des mots de passe avec BCrypt

2. **Endpoints d'authentification**
   - `/api/auth/login` : Authentification et génération de token
   - `/api/auth/register` : Création de compte (réservé aux super admins)

### API REST

1. **Création des contrôleurs REST**
   - Contrôleurs pour chaque entité (Publications, Commentaires, etc.)
   - Implémentation des opérations CRUD
   - Validation des entrées avec Bean Validation

2. **Services métier**
   - Logique métier encapsulée dans des services
   - Transactions gérées par Spring

3. **Repositories**
   - Utilisation de Spring Data JPA
   - Requêtes personnalisées avec JPQL/HQL

## Adaptation du frontend

### Modifications nécessaires

1. **Remplacement du client Supabase**
   - Création d'un client API basé sur Axios
   - Adaptation des appels API pour correspondre aux nouveaux endpoints

2. **Gestion de l'authentification**
   - Stockage du token JWT dans localStorage
   - Ajout d'un intercepteur pour inclure le token dans les requêtes
   - Adaptation du contexte d'authentification

3. **Types TypeScript**
   - Mise à jour des interfaces pour correspondre aux DTO du backend

## Déploiement

### Configuration Docker

1. **Conteneurs Docker**
   - MySQL
   - Backend Spring Boot
   - Frontend React (optionnel)

2. **Docker Compose**
   - Configuration réseau
   - Volumes persistants pour MySQL
   - Variables d'environnement

### Environnements

1. **Développement local**
   - Docker Compose pour tous les services
   - Hot-reloading pour le développement

2. **Production**
   - Déploiement sur serveur dédié ou cloud
   - Configuration HTTPS
   - Sauvegarde automatique de la base de données

## Tests et validation

1. **Tests unitaires**
   - Tests des services et repositories
   - Mocks pour les dépendances externes

2. **Tests d'intégration**
   - Tests des contrôleurs avec MockMvc
   - Tests de la couche de persistance avec base de données H2

3. **Tests de performance**
   - Benchmarks avec JMeter
   - Optimisation des requêtes SQL

4. **Validation fonctionnelle**
   - Tests manuels des fonctionnalités clés
   - Comparaison avec l'ancien système