# GitHub Secrets Configuration

Pour que le CI/CD fonctionne correctement, vous devez configurer les secrets suivants dans votre repository GitHub :

## Secrets requis

### 1. GITHUB_TOKEN
- **Description** : Token d'authentification GitHub (généré automatiquement)
- **Valeur** : `${{ secrets.GITHUB_TOKEN }}` (automatique)
- **Utilisation** : Pour publier les releases et artifacts

### 2. GH_TOKEN (optionnel)
- **Description** : Token GitHub personnel pour des actions avancées
- **Valeur** : Votre token personnel GitHub
- **Utilisation** : Pour des opérations GitHub avancées

## Configuration des secrets

1. Allez dans votre repository GitHub
2. Cliquez sur **Settings** > **Secrets and variables** > **Actions**
3. Cliquez sur **New repository secret**
4. Ajoutez les secrets nécessaires

## Workflows configurés

### 1. CI/CD Pipeline (`.github/workflows/ci-cd.yml`)
- **Déclencheur** : Push sur master/main, Pull Requests
- **Actions** : Test, Build, Upload artifacts
- **Release** : Création automatique de release

### 2. Electron Release (`.github/workflows/electron-release.yml`)
- **Déclencheur** : Tags v*, Workflow dispatch
- **Actions** : Build multi-plateforme, Publish
- **Plateformes** : Windows, macOS, Linux

### 3. PR Quality Checks (`.github/workflows/pr-checks.yml`)
- **Déclencheur** : Pull Requests
- **Actions** : Lint, Security audit, Build check

## Utilisation

### Déclencher un build manuel
1. Allez dans l'onglet **Actions** de votre repository
2. Sélectionnez le workflow souhaité
3. Cliquez sur **Run workflow**

### Créer une release
1. Créez un tag : `git tag v1.0.0`
2. Poussez le tag : `git push origin v1.0.0`
3. Le workflow de release se déclenchera automatiquement
