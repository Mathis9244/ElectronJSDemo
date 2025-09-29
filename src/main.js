import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import log from 'electron-log';
import os from 'os';

// Configuration des logs pour déboguer l'app
const logPath = path.join(os.homedir(), 'AppData', 'Roaming', 'app_demo', 'logs');
log.transports.file.resolvePathFn = () => path.join(logPath, 'main.log');
log.transports.file.level = 'info'; // Niveau des logs dans le fichier
log.transports.console.level = 'debug'; // Niveau des logs dans la console

// Format des logs avec date et heure
log.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}';

// On crée le dossier de logs s'il n'existe pas
import fs from 'fs';
if (!fs.existsSync(logPath)) {
    fs.mkdirSync(logPath, { recursive: true });
    log.info('Log directory created:', logPath);
}

// Gestion des raccourcis Windows lors de l'installation/désinstallation
if (started) {
  log.info('Application démarrée par Squirrel, fermeture...');
  app.quit(); // On ferme l'app si elle a été lancée par Squirrel
}

// Fonction pour créer la fenêtre principale de l'app
const createWindow = () => {
  log.info('Création de la fenêtre principale...');
  // On crée la fenêtre avec ses paramètres
  const mainWindow = new BrowserWindow({
    width: 1200, // Largeur de la fenêtre
    height: 900, // Hauteur de la fenêtre
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Script de préchargement
      webSecurity: false, // Désactive la sécurité web pour permettre les images externes
      nodeIntegration: false, // Sécurité
      contextIsolation: true, // Sécurité
    },
  });

  mainWindow.menu.file.enabled = false;

  // On charge l'interface selon l'environnement
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    // En développement, on charge depuis le serveur Vite
    log.info('Chargement de l\'URL de développement:', MAIN_WINDOW_VITE_DEV_SERVER_URL);
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    // En production, on charge le fichier HTML compilé
    const filePath = path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`);
    log.info('Chargement du fichier de production:', filePath);
    mainWindow.loadFile(filePath);
  }

  // On ouvre les DevTools pour déboguer
  log.info('Ouverture des DevTools...');
  mainWindow.webContents.openDevTools();
};

// Cette fonction s'exécute quand Electron est prêt à créer des fenêtres
app.whenReady().then(() => {
  log.info('Application Electron prête, création de la fenêtre...');
  createWindow(); // On crée la fenêtre principale

  // Sur macOS, on recrée une fenêtre si l'utilisateur clique sur l'icône du dock
  app.on('activate', () => {
    log.info('Application activée, vérification des fenêtres...');
    if (BrowserWindow.getAllWindows().length === 0) {
      log.info('Aucune fenêtre trouvée, création d\'une nouvelle fenêtre...');
      createWindow(); // On recrée une fenêtre si il n'y en a pas
    }
  });
});

// On ferme l'app quand toutes les fenêtres sont fermées (sauf sur macOS)
app.on('window-all-closed', () => {
  log.info('Toutes les fenêtres fermées, plateforme:', process.platform);
  if (process.platform !== 'darwin') { // Si c'est pas macOS
    log.info('Fermeture de l\'application...');
    app.quit(); // On ferme l'app
  }
});

// Ici on peut ajouter d'autres codes spécifiques au processus principal
