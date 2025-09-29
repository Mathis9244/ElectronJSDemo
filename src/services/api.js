import axios from 'axios';

// On configure axios pour qu'il parle avec notre API locale
const api = axios.create({
  baseURL: 'http://localhost:3001', // L'API est sur le port 3001
  headers: {
    'Content-Type': 'application/json', // On envoie du JSON
  },
});

// Ce truc s'exécute à chaque requête pour ajouter le token de connexion
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // On récupère le token stocké
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // On l'ajoute dans les headers
    }
    return config;
  },
  (error) => {
    return Promise.reject(error); // Si ça plante, on renvoie l'erreur
  }
);

// Ce truc s'exécute à chaque réponse pour gérer les erreurs
api.interceptors.response.use(
  (response) => {
    return response; // Si tout va bien, on renvoie la réponse
  },
  (error) => {
    if (error.response?.status === 401) {
      // Ah merde, le token est expiré ou invalide
      localStorage.removeItem('authToken'); // On vire le token pourri
      window.location.href = '#/login'; // On redirige vers la page de connexion
    }
    return Promise.reject(error); // On renvoie l'erreur
  }
);

// Service d'authentification - tout ce qui concerne la connexion
export const authService = {
  // Fonction pour se connecter
  async login(email, password) {
    try {
      const response = await api.post('/login', { email, password }); // On envoie email et mot de passe
      if (response.data.code === '200') {
        localStorage.setItem('authToken', response.data.data); // On stocke le token si ça marche
        return { success: true, data: response.data.data };
      }
      return { success: false, message: response.data.message }; // Sinon on dit que ça a foiré
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Erreur de connexion' // Message d'erreur générique
      };
    }
  },

  // Fonction pour s'inscrire
  async signup(userData) {
    try {
      const response = await api.post('/signup', userData); // On envoie toutes les données du formulaire
      if (response.data.code === '200') {
        return { success: true, data: response.data.data }; // Ça a marché !
      }
      return { success: false, message: response.data.message }; // Ça a foiré
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Erreur d\'inscription' // Message d'erreur
      };
    }
  },

  // Fonction pour se déconnecter - on vire juste le token
  logout() {
    localStorage.removeItem('authToken'); // Bye bye le token
  },

  // Fonction pour vérifier si l'utilisateur est connecté
  isAuthenticated() {
    return !!localStorage.getItem('authToken'); // Si y'a un token, c'est qu'il est connecté
  }
};

// Service des articles - tout ce qui concerne les articles
export const articleService = {
// Fonction pour récupérer tous les articles
async getArticles() {
  try {
    console.log('🔄 Demande des articles à l\'API...');
    const response = await api.get('/articles'); // On demande la liste des articles
    console.log('📡 Réponse de l\'API:', response.data);
    if (response.data.code === '200') {
      console.log('Articles récupérés avec succès:', response.data.data);
      return { success: true, data: response.data.data }; // Ça a marché, on renvoie les articles
    }
    console.log('Erreur API:', response.data.message);
    return { success: false, message: response.data.message }; // Ça a foiré
  } catch (error) {
    console.log('Erreur lors de la récupération des articles:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Erreur lors de la récupération des articles'
    };
  }
},

  // Fonction pour récupérer un article spécifique par son ID
  async getArticle(id) {
    try {
      const response = await api.get(`/articles/${id}`); // On demande l'article avec cet ID
      if (response.data.code === '200') {
        return { success: true, data: response.data.data }; // On renvoie l'article
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Erreur lors de la récupération de l\'article' 
      };
    }
  },

  // Fonction pour créer ou modifier un article (c'est la même route côté API)
  async saveArticle(articleData) {
    try {
      console.log('📤 Envoi des données à l\'API:', articleData);
      const response = await api.post('/articles/save', articleData); // On envoie les données de l'article
      console.log('📥 Réponse de l\'API:', response.data);
      
      if (response.data.code === '200') {
        console.log('Article sauvegardé avec succès:', response.data.data);
        return { success: true, data: response.data.data }; // Ça a marché !
      }
      console.log('Erreur API:', response.data.message);
      return { success: false, message: response.data.message };
    } catch (error) {
      console.log('Erreur lors de la sauvegarde:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Erreur lors de la sauvegarde de l\'article' 
      };
    }
  },

  // Fonction pour supprimer un article
  async deleteArticle(id) {
    try {
      const response = await api.delete(`/articles/${id}`); // On supprime l'article avec cet ID
      if (response.data.code === '200') {
        return { success: true, message: response.data.message }; // C'est fait !
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Erreur lors de la suppression de l\'article' 
      };
    }
  }
};

export default api;
