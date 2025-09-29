<template>
  <div class="uk-container uk-container-small uk-margin-top">
    <div class="uk-card uk-card-default uk-card-body uk-width-1-1">
      <h2 class="uk-card-title uk-text-center">Inscription</h2>
      
      <form @submit.prevent="handleSignup" class="uk-form-stacked">
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

        <div class="uk-margin">
          <label class="uk-form-label" for="pseudo">Pseudo</label>
          <div class="uk-form-controls">
            <input 
              class="uk-input" 
              id="pseudo" 
              type="text" 
              v-model="form.pseudo" 
              required
              placeholder="Votre pseudo"
            />
          </div>
        </div>

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

        <div class="uk-margin">
          <label class="uk-form-label" for="passwordConfirm">Confirmer le mot de passe</label>
          <div class="uk-form-controls">
            <input 
              class="uk-input" 
              id="passwordConfirm" 
              type="password" 
              v-model="form.passwordConfirm" 
              required
              placeholder="Confirmez votre mot de passe"
            />
          </div>
        </div>

        <div class="uk-grid-small uk-child-width-1-2" uk-grid>
          <div>
            <label class="uk-form-label" for="cityCode">Code postal</label>
            <div class="uk-form-controls">
              <input 
                class="uk-input" 
                id="cityCode" 
                type="text" 
                v-model="form.cityCode" 
                required
                placeholder="44000"
              />
            </div>
          </div>
          <div>
            <label class="uk-form-label" for="city">Ville</label>
            <div class="uk-form-controls">
              <input 
                class="uk-input" 
                id="city" 
                type="text" 
                v-model="form.city" 
                required
                placeholder="Nantes"
              />
            </div>
          </div>
        </div>

        <div class="uk-margin">
          <label class="uk-form-label" for="phone">Téléphone</label>
          <div class="uk-form-controls">
            <input 
              class="uk-input" 
              id="phone" 
              type="tel" 
              v-model="form.phone" 
              required
              placeholder="0600000000"
            />
          </div>
        </div>

        <div class="uk-margin">
          <button 
            class="uk-button uk-button-primary uk-width-1-1" 
            type="submit"
            :disabled="loading || !isFormValid"
          >
            <span v-if="loading" uk-spinner="ratio: 0.8"></span>
            {{ loading ? 'Inscription...' : 'S\'inscrire' }}
          </button>
        </div>

        <div class="uk-text-center uk-margin">
          <p>
            Déjà un compte ? 
            <router-link to="/login" class="uk-link">Se connecter</router-link>
          </p>
        </div>
      </form>

      <!-- Message d'erreur -->
      <div v-if="errorMessage" class="uk-alert-danger uk-margin" uk-alert>
        <a class="uk-alert-close" uk-close></a>
        <p>{{ errorMessage }}</p>
      </div>

      <!-- Message de succès -->
      <div v-if="successMessage" class="uk-alert-success uk-margin" uk-alert>
        <a class="uk-alert-close" uk-close></a>
        <p>{{ successMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '../services/api.js';

const router = useRouter();

const loading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const form = reactive({
  email: '',
  pseudo: '',
  password: '',
  passwordConfirm: '',
  cityCode: '',
  city: '',
  phone: ''
});

// Validation du formulaire
const isFormValid = computed(() => {
  return form.email && 
         form.pseudo && 
         form.password && 
         form.passwordConfirm && 
         form.cityCode && 
         form.city && 
         form.phone &&
         form.password === form.passwordConfirm;
});

const handleSignup = async () => {
  loading.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  // Validation côté client
  if (form.password !== form.passwordConfirm) {
    errorMessage.value = 'Les mots de passe ne correspondent pas';
    loading.value = false;
    return;
  }

  if (form.password.length < 6) {
    errorMessage.value = 'Le mot de passe doit contenir au moins 6 caractères';
    loading.value = false;
    return;
  }

  try {
    const result = await authService.signup(form);
    
    if (result.success) {
      successMessage.value = 'Inscription réussie ! Vous pouvez maintenant vous connecter.';
      // Vider le formulaire
      Object.keys(form).forEach(key => {
        form[key] = '';
      });
      // Redirection vers la page de connexion après 2 secondes
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } else {
      errorMessage.value = result.message;
    }
  } catch (error) {
    errorMessage.value = 'Une erreur inattendue s\'est produite';
    console.error('Erreur d\'inscription:', error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.uk-card {
  max-width: 500px;
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

.uk-grid-small > * {
  padding-left: 10px;
}
</style>
