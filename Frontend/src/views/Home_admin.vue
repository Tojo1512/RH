<template>
  <div class="home">
    <Navbar />

    <div class="home-container">
      <h1>Bienvenue {{ userData?.user.login }}</h1>
      <div style="color: white; margin: 20px">
        <p>Est admin: {{ userData?.user.est_admin }}</p>
        <p>Nombre de candidatures: {{ applications.length }}</p>
      </div>

      <div class="content">
        <div v-if="userData?.user.est_admin" class="applications-container">
          <h2>Candidatures en cours</h2>
          <div v-if="loading" style="color: white; text-align: center">
            Chargement des candidatures...
          </div>
          <div v-else-if="applications.length === 0" style="color: white; text-align: center">
            Aucune candidature trouvée
          </div>
          <div v-else class="applications-list">
            <div
              v-for="application in applications"
              :key="application.id_candidature"
              class="application-preview"
            >
              <div class="application-header">
                <h4>Candidature #{{ application.id_candidature }}</h4>
                <span class="status-badge" :class="application.statut.toLowerCase()">
                  {{ application.statut }}
                </span>
              </div>
              <div class="application-info">
                <p>
                  <strong>Candidat :</strong>
                  {{ application.utilisateur?.login || 'Non renseigné' }}
                </p>
                <p>
                  <strong>Email :</strong> {{ application.utilisateur?.email || 'Non renseigné' }}
                </p>
                <p><strong>Poste :</strong> {{ application.offre?.titre || 'Non renseigné' }}</p>
                <p>
                  <strong>Date de candidature :</strong>
                  {{ formatDate(application.date_candidature) }}
                </p>
                <div class="documents">
                  <a :href="application.cv" target="_blank" class="doc-link">Voir le CV</a>
                  <a :href="application.lettre_motivation" target="_blank" class="doc-link">
                    Voir la lettre de motivation
                  </a>
                </div>
                <div class="action-buttons" v-if="application.statut === 'En attente'">
                  <button
                    @click="handleApplication(application.id_candidature, 'Acceptée')"
                    class="action-btn accept"
                  >
                    Accepter
                  </button>
                  <button
                    @click="handleApplication(application.id_candidature, 'Refusée')"
                    class="action-btn reject"
                  >
                    Refuser
                  </button>
                </div>
                <p v-else class="status-text" :class="application.statut.toLowerCase()">
                  Candidature {{ application.statut }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import NotificationCenter from '@/components/NotificationCenter.vue'
import JobCard from '@/components/JobCard.vue'
import axios from 'axios'

export default {
  name: 'Home',
  components: {
    Navbar,
    NotificationCenter,
    JobCard,
  },
  data() {
    return {
      userData: null,
      applications: [],
      loading: true,
      error: null,
      jobs: [],
      total: 0,
      currentPage: 1,
      totalPages: 1,
    }
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return 'Date non renseignée'
      return new Date(dateString).toLocaleDateString('fr-FR')
    },
    async fetchApplications() {
      this.loading = true
      try {
        console.log('Tentative de récupération des candidatures')
        const response = await axios.get('http://localhost:3000/api/candidatures')
        console.log('Réponse reçue:', response)

        if (response && response.data) {
          this.applications = Array.isArray(response.data) ? response.data : []
          console.log('Applications mises à jour:', this.applications)
        } else {
          console.error('Format de réponse invalide:', response)
          this.applications = []
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des candidatures:', error)
        this.error = error.message
        this.applications = []
      } finally {
        this.loading = false
      }
    },
    async handleApplication(candidatureId, newStatus) {
      try {
        console.log(`Traitement de la candidature ${candidatureId} avec le statut ${newStatus}`)

        const response = await axios.put(
          `http://localhost:3000/api/candidatures/${candidatureId}`,
          {
            statut: newStatus,
          },
        )

        if (response.data.success) {
          // Mettre à jour le statut localement
          const candidature = this.applications.find((app) => app.id_candidature === candidatureId)
          if (candidature) {
            candidature.statut = newStatus
          }

          // Afficher un message de succès
          alert(`La candidature a été ${newStatus.toLowerCase()} avec succès`)

          // Rafraîchir les données
          await this.fetchApplications()
        }
      } catch (error) {
        console.error('Erreur lors du traitement de la candidature:', error)
        alert('Une erreur est survenue lors du traitement de la candidature')
      }
    },
    async fetchJobs() {
      try {
        const response = await axios.get('http://localhost:3000/api/offres')
        this.jobs = response.data
        this.total = this.jobs.length
        this.totalPages = Math.ceil(this.total / 10)
      } catch (error) {
        console.error('Erreur lors de la récupération des offres:', error)
        this.error = error.message
        this.jobs = []
      }
    },
    async handleJobApplication(jobId) {
      try {
        const response = await axios.post('http://localhost:3000/api/candidatures', {
          id_offre: jobId,
          id_user: this.userData.user.id_user,
        })
        if (response.data.success) {
          alert('Votre candidature a été envoyée avec succès !')
          await this.fetchJobs() // Rafraîchir la liste des offres
        }
      } catch (error) {
        console.error('Erreur lors de la candidature:', error)
        alert("Une erreur est survenue lors de l'envoi de votre candidature")
      }
    },
  },
  async created() {
    console.log('Component created')
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        this.userData = JSON.parse(userStr)
        console.log('userData:', this.userData)
        await this.fetchApplications()
        await this.fetchJobs()
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error)
      }
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
  max-width: 1200px;
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
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
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

.applications-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.applications-list {
  margin-top: 20px;
}

.application-preview {
  background: #1e1e1e;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  color: white;
}

.application-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.application-header h4 {
  color: #4caf50;
  margin: 0;
}

.status-badge {
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.9em;
  background: #333;
}

.status-badge.en.attente {
  background: #ffa500;
  color: black;
}

.application-info p {
  margin: 8px 0;
}

.application-info strong {
  color: #4caf50;
}

.documents {
  margin-top: 15px;
  display: flex;
  gap: 10px;
}

.doc-link {
  display: inline-block;
  background: #333;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  text-decoration: none;
  transition: background-color 0.3s;
}

.doc-link:hover {
  background: #444;
}

h3 {
  color: #4caf50;
  text-align: center;
  margin-bottom: 20px;
}

.loading {
  color: white;
  text-align: center;
  padding: 20px;
}

.error {
  color: #ff4444;
  text-align: center;
  padding: 20px;
}

.action-buttons {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.action-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.action-btn.accept {
  background-color: #4caf50;
  color: white;
}

.action-btn.accept:hover {
  background-color: #45a049;
}

.action-btn.reject {
  background-color: #f44336;
  color: white;
}

.action-btn.reject:hover {
  background-color: #da190b;
}

.status-text {
  margin-top: 15px;
  font-weight: bold;
}

.status-text.acceptée {
  color: #4caf50;
}

.status-text.refusée {
  color: #f44336;
}
</style>
