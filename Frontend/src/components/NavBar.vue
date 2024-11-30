<template>
  <nav class="navbar">
    <div class="nav-brand">
      <router-link to="/home">RH Manager</router-link>
    </div>

    <div class="nav-items">
      <template v-if="currentUser">
        <span class="user-info"> Bienvenue, {{ currentUser.login }} </span>
        <button @click="handleLogout" class="logout-btn">Déconnexion</button>
      </template>
      <template v-else>
        <router-link to="/login" class="login-btn"> Connexion </router-link>
      </template>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'NavBar',
  data() {
    return {
      currentUser: null,
    }
  },
  created() {
    // Vérifier l'utilisateur au chargement
    this.checkUser()
    // Écouter les changements de l'utilisateur
    window.addEventListener('storage', this.checkUser)
  },
  methods: {
    checkUser() {
      const userStr = localStorage.getItem('user')
      this.currentUser = userStr ? JSON.parse(userStr) : null
    },
    handleLogout() {
      localStorage.removeItem('user')
      this.currentUser = null
      this.$router.push('/login')
    },
  },
  beforeUnmount() {
    // Nettoyer l'écouteur d'événements
    window.removeEventListener('storage', this.checkUser)
  },
}
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: #2c3e50;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  z-index: 1000;
  height: 60px; /* Hauteur fixe pour la navbar */
}

.nav-brand a {
  color: white;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-items {
  display: flex;
  align-items: center;
  gap: 1rem;
  z-index: 1001; /* S'assurer que les éléments sont cliquables */
}

.user-info {
  margin-right: 1rem;
  color: white;
}

.logout-btn,
.login-btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  z-index: 1001; /* S'assurer que les boutons sont cliquables */
}

.logout-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
}

.login-btn {
  background-color: #3498db;
  color: white;
  text-decoration: none;
  display: inline-block; /* Assure que le lien est cliquable */
}

.logout-btn:hover {
  background-color: #c0392b;
}

.login-btn:hover {
  background-color: #2980b9;
}
</style>
