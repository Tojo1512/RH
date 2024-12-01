<template>
  <table class="table table-striped">
    <thead>
      <tr>
        <th v-for="(header, index) in headers" :key="index">{{ header }}</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in items" :key="index">
        <td v-for="(header, index) in headers" :key="index">{{ item[header] }}</td>
        <td>
          <button @click="$emit('edit', item)" class="btn btn-warning btn-sm me-2">Edit</button>
          <button @click="$emit('delete', item)" class="btn btn-danger btn-sm">Delete</button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: 'CrudTable',
  props: {
    headers: Array,
    items: Array,
  },
};
</script>

<style scoped>
.table {
  margin-top: 1rem;
}
</style>
