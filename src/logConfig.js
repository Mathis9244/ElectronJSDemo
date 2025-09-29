import log from 'electron-log';

// Configuration des logs pour le processus de rendu
// Dans le processus de rendu, on utilise seulement la console
// Les logs de fichier sont gérés par le processus principal
log.transports.console.level = 'debug';

// Désactiver les logs de fichier dans le processus de rendu
// car ils ne sont pas supportés dans l'environnement de navigateur
log.transports.file.level = false;

export default log;
