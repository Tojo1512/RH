<template>
  <div>
    <Navbar />
    <div class="home-container">
      <h1>Bienvenue {{ userData?.login }}</h1>
      <div class="content">
        <!-- Ajoutez ici le contenu de votre page d'accueil -->
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'

export default {
  name: 'Home',
  components: {
    Navbar,
  },
  data() {
    return {
      userData: null,
    }
  },
  created() {
    // Récupérer les données utilisateur du localStorage
    const userStr = localStorage.getItem('user')
    if (userStr) {
      this.userData = JSON.parse(userStr)
    } else {
      this.$router.push('/login')
    }
  },
}
</script>

<style scoped>
.home-container {
  padding: 2rem;
  margin-top: 4rem;
}

h1 {
  color: #333;
  margin-bottom: 2rem;
}

.content {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
