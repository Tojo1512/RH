<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Gestion des Congés</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Accueil</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/app">Application</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/demandes-conge">Demandes de Congé</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/droit-conge">Droits de Congé</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/types-conge">Types de Congé</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'NavBar',
};
</script>

<style scoped>
.navbar {
  margin-bottom: 20px;
}
</style> 