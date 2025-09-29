@echo off
echo Démarrage de l'application Electron avec API...

echo.
echo 1. Démarrage de l'API...
cd api
start "API Server" cmd /k "node server.js"

echo.
echo 2. Attente du démarrage de l'API...
timeout /t 3 /nobreak > nul

echo.
echo 3. Démarrage de l'application Electron...
cd ..
start "Electron App" cmd /k "npm start"

echo.
echo Application démarrée !
echo - API: http://localhost:3000
echo - Application Electron en cours de démarrage...
pause
