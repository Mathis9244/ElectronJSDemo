<template>
  <div class="uk-container uk-container-small uk-margin-top">
    <!-- Carte principale du formulaire de connexion -->
    <div class="uk-card uk-card-default uk-card-body uk-width-1-1">
      <h2 class="uk-card-title uk-text-center">Connexion</h2>
      
      <!-- Formulaire de connexion -->
      <form @submit.prevent="handleLogin" class="uk-form-stacked">
        <!-- Champ email -->
        <div class="uk-margin">
          <label class="uk-form-label" for="email">Email</label>
          <div class="uk-form-controls">
            <input 
              class="uk-input" 
              id="email" 
              type="email" 
              v-model="form.email" 
              required
              placeholder="votre@email.com"
            />
          </div>
        </div>

        <!-- Champ mot de passe -->
        <div class="uk-margin">
          <label class="uk-form-label" for="password">Mot de passe</label>
          <div class="uk-form-controls">
            <input 
              class="uk-input" 
              id="password" 
              type="password" 
              v-model="form.password" 
              required
              placeholder="Votre mot de passe"
            />
          </div>
        </div>

        <!-- Bouton de connexion -->
        <div class="uk-margin">
          <button 
            class="uk-button uk-button-primary uk-width-1-1" 
            type="submit"
            :disabled="loading"
          >
            <span v-if="loading" uk-spinner="ratio: 0.8"></span>
            {{ loading ? 'Connexion...' : 'Se connecter' }}
          </button>
        </div>

        <!-- Lien vers l'inscription -->
        <div class="uk-text-center uk-margin">
          <p>
            Pas encore de compte ? 
            <router-link to="/signup" class="uk-link">S'inscrire</router-link>
          </p>
        </div>

        <!-- Comptes de test pour faciliter les tests -->
        <div class="uk-margin uk-card uk-card-secondary uk-card-body uk-text-small">
          <h4>Comptes de test :</h4>
          <ul class="uk-list uk-list-bullet">
            <li><strong>mathisbibi@gmail.com</strong> | 1234567890</li>
            <li><strong>isaac@gmail.com</strong> | password</li>
            <li><strong>tata@gmail.com</strong> | 123456</li>
            <li><strong>toto@gmail.com</strong> | 12345</li>
          </ul>
        </div>
      </form>

      <!-- Message d'erreur si la connexion échoue -->
      <div v-if="errorMessage" class="uk-alert-danger uk-margin" uk-alert>
        <a class="uk-alert-close" uk-close></a>
        <p>{{ errorMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '../services/api.js';

const router = useRouter(); // Pour naviguer après la connexion

// Variables réactives pour l'état du formulaire
const loading = ref(false); // Indique si on est en train de se connecter
const errorMessage = ref(''); // Message d'erreur à afficher

// Données du formulaire
const form = reactive({
  email: '',
  password: ''
});

// Fonction appelée quand on soumet le formulaire
const handleLogin = async () => {
  loading.value = true; // On active le loading
  errorMessage.value = ''; // On efface les erreurs précédentes

  try {
    // On essaie de se connecter avec l'API
    const result = await authService.login(form.email, form.password);
    
    if (result.success) {
      // Ça a marché ! On redirige vers la page des articles
      router.push('/articles');
    } else {
      // Ça a foiré, on affiche le message d'erreur
      errorMessage.value = result.message;
    }
  } catch (error) {
    // Erreur inattendue
    errorMessage.value = 'Une erreur inattendue s\'est produite';
    console.error('Erreur de connexion:', error);
  } finally {
    loading.value = false; // On désactive le loading
  }
};
</script>

<style scoped>
.uk-card {
  max-width: 400px;
  margin: 0 auto;
}

.uk-form-label {
  font-weight: 600;
}

.uk-button {
  transition: all 0.3s ease;
}

.uk-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
