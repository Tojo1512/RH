<template>
  <div class="login-container">
    <form @submit.prevent="handleLogin" class="login-form">
      <h2>Connexion</h2>

      <div class="form-group">
        <label for="login">Login</label>
        <input type="text" id="login" v-model="login" required placeholder="Votre login" />
      </div>

      <div class="form-group">
        <label for="mdp">Mot de passe</label>
        <input type="password" id="mdp" v-model="mdp" required placeholder="Votre mot de passe" />
      </div>

      <button type="submit">Se connecter</button>

      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'LoginForm',
  data() {
    return {
      login: '',
      mdp: '',
      error: null,
    }
  },
  methods: {
    async handleLogin() {
      try {
        const response = await axios.post('/api/login', {
          login: this.login,
          mdp: this.mdp,
        })

        if (response.data.success) {
          localStorage.setItem('user', JSON.stringify(response.data))
          if (JSON.parse(localStorage.getItem('user')).user.est_admin) {
            this.$router.push('/home_admin')
          } else {
            this.$router.push('/home_user')
          }
        }
      } catch (error) {
        if (error.response?.status === 401) {
          this.error = 'Login ou mot de passe incorrect'
        } else {
          this.error = 'Une erreur est survenue, veuillez réessayer'
        }
      }
    },
  },
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.login-form {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
}

input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 0.75rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

.error {
  color: red;
  margin-top: 1rem;
  text-align: center;
}
</style>
