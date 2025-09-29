# 🚀 Guide de Démarrage de l'Application

## 📋 Prérequis

- Node.js (version 16 ou supérieure)
- npm

## 🎯 Démarrage Rapide

### Option 1 : Script Automatique (Recommandé)

**Windows :**
```bash
# Double-cliquez sur start-app.bat
# OU exécutez dans PowerShell :
.\start-app.ps1
```

### Option 2 : Démarrage Manuel

**1. Démarrer l'API :**
```bash
cd api
npm install  # (première fois seulement)
node server.js
```

**2. Démarrer l'application Electron :**
```bash
# Dans un nouveau terminal
npm start
```

## 🔧 Configuration

### API (Port 3000)
- **URL :** http://localhost:3000
- **Health Check :** http://localhost:3000/health
- **Articles :** http://localhost:3000/articles

### Comptes de Test
- **Email :** admin@test.com
- **Mot de passe :** password

## 📱 Fonctionnalités

✅ **Authentification** - Login/Logout
✅ **Gestion d'articles** - CRUD complet
✅ **Interface responsive** - Mobile/Tablette/Desktop
✅ **Images** - Support des images externes
✅ **API REST** - Backend complet

## 🐛 Dépannage

### L'application ne se connecte pas à l'API
1. Vérifiez que l'API est démarrée : http://localhost:3000/health
2. Redémarrez l'API : `cd api && node server.js`

### Les données ne s'affichent pas
1. Vérifiez que vous êtes connecté
2. Vérifiez la console du navigateur (F12)
3. Redémarrez l'application

### Build Exécutable
```bash
npm run make
```
L'exécutable sera créé dans `out/my-electron-app-win32-x64/`

## 📁 Structure du Projet

```
app_demo/
├── src/                 # Code source de l'application
├── api/                 # API locale
│   ├── server.js        # Serveur Express
│   └── package.json     # Dépendances API
├── out/                 # Builds exécutables
├── start-app.bat        # Script de démarrage Windows
└── start-app.ps1        # Script de démarrage PowerShell
```

## 🎉 C'est parti !

L'application est maintenant prête à être utilisée avec une interface responsive et toutes les fonctionnalités !
