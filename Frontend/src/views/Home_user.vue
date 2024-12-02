<template>
  <div class="home">
    <Navbar />
    <div class="home-container">
      <NotificationCenter :userId="userData?.user.id" />

      <!-- Bouton flottant pour l'évaluation -->
      <div class="evaluation-floating-button" @click="showEvaluation = true">
        <span class="evaluation-icon">📝</span>
        <span class="evaluation-text">Test de compétences</span>
      </div>

      <!-- Modal pour l'évaluation -->
      <div v-if="showEvaluation" class="evaluation-modal">
        <div class="evaluation-modal-content">
          <button class="close-button" @click="showEvaluation = false">&times;</button>
          <EvaluationCard />
        </div>
      </div>

      <!-- Contenu existant -->
      <h1>Bienvenue {{ userData?.user.login }}</h1>
      <div class="content">
        <div class="jobs-container">
          <h2>Offres d'emploi disponibles</h2>

          <!-- Liste simplifiée des offres -->
          <div class="job-list">
            <div v-for="job in jobs" :key="job.id_offre" class="job-preview">
              <h3>{{ job.titre }}</h3>
              <p class="description">{{ job.description }}...</p>
              <router-link
                :to="{ name: 'JobDetail', params: { id: job.id_offre } }"
                class="details-btn"
              >
                Voir détails
              </router-link>
            </div>
          </div>

          <!-- Pagination -->
          <div class="pagination" v-if="total > 0">
            <button
              @click="changePage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="page-btn"
            >
              Précédent
            </button>
            <span class="page-info">Page {{ currentPage }} sur {{ totalPages }}</span>
            <button
              @click="changePage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="page-btn"
            >
              Suivant
            </button>
          </div>
        </div>
      </div>
    </div>
    <ChatBubble />
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import ChatBubble from '@/components/ChatBubble.vue'
import NotificationCenter from '@/components/NotificationCenter.vue'
import EvaluationCard from '@/components/EvaluationCard.vue'
import axios from 'axios'

export default {
  name: 'Home',
  components: {
    Navbar,
    ChatBubble,
    NotificationCenter,
    EvaluationCard,
  },
  data() {
    return {
      userData: null,
      jobs: [],
      currentPage: 1,
      total: 0,
      itemsPerPage: 5,
      showEvaluation: false, // Nouvel état pour contrôler l'affichage de l'évaluation
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.total / this.itemsPerPage)
    },
  },
  methods: {
    async fetchJobs(page = 1) {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/offres?page=${page}&limit=${this.itemsPerPage}`,
        )
        this.jobs = response.data.jobs
        this.total = response.data.total
      } catch (error) {
        console.error('Erreur:', error)
      }
    },
    async changePage(page) {
      this.currentPage = page
      await this.fetchJobs(page)
      window.scrollTo(0, 0)
    },
  },
  async created() {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      this.userData = JSON.parse(userStr)
      await this.fetchJobs()
    } else {
      this.$router.push('/login')
    }
  },
}
</script>

<style scoped>
.home-container {
  padding: 2rem;
  margin-top: 4rem;
  min-height: calc(100vh - 4rem);
  background: #121212;
  width: 30cm;
  margin-left: 5%;
}

.jobs-container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  color: #fff;
  margin-bottom: 2rem;
  text-align: center;
  font-size: 2.2rem;
}

h2 {
  color: #fff;
  margin-bottom: 20px;
  text-align: center;
}

.content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.job-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
}

.job-preview {
  background: #1e1e1e;
  border-radius: 8px;
  padding: 20px;
  transition: transform 0.2s;
}

.job-preview:hover {
  transform: translateY(-2px);
}

.job-preview h3 {
  color: #4caf50;
  margin-bottom: 10px;
}

.description {
  color: #fff;
  margin-bottom: 15px;
  line-height: 1.5;
}

.details-btn {
  display: inline-block;
  background: #4caf50;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  text-decoration: none;
  transition: background-color 0.3s;
}

.details-btn:hover {
  background: #45a049;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
}

.page-btn {
  background: #333;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.page-btn:disabled {
  background: #666;
  cursor: not-allowed;
}

.page-info {
  color: white;
}

.salaire {
  color: #4caf50;
}

.evaluation-floating-button {
  position: fixed;
  bottom: 100px;
  right: 30px;
  background: #4caf50;
  color: white;
  padding: 15px 25px;
  border-radius: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition:
    transform 0.2s,
    background-color 0.2s;
  z-index: 999;
}

.evaluation-floating-button:hover {
  transform: translateY(-2px);
  background: #45a049;
}

.evaluation-icon {
  font-size: 1.2rem;
}

.evaluation-text {
  font-weight: 500;
}

.evaluation-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.evaluation-modal-content {
  position: relative;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  background: #121212;
  border-radius: 12px;
  padding: 20px;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 5px;
  z-index: 1;
}

.close-button:hover {
  color: #4caf50;
}
</style>
