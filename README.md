# Task Manager

Application de gestion de tâches.

## 🚀 Stack Technique

### Frontend
- **React** 18
- **Material-UI** pour les composants
- **React Router** pour la navigation
- **Axios** pour les appels API

### Backend
- **NestJS** avec TypeScript
- **MySQL** avec TypeORM
- **JWT** pour l'authentification

### Base de données
- **MySQL** 8.0+
- **TypeORM** pour les migrations

## 🛠️ Installation

Prérequis
Node.js (v18+)
WampServer (ou équivalent)
MySQL (via WampServer)
Git

1. Cloner le dépôt
```git clone https://github.com/NessimPerso/todo_list.git```

3. Configuration de la base de données
Lancer WampServer et s'assurer que MySQL est actif
  Créer la base de données (via phpMyAdmin ou en ligne de commande) :
```CREATE DATABASE libheros_tasks CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;```

TypeORM créera automatiquement les tables grâce à synchronize: true

3. Configuration backend (.env)
Créer un fichier .env dans todo_list/backend avec :
```DB_HOST=localhost```
```DB_PORT=3308```
```DB_USERNAME=root```
```DB_PASSWORD=```
```DB_NAME=libheros_tasks```
```JWT_SECRET=libheros_jwt_secret_2024_changez_moi_en_prod```
```JWT_EXPIRES_IN=24h```
```PORT=3001```
```REACT_APP_API_URL=http://localhost:3001```


5. Configuration frontend (.env)
Créer un fichier .env dans todo_list/frontend avec :
```REACT_APP_API_URL=http://localhost:3001```

6. Installation des dépendances
Backend :
  ```cd backend```
  ```npm install```
  
Frontend :
```cd ../frontend```
```npm install```

6. Lancer l'application
Dans un premier terminal (backend) :
```cd backend```
```npm run start:dev```

Dans un second terminal (frontend) :
```cd frontend```
```npm start```

8. Accès à l'application
Frontend : http://localhost:3000
Backend (API) : http://localhost:3001

⚙️ Configuration avancée
Variables d'environnement critiques
Variable	Description	Valeur par défaut
DB_PORT	Port MySQL (Wamp: 3308, MAMP: 8889)	3308
JWT_SECRET	Secret pour les tokens JWT	Doit être changé en prod
JWT_EXPIRES_IN	Durée de validité des tokens	24h
Première utilisation
Créez un compte via l'interface d'inscription

Connectez-vous avec vos identifiants

Commencez à créer vos listes et tâches !

Vous pouvez adapter les valeurs par défaut selon votre configuration locale (ports, identifiants DB). Le système est conçu pour fonctionner immédiatement en développement avec WampServer.
