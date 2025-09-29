Write-Host "Démarrage de l'application Electron avec API..." -ForegroundColor Green

Write-Host "`n1. Démarrage de l'API..." -ForegroundColor Yellow
Set-Location api
Start-Process -FilePath "node" -ArgumentList "server.js" -WindowStyle Normal

Write-Host "`n2. Attente du démarrage de l'API..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

Write-Host "`n3. Démarrage de l'application Electron..." -ForegroundColor Yellow
Set-Location ..
Start-Process -FilePath "npm" -ArgumentList "start" -WindowStyle Normal

Write-Host "`nApplication démarrée !" -ForegroundColor Green
Write-Host "- API: http://localhost:3000" -ForegroundColor Cyan
Write-Host "- Application Electron en cours de démarrage..." -ForegroundColor Cyan
Write-Host "`nAppuyez sur une touche pour continuer..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
