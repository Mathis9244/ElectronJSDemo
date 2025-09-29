<template>
  <div>
    <!-- Barre de navigation qui s'affiche seulement si on est connecté -->
    <nav v-if="showNavigation" class="uk-navbar-container uk-margin-bottom" uk-navbar>
      <div class="uk-navbar-left">
        <!-- Logo de l'app -->
        <a class="uk-navbar-item uk-logo" href="#/articles">
          <span uk-icon="icon: home"></span> Gestion d'Articles
        </a>
      </div>
      <div class="uk-navbar-right">
        <ul class="uk-navbar-nav">
          <!-- Lien vers la liste des articles -->
          <li>
            <router-link to="/articles">
              <span uk-icon="icon: file-text"></span> Articles
            </router-link>
          </li>
          <!-- Bouton de déconnexion -->
          <li>
            <a href="#" @click="handleLogout">
              <span uk-icon="icon: sign-out"></span> Déconnexion
            </a>
          </li>
        </ul>
      </div>
    </nav>

    <!-- Ici s'affiche le contenu de la page actuelle -->
    <router-view />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { authService } from './services/api.js';

const route = useRoute(); // Pour savoir sur quelle page on est
const router = useRouter(); // Pour naviguer entre les pages

// On affiche la barre de navigation seulement si on est sur une page qui nécessite d'être connecté
const showNavigation = computed(() => {
  return route.meta.requiresAuth; // Si la page nécessite une auth, on montre la nav
});

// Fonction pour se déconnecter
const handleLogout = () => {
  authService.logout(); // On vire le token
  router.push('/login'); // On redirige vers la page de connexion
};
</script>