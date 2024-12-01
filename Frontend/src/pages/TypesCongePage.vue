<template>
  <div class="container mt-5">
    <h1 class="text-primary">Types de Congé</h1>
    <CrudForm
      :fields="formFields"
      buttonText="Créer Type"
      @submit="createType"
    />
    <CrudTable
      :headers="tableHeaders"
      :items="types"
      @edit="editType"
      @delete="deleteType"
    />
  </div>
</template>

<script>
import CrudForm from '@/components/CrudForm.vue';
import CrudTable from '@/components/CrudTable.vue';
import axios from 'axios';

export default {
  name: 'TypesCongePage',
  components: { CrudForm, CrudTable },
  data() {
    return {
      types: [],
      formFields: [
        { name: 'type', label: 'Type', type: 'text' },
        { name: 'est_remunere', label: 'Rémunéré', type: 'select', options: [{ value: true, text: 'Oui' }, { value: false, text: 'Non' }] },
        { name: 'nombre', label: 'Nombre', type: 'number' },
      ],
      tableHeaders: ['type', 'est_remunere', 'nombre'],
    };
  },
  methods: {
    async fetchTypes() {
      try {
        const response = await axios.get('/api/types_conge');
        this.types = response.data.data;
      } catch (error) {
        console.error('Erreur lors de la récupération des types:', error);
      }
    },
    async createType(data) {
      try {
        await axios.post('/api/types_conge', data);
        this.fetchTypes();
      } catch (error) {
        console.error('Erreur lors de la création du type:', error);
      }
    },
    editType(type) {
      // Logique pour éditer un type
    },
    async deleteType(type) {
      try {
        await axios.delete(`/api/types_conge/${type.id_conge}`);
        this.fetchTypes();
      } catch (error) {
        console.error('Erreur lors de la suppression du type:', error);
      }
    },
  },
  created() {
    this.fetchTypes();
  },
};
</script>

<style scoped>
h1 {
  margin-bottom: 1rem;
}
</style> 