<script>
// import NavBar from './components/NavBar.vue'
import LoginForm from './components/LoginForm.vue'

export default {
  name: 'App',
  components: {
    // NavBar,
    LoginForm,
  },
}
</script>

<template>
  <div id="app">
    <div class="main-content">
      <LoginForm />
    </div>
  </div>
</template>

<style>
#app {
  font-family: Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

body {
  margin: 0;
  padding: 0;
  background-color: #f5f6fa;
}

.main-content {
  padding-top: 80px; /* Espace pour la navbar fixe */
  min-height: calc(100vh - 80px);
}
</style>
