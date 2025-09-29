import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// On crée l'application Vue
const app = createApp(App);
// On ajoute le routeur pour la navigation
app.use(router);
// On monte l'app dans l'élément #app du HTML
app.mount('#app');