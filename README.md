# Application de Gestion d'Articles - ElectronJS

Une application desktop développée avec ElectronJS et Vue.js pour gérer des articles avec authentification.

## 🚀 Fonctionnalités

### Authentification
- ✅ Page de connexion avec comptes de test
- ✅ Page d'inscription avec validation
- ✅ Gestion des tokens JWT
- ✅ Déconnexion automatique

### Gestion des Articles
- ✅ Liste des articles avec interface moderne
- ✅ Détail d'un article
- ✅ Création d'articles
- ✅ Modification d'articles
- ✅ Suppression d'articles
- ✅ Interface responsive avec UIKit

### Sécurité
- ✅ Protection des routes
- ✅ Redirection automatique selon l'état d'authentification
- ✅ Gestion des erreurs API

## 🛠️ Technologies Utilisées

- **ElectronJS** - Framework pour applications desktop
- **Vue.js 3** - Framework JavaScript réactif
- **Vue Router** - Routage côté client
- **Axios** - Client HTTP pour les appels API
- **UIKit** - Framework CSS pour l'interface
- **Node.js** - Runtime JavaScript

## 📋 Prérequis

- Node.js (version 16 ou supérieure)
- npm ou yarn

## 🚀 Installation et Démarrage

### 1. Cloner le projet
```bash
git clone <votre-repo>
cd app_demo
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Démarrer l'API locale
Dans un terminal séparé :
```bash
cd api
npm install
npm start
```
L'API sera disponible sur `http://localhost:3000`

### 4. Démarrer l'application Electron
```bash
npm start
```

## 🔐 Comptes de Test

L'API fournit des comptes de test prêts à l'emploi :

| Email | Mot de passe |
|-------|--------------|
| isaac@gmail.com | password |
| tata@gmail.com | 123456 |
| toto@gmail.com | 12345 |

## 📁 Structure du Projet

```
src/
├── services/
│   └── api.js              # Service API avec Axios
├── views/
│   ├── Login.vue           # Page de connexion
│   ├── Signup.vue          # Page d'inscription
│   ├── Articles.vue        # Liste des articles
│   └── ArticleDetail.vue   # Détail d'un article
├── router/
│   └── index.js            # Configuration du routage
├── App.vue                 # Composant principal
├── main.js                 # Point d'entrée Electron
├── preload.js             # Script de préchargement
├── renderer.js             # Point d'entrée du processus de rendu
└── index.css               # Styles globaux
```

## 🔧 API Endpoints

L'application communique avec l'API locale sur `http://localhost:3000` :

### Authentification
- `POST /login` - Connexion
- `POST /signup` - Inscription
- `POST /reset-password` - Réinitialisation du mot de passe

### Articles
- `GET /articles` - Liste des articles
- `GET /articles/:id` - Détail d'un article
- `POST /articles/save` - Créer/modifier un article
- `DELETE /articles/:id` - Supprimer un article

## 🎨 Interface Utilisateur

L'application utilise UIKit pour une interface moderne et responsive :
- Navigation intuitive
- Modales pour les formulaires
- Messages d'erreur et de succès
- Design adaptatif
- Icônes intégrées

## 🚀 Build et Distribution

### Créer un package
```bash
npm run package
```

### Créer un exécutable
```bash
npm run make
```

## 📝 Notes de Développement

- L'application utilise le hash routing pour Electron
- Les tokens JWT sont stockés dans localStorage
- La navigation est protégée par des guards de route
- L'API est mockée et redémarre à chaque lancement

## 🐛 Dépannage

### L'API ne répond pas
Vérifiez que l'API locale est démarrée sur le port 3000 :
```bash
cd api
npm start
```

### Erreurs de CORS
L'API est configurée pour accepter les requêtes depuis l'application Electron.

### Problèmes de build
Vérifiez que toutes les dépendances sont installées :
```bash
npm ci
```

## 📄 Licence

MIT License - Voir le fichier LICENSE pour plus de détails.

## 👨‍💻 Auteur

Développé dans le cadre d'un projet pédagogique ElectronJS.
