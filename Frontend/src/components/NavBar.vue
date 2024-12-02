<template>
  <nav class="navbar">
    <div class="nav-brand">Mon Application</div>
    <div class="nav-links">
      <span class="user-name">Bienvenue, {{ userName }}</span>
      <router-link v-if="!userData?.user.est_admin" to="/home_user">Accueil</router-link>
      <router-link v-else to="/home_admin">Accueil</router-link>

      <a @click="logout" class="logout-btn">Déconnexion</a>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navbar',
  data() {
    return {
      userName: '',
    }
  },
  created() {
    // Récupérer les données utilisateur du localStorage
    const userData = localStorage.getItem('user')
    if (userData) {
      const user = JSON.parse(userData)
      this.userName = user.user.login
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('user')
      this.$router.push('/')
    },
  },
}
</script>

<style scoped>
.navbar {
  background-color: #333;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.nav-brand {
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-links {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav-links a {
  color: white;
  text-decoration: none;
  cursor: pointer;
  font-size: 1.2rem;
}

.nav-links a:hover {
  color: #4caf50;
}

.user-name {
  color: #4caf50;
  font-weight: bold;
  font-size: 1.1rem;
}

.logout-btn {
  color: #ff4444 !important;
}
</style>
