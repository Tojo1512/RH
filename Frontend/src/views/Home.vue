<template>
  <div class="home">
    <h1>Tableau de bord RH</h1>
    <div v-if="isAuthenticated" class="dashboard">
      <div class="welcome-card">
        <h2>Bienvenue {{ user.login }}</h2>
        <p>
          Vous êtes connecté en tant que {{ user.est_admin ? 'Administrateur' : 'Utilisateur' }}
        </p>
      </div>

      <!-- Ajoutez ici le contenu de votre dashboard -->
    </div>
    <div v-else class="unauthorized">
      <p>Veuillez vous connecter pour accéder au tableau de bord</p>
      <router-link to="/login" class="login-link"> Se connecter </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  computed: {
    isAuthenticated() {
      return !!localStorage.getItem('user')
    },
    user() {
      return JSON.parse(localStorage.getItem('user') || '{}')
    },
  },
}
</script>

<style scoped>
.home {
  padding: 2rem;
}

.dashboard {
  margin-top: 2rem;
}

.welcome-card {
  background-color: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.unauthorized {
  text-align: center;
  margin-top: 2rem;
}

.login-link {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #3498db;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}
</style>
