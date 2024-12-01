<template>
  <div class="job-card">
    <h3>{{ job.titre }}</h3>
    <div class="job-info">
      <p><strong>Service :</strong> {{ job.nom_service }}</p>
      <p><strong>Type de contrat :</strong> {{ job.type_contract }}</p>
      <p><strong>Catégorie :</strong> {{ job.categorie }}</p>
      <p><strong>Salaire :</strong> {{ job.salaire_min }}€ - {{ job.salaire_max }}€</p>
      <p><strong>Date limite :</strong> {{ formatDate(job.date_limite_candidature) }}</p>
    </div>
    <div class="job-description">
      <p>{{ job.description }}</p>
    </div>
    <button
      class="apply-btn"
      @click="$emit('postuler', job.id_offre)"
      :disabled="job.statut !== 'Actif'"
    >
      Postuler
    </button>
  </div>
</template>

<script>
export default {
  name: 'JobCard',
  props: {
    job: {
      type: Object,
      required: true,
    },
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString('fr-FR')
    },
  },
}
</script>

<style scoped>
.job-card {
  background: #1e1e1e;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  color: white;
}

h3 {
  color: #4caf50;
  margin-bottom: 15px;
}

.job-info {
  margin-bottom: 15px;
}

.job-info p {
  margin: 5px 0;
}

.job-description {
  margin-bottom: 15px;
  white-space: pre-line;
}

.apply-btn {
  background: #4caf50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.apply-btn:hover {
  background: #45a049;
}

.apply-btn:disabled {
  background: #666;
  cursor: not-allowed;
}
</style>
