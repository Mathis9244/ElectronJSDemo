<template>
  <div class="uk-container uk-container-large uk-margin-top">
    <!-- En-tête de la page avec les boutons d'action -->
    <div class="uk-flex uk-flex-between uk-flex-middle uk-margin-bottom">
      <h1>Gestion des Articles</h1>
      <div>
        <!-- Bouton pour créer un nouvel article -->
        <button 
          class="uk-button uk-button-primary uk-margin-right" 
          @click="createNewArticle"
        >
          <span uk-icon="plus"></span> Nouvel Article
        </button>
        <!-- Bouton de déconnexion -->
        <button 
          class="uk-button uk-button-secondary" 
          @click="handleLogout"
        >
          <span uk-icon="sign-out"></span> Déconnexion
        </button>
      </div>
    </div>

    <!-- Indicateur de chargement -->
    <div v-if="loading" class="uk-text-center uk-margin-large">
      <div uk-spinner="ratio: 2"></div>
      <p>Chargement des articles...</p>
    </div>

    <!-- Grille des articles -->
    <div v-else-if="articles.length > 0" class="uk-grid-small uk-child-width-1-1@s uk-child-width-1-2@m uk-child-width-1-3@l" uk-grid>
      <div v-for="article in articles" :key="article.id" class="uk-margin-bottom">
        <!-- Carte d'un article -->
        <div class="uk-card uk-card-default uk-card-hover uk-width-1-1">
          <!-- Image de l'article -->
          <div class="uk-card-media-top">
            <img 
              :key="`${article.id}-${imageRefreshKey}`"
              :src="article.imgPath || 'https://picsum.photos/300/200?random=' + article.id" 
              :alt="article.title" 
              class="article-image uk-width-1-1" 
              crossorigin="anonymous"
              @error="console.log('Erreur image:', article.imgPath, $event)"
              @load="console.log('Image chargée:', article.imgPath)"
            />
          </div>
          <!-- En-tête de la carte avec titre et date -->
          <div class="uk-card-header">
            <h3 class="uk-card-title uk-margin-remove-bottom">{{ article.title }}</h3>
          
          </div>
          <!-- Corps de la carte avec contenu et infos -->
          <div class="uk-card-body">
            <p class="uk-text-truncate">{{ article.desc || article.content }}</p>
            <div class="uk-text-meta">
              <span v-if="article.author" class="uk-margin-right">
                <span uk-icon="user"></span> {{ article.author }}
              </span>
              <span v-if="article.category" class="uk-label uk-label-success">
                {{ article.category }}
              </span>
            </div>
          </div>
          <!-- Pied de la carte avec les boutons d'action -->
          <div class="uk-card-footer">
            <div class="uk-flex uk-flex-between uk-flex-middle">
              <!-- Bouton pour voir l'article en détail -->
              <router-link 
                :to="`/articles/${article.id}`" 
                class="uk-button uk-button-text"
              >
                <span uk-icon="eye"></span> Voir
              </router-link>
              <div>
                <!-- Bouton pour modifier l'article -->
                <button 
                  class="uk-button uk-button-text uk-text-warning uk-margin-right" 
                  @click="editArticle(article)"
                  title="Modifier"
                >
                  <span uk-icon="pencil"></span>
                </button>
                <!-- Bouton pour supprimer l'article -->
                <button 
                  class="uk-button uk-button-text uk-text-danger" 
                  @click="confirmDelete(article)"
                  title="Supprimer"
                >
                  <span uk-icon="trash"></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

        <!-- Message si aucun article -->
        <div v-else class="uk-text-center uk-margin-large">
          <div class="uk-card uk-card-default uk-card-body">
            <span uk-icon="icon: file-text; ratio: 3" class="uk-text-muted"></span>
            <h3>Aucun article trouvé</h3>
            <p>Commencez par créer votre premier article !</p>
            <button
              class="uk-button uk-button-primary"
              @click="createNewArticle"
            >
              <span uk-icon="plus"></span> Créer un article
            </button>
          </div>
        </div>


    <!-- Message d'erreur -->
    <div v-if="errorMessage" class="uk-alert-danger uk-margin" uk-alert>
      <a class="uk-alert-close" uk-close></a>
      <p>{{ errorMessage }}</p>
    </div>

    <!-- Modal de création/modification d'article -->
    <div id="article-modal" uk-modal>
      <div class="uk-modal-dialog uk-modal-body">
        <button class="uk-modal-close-default" type="button" uk-close></button>
        <h2 class="uk-modal-title">{{ editingArticle ? 'Modifier l\'article' : 'Nouvel article' }}</h2>
        
        <form @submit.prevent="saveArticle" class="uk-form-stacked">
          <div class="uk-margin">
            <label class="uk-form-label" for="title">Titre</label>
            <div class="uk-form-controls">
              <input 
                class="uk-input" 
                id="title" 
                type="text" 
                v-model="articleForm.title" 
                required
                placeholder="Titre de l'article"
              />
            </div>
          </div>

          <div class="uk-margin">
            <label class="uk-form-label" for="content">Contenu</label>
            <div class="uk-form-controls">
              <textarea 
                class="uk-textarea" 
                id="content" 
                v-model="articleForm.content" 
                required
                rows="5"
                placeholder="Contenu de l'article"
              ></textarea>
            </div>
          </div>

          <div class="uk-margin">
            <label class="uk-form-label" for="imgPath">URL de l'image</label>
            <div class="uk-form-controls">
              <input 
                class="uk-input" 
                id="imgPath" 
                type="url" 
                v-model="articleForm.imgPath" 
                placeholder="https://exemple.com/image.jpg"
              />
            </div>
          </div>

          <div class="uk-grid-small uk-child-width-1-2" uk-grid>
            <div>
              <label class="uk-form-label" for="author">Auteur</label>
              <div class="uk-form-controls">
                <input 
                  class="uk-input" 
                  id="author" 
                  type="text" 
                  v-model="articleForm.author" 
                  placeholder="Nom de l'auteur"
                />
              </div>
            </div>
            <div>
              <label class="uk-form-label" for="category">Catégorie</label>
              <div class="uk-form-controls">
                <input 
                  class="uk-input" 
                  id="category" 
                  type="text" 
                  v-model="articleForm.category" 
                  placeholder="Catégorie"
                />
              </div>
            </div>
          </div>

          <div class="uk-margin uk-flex uk-flex-right">
            <button 
              class="uk-button uk-button-default uk-margin-right" 
              type="button"
              @click="closeModal"
            >
              Annuler
            </button>
            <button 
              class="uk-button uk-button-primary" 
              type="submit"
              :disabled="saving"
            >
              <span v-if="saving" uk-spinner="ratio: 0.8"></span>
              {{ saving ? 'Sauvegarde...' : 'Sauvegarder' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de confirmation de suppression -->
    <div id="delete-modal" uk-modal>
      <div class="uk-modal-dialog uk-modal-body">
        <button class="uk-modal-close-default" type="button" uk-close></button>
        <h2 class="uk-modal-title">Confirmer la suppression</h2>
        <p>Êtes-vous sûr de vouloir supprimer l'article "{{ articleToDelete?.title }}" ?</p>
        <p class="uk-text-danger">Cette action est irréversible.</p>
        <div class="uk-margin uk-flex uk-flex-right">
          <button 
            class="uk-button uk-button-default uk-margin-right" 
            type="button"
            @click="closeDeleteModal"
          >
            Annuler
          </button>
          <button 
            class="uk-button uk-button-danger" 
            type="button"
            @click="deleteArticle"
            :disabled="deleting"
          >
            <span v-if="deleting" uk-spinner="ratio: 0.8"></span>
            {{ deleting ? 'Suppression...' : 'Supprimer' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { articleService, authService } from '../services/api.js';

const router = useRouter(); // Pour naviguer

// Variables réactives pour l'état de l'interface
const loading = ref(false); // Indique si on charge les articles
const saving = ref(false); // Indique si on sauvegarde un article
const deleting = ref(false); // Indique si on supprime un article
const errorMessage = ref(''); // Message d'erreur à afficher
const articles = ref([]); // Liste des articles
const showCreateModal = ref(false); // Indique si le modal est ouvert
const editingArticle = ref(null); // Article en cours d'édition
const articleToDelete = ref(null); // Article à supprimer
const imageRefreshKey = ref(0); // Clé pour forcer le rechargement des images

// Données du formulaire d'article
const articleForm = reactive({
  title: '',
  content: '',
  author: '',
  category: '',
  imgPath: ''
});

// Fonction pour charger tous les articles depuis l'API
const loadArticles = async () => {
  loading.value = true; // On active le loading
  errorMessage.value = ''; // On efface les erreurs

  try {
    const result = await articleService.getArticles(); // On demande les articles à l'API
    if (result.success) {
      console.log('Articles chargés:', result.data); // Debug pour voir les données
      articles.value = result.data; // On met à jour la liste
    } else {
      errorMessage.value = result.message; // On affiche l'erreur
    }
  } catch (error) {
    errorMessage.value = 'Erreur lors du chargement des articles';
    console.error('Erreur:', error);
  } finally {
    loading.value = false; // On désactive le loading
  }
};

// Fonction pour sauvegarder un article (création ou modification)
const saveArticle = async () => {
  saving.value = true; // On active le loading
  errorMessage.value = ''; // On efface les erreurs

  try {
    // On prépare les données en mappant correctement les champs
    const articleData = {
      title: articleForm.title,
      desc: articleForm.content, // L'API utilise 'desc' au lieu de 'content'
      author: articleForm.author,
      category: articleForm.category,
      imgPath: articleForm.imgPath, // URL de l'image
      id: editingArticle.value?.id // Si on a un ID, c'est une modification
    };

    console.log('💾 Sauvegarde de l\'article:', articleData);
    console.log('🔄 Mode:', editingArticle.value ? 'Modification' : 'Création');

    const result = await articleService.saveArticle(articleData); // On envoie à l'API
    
    console.log('📡 Résultat de la sauvegarde:', result);
    
    if (result.success) {
      closeModal(); // On ferme le modal
      // On recharge immédiatement les articles
      loadArticles(); // On recharge la liste pour voir les changements
      
      // Si c'est une modification, on force le rechargement des images
      if (editingArticle.value) {
        console.log('🔄 Modification détectée, rechargement des images...');
        imageRefreshKey.value++; // Force le rechargement des images
        setTimeout(() => {
          console.log('🔄 Rechargement forcé après modification...');
          loadArticles();
          imageRefreshKey.value++; // Force encore le rechargement
        }, 1000);
      }
    } else {
      errorMessage.value = result.message; // On affiche l'erreur
    }
  } catch (error) {
    errorMessage.value = 'Erreur lors de la sauvegarde';
    console.error('Erreur:', error);
  } finally {
    saving.value = false; // On désactive le loading
  }
};

// Fonction pour créer un nouvel article
const createNewArticle = () => {
  editingArticle.value = null; // Pas d'article en édition
  // On vide le formulaire
  Object.keys(articleForm).forEach(key => {
    articleForm[key] = '';
  });
  showCreateModal.value = true; // On indique que le modal doit s'ouvrir
  setTimeout(() => {
    UIkit.modal('#article-modal').show(); // On ouvre le modal
  }, 100);
};

// Fonction pour modifier un article existant
const editArticle = (article) => {
  console.log('🔧 Modification de l\'article:', article);
  editingArticle.value = article; // On stocke l'article à modifier
  // On pré-remplit le formulaire avec les données de l'article
  articleForm.title = article.title;
  articleForm.content = article.desc || article.content || ''; // L'API utilise 'desc'
  articleForm.author = article.author || '';
  articleForm.category = article.category || '';
  articleForm.imgPath = article.imgPath || ''; // URL de l'image
  console.log('📝 Formulaire pré-rempli:', articleForm);
  showCreateModal.value = true; // On indique que le modal doit s'ouvrir
  setTimeout(() => {
    UIkit.modal('#article-modal').show(); // On ouvre le modal
  }, 100);
};

// Fonction pour confirmer la suppression d'un article
const confirmDelete = (article) => {
  articleToDelete.value = article; // On stocke l'article à supprimer
  UIkit.modal('#delete-modal').show(); // On ouvre le modal de confirmation
};

// Fonction pour supprimer définitivement un article
const deleteArticle = async () => {
  if (!articleToDelete.value) return; // Si pas d'article, on fait rien

  deleting.value = true; // On active le loading

  try {
    const result = await articleService.deleteArticle(articleToDelete.value.id); // On supprime via l'API
    if (result.success) {
      closeDeleteModal(); // On ferme le modal
      loadArticles(); // On recharge la liste pour voir les changements
    } else {
      errorMessage.value = result.message; // On affiche l'erreur
    }
  } catch (error) {
    errorMessage.value = 'Erreur lors de la suppression';
    console.error('Erreur:', error);
  } finally {
    deleting.value = false; // On désactive le loading
  }
};

// Fonction pour fermer le modal d'édition/création
const closeModal = () => {
  showCreateModal.value = false; // On indique que le modal doit se fermer
  editingArticle.value = null; // On efface l'article en édition
  // On vide le formulaire
  Object.keys(articleForm).forEach(key => {
    articleForm[key] = '';
  });
  UIkit.modal('#article-modal').hide(); // On ferme le modal
};

// Fonction pour fermer le modal de suppression
const closeDeleteModal = () => {
  articleToDelete.value = null; // On efface l'article à supprimer
  UIkit.modal('#delete-modal').hide(); // On ferme le modal
};

// Fonction pour se déconnecter
const handleLogout = () => {
  authService.logout(); // On vire le token
  router.push('/login'); // On redirige vers la page de connexion
};

// Fonction pour formater une date en français
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Fonction appelée quand le composant est monté
onMounted(() => {
  // On vérifie si l'utilisateur est connecté
  if (!authService.isAuthenticated()) {
    router.push('/login'); // Si pas connecté, on redirige
    return;
  }

  loadArticles(); // Sinon on charge les articles
});
</script>

<style scoped>
.uk-card-hover {
  transition: transform 0.2s ease;
}

.uk-card-hover:hover {
  transform: translateY(-2px);
}

.uk-text-truncate {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.uk-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Styles pour les images des articles - Responsive */
.article-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 4px 4px 0 0;
  transition: transform 0.3s ease;
  display: block;
}

.article-image:hover {
  transform: scale(1.05);
}

.uk-card-media-top {
  overflow: hidden;
  position: relative;
  width: 100%;
}

/* Responsive breakpoints pour les images */
@media (max-width: 640px) {
  .article-image {
    height: 150px;
  }
  
  .uk-card {
    margin-bottom: 1rem;
  }
}

@media (min-width: 641px) and (max-width: 960px) {
  .article-image {
    height: 180px;
  }
}

@media (min-width: 961px) {
  .article-image {
    height: 200px;
  }
}

/* Grille responsive pour les articles */
.uk-grid-small {
  gap: 1rem;
}

@media (max-width: 640px) {
  .uk-grid-small {
    gap: 0.5rem;
  }
}

/* Assurer que les cartes sont responsive */
.uk-card {
  width: 100%;
  max-width: 100%;
}

/* Responsive pour les cartes */
@media (max-width: 640px) {
  .uk-card {
    margin: 0 0.5rem 1rem 0.5rem;
  }
}
</style>
