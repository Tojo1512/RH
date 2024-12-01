<template>
  <div class="container-fluid">
    <NavBar />
    <router-view />
  </div>
</template>

<script>
import NavBar from './NavBar.vue';

export default {
  name: 'Layout',
  components: {
    NavBar,
  },
};
</script>

<style scoped>
/* Ajoutez ici des styles globaux si nécessaire */
</style> 