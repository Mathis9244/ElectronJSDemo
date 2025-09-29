<template>
    <h1>Page One</h1>
    
    <div v-for="movie in movies" :key="movie.title">
        {{ movie.title }}
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

console.log('Composant PageOne créé');
const movies = ref([]);

async function callAPI() {
    console.log('Démarrage de l\'appel API pour récupérer les films...');
    try {
        const url = 'https://raw.githubusercontent.com/Chocolaterie/EniWebService/main/api/movies.json';
        console.log('Récupération depuis l\'URL:', url);
        
        const res = await fetch(url);
        console.log('Statut de la réponse API:', res.status);
        console.log('Réponse API OK:', res.ok);
        
        if (!res.ok) {
            throw new Error(`Erreur HTTP ! statut: ${res.status}`);
        }
        
        const data = await res.json();
        console.log('Données API reçues:', data);
        console.log('Nombre de films:', data.length);
        
        movies.value = data;
        console.log('Tableau des films mis à jour:', movies.value);
    } catch (error) {
        console.error('Erreur lors de la récupération des films:', error);
        console.error('Détails de l\'erreur:', {
            message: error.message,
            stack: error.stack
        });
    }
}

onMounted(() => {
    console.log('Composant PageOne monté, appel de l\'API...');
    callAPI();
});
</script>