<template>
  <div class="container mt-5">
    <h1 class="text-primary">Droits de Congé</h1>
    <CrudForm
      :fields="formFields"
      buttonText="Créer Droit"
      @submit="createDroit"
    />
    <CrudTable
      :headers="tableHeaders"
      :items="droits"
      @edit="editDroit"
      @delete="deleteDroit"
    />
  </div>
</template>

<script>
import CrudForm from '@/components/CrudForm.vue';
import CrudTable from '@/components/CrudTable.vue';
import axios from 'axios';

export default {
  name: 'DroitCongePage',
  components: { CrudForm, CrudTable },
  data() {
    return {
      droits: [],
      formFields: [
        { name: 'id_personnel', label: 'ID Personnel', type: 'number' },
        { name: 'id_conge', label: 'ID Congé', type: 'number' },
        { name: 'annee', label: 'Année', type: 'number' },
      ],
      tableHeaders: ['id_personnel', 'id_conge', 'annee'],
    };
  },
  methods: {
    async fetchDroits() {
      try {
        const response = await axios.get('/api/droit_conge');
        this.droits = response.data.data;
      } catch (error) {
        console.error('Erreur lors de la récupération des droits:', error);
      }
    },
    async createDroit(data) {
      try {
        await axios.post('/api/droit_conge', data);
        this.fetchDroits();
      } catch (error) {
        console.error('Erreur lors de la création du droit:', error);
      }
    },
    editDroit(droit) {
      // Logique pour éditer un droit
    },
    async deleteDroit(droit) {
      try {
        await axios.delete(`/api/droit_conge/${droit.id_personnel}`);
        this.fetchDroits();
      } catch (error) {
        console.error('Erreur lors de la suppression du droit:', error);
      }
    },
  },
  created() {
    this.fetchDroits();
  },
};
</script>

<style scoped>
h1 {
  margin-bottom: 1rem;
}
</style> 