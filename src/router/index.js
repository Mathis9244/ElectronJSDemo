import { createRouter, createWebHashHistory } from 'vue-router';
import PageOne from '../views/PageOne.vue';
import PageTwo from '../views/PageTwo.vue';

console.log('Démarrage de la configuration du routeur...');

const routes = [
    { path: '/', name: 'PageOne', component: PageOne },
    { path: '/page-2', name: 'PageTwo', component: PageTwo }
];

console.log('Routes définies:', routes);

const router = createRouter({
    history: createWebHashHistory(), // important pour Electron (pas d'historique HTML5)
    routes
});

console.log('Routeur créé avec succès');

// Log navigation events
router.beforeEach((to, from, next) => {
    console.log('Navigation de', from.path, 'vers', to.path);
    next();
});

router.afterEach((to, from) => {
    console.log('Navigation terminée vers', to.path);
});

export default router;