<template>
  <div class="container mt-5">
    <h1 class="text-primary">Demandes de Congé</h1>
    <CrudForm
      :fields="formFields"
      buttonText="Créer Demande"
      @submit="createDemande"
    />
    <CrudTable
      :headers="tableHeaders"
      :items="demandes"
      @edit="editDemande"
      @delete="deleteDemande"
    />
  </div>
</template>

<script>
import CrudForm from '@/components/CrudForm.vue';
import CrudTable from '@/components/CrudTable.vue';
import axios from 'axios';

export default {
  name: 'DemandesCongePage',
  components: { CrudForm, CrudTable },
  data() {
    return {
      demandes: [],
      formFields: [
        { name: 'date_demande', label: 'Date de Demande', type: 'date' },
        { name: 'date_fin', label: 'Date de Fin', type: 'date' },
        { name: 'motif', label: 'Motif', type: 'text' },
        { name: 'duree', label: 'Durée', type: 'number' },
        { name: 'est_approuvee', label: 'Approuvée', type: 'select', options: [{ value: true, text: 'Oui' }, { value: false, text: 'Non' }] },
        { name: 'id_conge', label: 'ID Congé', type: 'number' },
        { name: 'id_personnel', label: 'ID Personnel', type: 'number' },
      ],
      tableHeaders: ['date_demande', 'date_fin', 'motif', 'duree', 'est_approuvee', 'id_conge', 'id_personnel'],
    };
  },
  methods: {
    async fetchDemandes() {
      try {
        const response = await axios.get('/api/demandes_conge');
        this.demandes = response.data.data;
      } catch (error) {
        console.error('Erreur lors de la récupération des demandes:', error);
      }
    },
    async createDemande(data) {
      try {
        await axios.post('/api/demandes_conge', data);
        this.fetchDemandes();
      } catch (error) {
        console.error('Erreur lors de la création de la demande:', error);
      }
    },
    editDemande(demande) {
      // Logique pour éditer une demande
    },
    async deleteDemande(demande) {
      try {
        await axios.delete(`/api/demandes_conge/${demande.id_demande_congee}`);
        this.fetchDemandes();
      } catch (error) {
        console.error('Erreur lors de la suppression de la demande:', error);
      }
    },
  },
  created() {
    this.fetchDemandes();
  },
};
</script>

<style scoped>
h1 {
  margin-bottom: 1rem;
}
</style> 