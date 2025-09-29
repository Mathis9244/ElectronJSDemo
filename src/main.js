import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import log from 'electron-log';
import os from 'os';

// Configuration des logs
const logPath = path.join(os.homedir(), 'AppData', 'Roaming', 'app_demo', 'logs');
log.transports.file.resolvePathFn = () => path.join(logPath, 'main.log');
log.transports.file.level = 'info';
log.transports.console.level = 'debug';

// Configuration de l'encodage UTF-8 pour les logs
log.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}';

// Créer le dossier de logs s'il n'existe pas
import fs from 'fs';
if (!fs.existsSync(logPath)) {
    fs.mkdirSync(logPath, { recursive: true });
    log.info('Log directory created:', logPath);
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  log.info('Application démarrée par Squirrel, fermeture...');
  app.quit();
}

const createWindow = () => {
  log.info('Création de la fenêtre principale...');
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    log.info('Chargement de l\'URL de développement:', MAIN_WINDOW_VITE_DEV_SERVER_URL);
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    const filePath = path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`);
    log.info('Chargement du fichier de production:', filePath);
    mainWindow.loadFile(filePath);
  }

  // Open the DevTools.
  log.info('Ouverture des DevTools...');
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  log.info('Application Electron prête, création de la fenêtre...');
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    log.info('Application activée, vérification des fenêtres...');
    if (BrowserWindow.getAllWindows().length === 0) {
      log.info('Aucune fenêtre trouvée, création d\'une nouvelle fenêtre...');
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  log.info('Toutes les fenêtres fermées, plateforme:', process.platform);
  if (process.platform !== 'darwin') {
    log.info('Fermeture de l\'application...');
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
