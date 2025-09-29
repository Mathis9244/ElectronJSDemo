import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

console.log('Démarrage du processus de rendu...');
console.log('Création de l\'application Vue...');

const app = createApp(App);
console.log('Application Vue créée, ajout du routeur...');

app.use(router);
console.log('Routeur ajouté, montage de l\'application...');

app.mount('#app');
console.log('Application Vue montée avec succès !');