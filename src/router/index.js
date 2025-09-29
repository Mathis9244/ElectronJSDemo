import { createRouter, createWebHashHistory } from 'vue-router';
import { authService } from '../services/api.js';
import Login from '../views/Login.vue';
import Signup from '../views/Signup.vue';
import Articles from '../views/Articles.vue';
import ArticleDetail from '../views/ArticleDetail.vue';

// Configuration des routes de l'app
const routes = [
    { 
        path: '/', 
        redirect: '/articles' // Si on va sur la racine, on redirige vers les articles
    },
    { 
        path: '/login', 
        name: 'Login', 
        component: Login,
        meta: { requiresGuest: true } // Cette page est pour les invités (pas connectés)
    },
    { 
        path: '/signup', 
        name: 'Signup', 
        component: Signup,
        meta: { requiresGuest: true } // Cette page est pour les invités (pas connectés)
    },
    { 
        path: '/articles', 
        name: 'Articles', 
        component: Articles,
        meta: { requiresAuth: true } // Cette page nécessite d'être connecté
    },
    { 
        path: '/articles/:id', 
        name: 'ArticleDetail', 
        component: ArticleDetail,
        meta: { requiresAuth: true } // Cette page nécessite d'être connecté
    }
];

// On crée le routeur avec l'historique en hash (obligatoire pour Electron)
const router = createRouter({
    history: createWebHashHistory(), // important pour Electron (pas d'historique HTML5)
    routes
});

// Garde de navigation - cette fonction s'exécute avant chaque changement de page
router.beforeEach((to, from, next) => {
    const isAuthenticated = authService.isAuthenticated(); // On vérifie si l'utilisateur est connecté
    
    // Si la page nécessite d'être connecté mais qu'on ne l'est pas
    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/login'); // On redirige vers la page de connexion
        return;
    }
    
    // Si la page est pour les invités mais qu'on est déjà connecté
    if (to.meta.requiresGuest && isAuthenticated) {
        next('/articles'); // On redirige vers les articles
        return;
    }
    
    next(); // Sinon on continue normalement
});

export default router;