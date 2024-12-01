<template>
  <div class="job-detail">
    <Navbar />
    <div class="detail-container">
      <router-link to="/" class="back-btn">← Retour aux offres</router-link>

      <div v-if="job" class="job-content">
        <h1>{{ job.titre }}</h1>

        <div class="job-info">
          <div class="info-group">
            <h3>Informations générales</h3>
            <p><strong>Service :</strong> {{ job.nom_service }}</p>
            <p><strong>Type de contrat :</strong> {{ job.type_contract }}</p>
            <p><strong>Catégorie :</strong> {{ job.categorie }}</p>
          </div>

          <div class="info-group">
            <h3>Rémunération</h3>
            <p><strong>Salaire :</strong> {{ job.salaire_min }}€ - {{ job.salaire_max }}€</p>
          </div>

          <div class="info-group">
            <h3>Dates</h3>
            <p><strong>Date de publication :</strong> {{ formatDate(job.date_publication) }}</p>
            <p><strong>Date limite :</strong> {{ formatDate(job.date_limite_candidature) }}</p>
          </div>

          <div class="info-group description">
            <h3>Description du poste</h3>
            <p>{{ job.description }}</p>
          </div>
        </div>

        <button @click="postuler" class="apply-btn" :disabled="job.statut !== 'Actif'">
          Postuler à cette offre
        </button>
      </div>

      <div v-else class="loading">Chargement...</div>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import axios from 'axios'

export default {
  name: 'JobDetail',
  components: {
    Navbar,
  },
  data() {
    return {
      job: null,
    }
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString('fr-FR')
    },
    async fetchJob() {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/offres/${this.$route.params.id}`,
        )
        this.job = response.data
      } catch (error) {
        console.error('Erreur lors de la récupération du job:', error)
      }
    },
    async postuler() {
      try {
        const userData = JSON.parse(localStorage.getItem('user'))
        if (!userData) {
          alert('Veuillez vous connecter pour postuler')
          this.$router.push('/login')
          return
        }

        const response = await axios.post('http://localhost:3000/api/candidatures', {
          id_offre: this.job.id_offre,
          id_user: userData.user.id,
          cv: 'URL_du_CV',
          lettre_motivation: 'URL_de_la_lettre',
          date_candidature: new Date().toISOString().split('T')[0],
        })

        alert('Candidature envoyée avec succès!')
        this.$router.push('/')
      } catch (error) {
        console.error('Erreur lors de la candidature:', error)
        const message = error.response?.data?.message || "Erreur lors de l'envoi de la candidature"
        alert(message)
      }
    },
  },
  created() {
    this.fetchJob()
  },
}
</script>

<style scoped>
.detail-container {
  padding: 2rem;
  margin-top: 4rem;
  min-height: calc(100vh - 4rem);
  background: #121212;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
  color: white;
}

.back-btn {
  display: inline-block;
  color: #4caf50;
  text-decoration: none;
  margin-bottom: 20px;
}

.job-content {
  background: #1e1e1e;
  border-radius: 8px;
  padding: 30px;
}

h1 {
  color: #4caf50;
  margin-bottom: 30px;
}

.job-info {
  display: grid;
  gap: 30px;
}

.info-group {
  background: #2a2a2a;
  padding: 20px;
  border-radius: 6px;
}

.info-group h3 {
  color: #4caf50;
  margin-bottom: 15px;
}

.description {
  grid-column: 1 / -1;
}

.apply-btn {
  display: block;
  width: 100%;
  max-width: 300px;
  margin: 30px auto 0;
  padding: 15px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.1em;
}

.apply-btn:hover {
  background: #45a049;
}

.apply-btn:disabled {
  background: #666;
  cursor: not-allowed;
}

.loading {
  text-align: center;
  padding: 50px;
}
</style>
