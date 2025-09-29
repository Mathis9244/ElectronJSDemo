<template>
  <div class="uk-container uk-container-large uk-margin-top">
    <!-- Loading -->
    <div v-if="loading" class="uk-text-center uk-margin-large">
      <div uk-spinner="ratio: 2"></div>
      <p>Chargement de l'article...</p>
    </div>

    <!-- Article non trouvé -->
    <div v-else-if="!article" class="uk-text-center uk-margin-large">
      <div class="uk-card uk-card-default uk-card-body">
        <span uk-icon="icon: warning; ratio: 3" class="uk-text-warning"></span>
        <h3>Article non trouvé</h3>
        <p>L'article que vous recherchez n'existe pas ou a été supprimé.</p>
        <router-link to="/articles" class="uk-button uk-button-primary">
          <span uk-icon="arrow-left"></span> Retour à la liste
        </router-link>
      </div>
    </div>

    <!-- Détail de l'article -->
    <div v-else>
      <!-- Header avec boutons d'action -->
      <div class="uk-flex uk-flex-between uk-flex-middle uk-margin-bottom">
        <div>
          <button 
            class="uk-button uk-button-text uk-margin-right" 
            @click="$router.push('/articles')"
          >
            <span uk-icon="arrow-left"></span> Retour à la liste
          </button>
        </div>
        <div>
          <button 
            class="uk-button uk-button-primary uk-margin-right" 
            @click="editArticle"
          >
            <span uk-icon="pencil"></span> Modifier
          </button>
          <button 
            class="uk-button uk-button-danger" 
            @click="confirmDelete"
          >
            <span uk-icon="trash"></span> Supprimer
          </button>
        </div>
      </div>

      <!-- Contenu de l'article -->
      <div class="uk-card uk-card-default article-detail-container">
        <!-- Image de l'article -->
        <div v-if="article.imgPath" class="uk-card-media-top">
          <img :src="article.imgPath" :alt="article.title" class="article-detail-image" />
        </div>
        <div class="uk-card-header">
          <div class="uk-flex uk-flex-between uk-flex-middle">
            <div>
              <h1 class="uk-card-title uk-margin-remove-bottom">{{ article.title }}</h1>
              <div class="uk-text-meta uk-margin-top">
                <span v-if="article.author" class="uk-margin-right">
                  <span uk-icon="user"></span> {{ article.author }}
                </span>
                <span class="uk-margin-right">
                
                </span>
                <span v-if="article.category" class="uk-label uk-label-success">
                  {{ article.category }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="uk-card-body">
          <div class="uk-text-break">
            {{ article.desc || article.content }}
          </div>
        </div>
        <div class="uk-card-footer">
          <div class="uk-text-meta">
          </div>
        </div>
      </div>

      <!-- Message d'erreur -->
      <div v-if="errorMessage" class="uk-alert-danger uk-margin" uk-alert>
        <a class="uk-alert-close" uk-close></a>
        <p>{{ errorMessage }}</p>
      </div>
    </div>

    <!-- Modal de modification d'article -->
    <div id="edit-modal" uk-modal>
      <div class="uk-modal-dialog uk-modal-body">
        <button class="uk-modal-close-default" type="button" uk-close></button>
        <h2 class="uk-modal-title">Modifier l'article</h2>
        
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
                rows="8"
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
        <p>Êtes-vous sûr de vouloir supprimer l'article "{{ article?.title }}" ?</p>
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
import { useRouter, useRoute } from 'vue-router';
import { articleService, authService } from '../services/api.js';

const router = useRouter();
const route = useRoute();

const loading = ref(false);
const saving = ref(false);
const deleting = ref(false);
const errorMessage = ref('');
const article = ref(null);

const articleForm = reactive({
  title: '',
  content: '',
  author: '',
  category: '',
  imgPath: ''
});

// Charger l'article
const loadArticle = async () => {
  const articleId = route.params.id;
  if (!articleId) {
    errorMessage.value = 'ID d\'article manquant';
    return;
  }

  loading.value = true;
  errorMessage.value = '';

  try {
    const result = await articleService.getArticle(articleId);
    if (result.success) {
      article.value = result.data;
      // Pré-remplir le formulaire
      articleForm.title = article.value.title;
      articleForm.content = article.value.desc || article.value.content || '';
      articleForm.author = article.value.author || '';
      articleForm.category = article.value.category || '';
      articleForm.imgPath = article.value.imgPath || '';
    } else {
      errorMessage.value = result.message;
      article.value = null;
    }
  } catch (error) {
    errorMessage.value = 'Erreur lors du chargement de l\'article';
    console.error('Erreur:', error);
    article.value = null;
  } finally {
    loading.value = false;
  }
};

// Modifier l'article
const editArticle = () => {
  UIkit.modal('#edit-modal').show();
};

// Sauvegarder l'article
const saveArticle = async () => {
  saving.value = true;

  try {
    const articleData = {
      title: articleForm.title,
      desc: articleForm.content, // L'API utilise 'desc' au lieu de 'content'
      author: articleForm.author,
      category: articleForm.category,
      id: article.value.id
    };

    const result = await articleService.saveArticle(articleData);
    if (result.success) {
      closeModal();
      loadArticle(); // Recharger l'article
    } else {
      errorMessage.value = result.message;
    }
  } catch (error) {
    errorMessage.value = 'Erreur lors de la sauvegarde';
    console.error('Erreur:', error);
  } finally {
    saving.value = false;
  }
};

// Confirmer la suppression
const confirmDelete = () => {
  UIkit.modal('#delete-modal').show();
};

// Supprimer l'article
const deleteArticle = async () => {
  if (!article.value) return;

  deleting.value = true;

  try {
    const result = await articleService.deleteArticle(article.value.id);
    if (result.success) {
      closeDeleteModal();
      // Rediriger vers la liste des articles
      router.push('/articles');
    } else {
      errorMessage.value = result.message;
    }
  } catch (error) {
    errorMessage.value = 'Erreur lors de la suppression';
    console.error('Erreur:', error);
  } finally {
    deleting.value = false;
  }
};

// Fermer le modal
const closeModal = () => {
  UIkit.modal('#edit-modal').hide();
};

// Fermer le modal de suppression
const closeDeleteModal = () => {
  UIkit.modal('#delete-modal').hide();
};

onMounted(() => {
  // Vérifier l'authentification
  if (!authService.isAuthenticated()) {
    router.push('/login');
    return;
  }

  loadArticle();
});
</script>

<style scoped>
.uk-text-break {
  word-wrap: break-word;
  white-space: pre-wrap;
}

.uk-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.uk-card-title {
  font-size: 2rem;
  line-height: 1.2;
}

.uk-text-meta {
  font-size: 0.875rem;
}

/* Styles pour l'image de détail de l'article - Responsive */
.article-detail-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 4px 4px 0 0;
  transition: transform 0.3s ease;
}

.article-detail-image:hover {
  transform: scale(1.02);
}

.uk-card-media-top {
  overflow: hidden;
  position: relative;
}

/* Responsive breakpoints pour l'image de détail */
@media (max-width: 640px) {
  .article-detail-image {
    height: 250px;
  }
}

@media (min-width: 641px) and (max-width: 960px) {
  .article-detail-image {
    height: 300px;
  }
}

@media (min-width: 961px) and (max-width: 1200px) {
  .article-detail-image {
    height: 350px;
  }
}

@media (min-width: 1201px) {
  .article-detail-image {
    height: 400px;
  }
}

/* Container responsive pour la page de détail */
.article-detail-container {
  max-width: 100%;
  margin: 0 auto;
}

@media (min-width: 1200px) {
  .article-detail-container {
    max-width: 1000px;
  }
}
</style>
