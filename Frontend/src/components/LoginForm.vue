<template>
  <div class="login-container">
    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <form @submit.prevent="handleLogin" class="login-form">
      <h2>Connexion</h2>

      <div class="form-group">
        <label for="login">Login:</label>
        <input
          type="text"
          id="login"
          v-model="formData.login"
          required
          :class="{ error: validationErrors.login }"
        />
        <span v-if="validationErrors.login" class="error-text">
          {{ validationErrors.login }}
        </span>
      </div>

      <div class="form-group">
        <label for="password">Mot de passe:</label>
        <input
          type="password"
          id="password"
          v-model="formData.mdp"
          required
          :class="{ error: validationErrors.mdp }"
        />
        <span v-if="validationErrors.mdp" class="error-text">
          {{ validationErrors.mdp }}
        </span>
      </div>

      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Connexion en cours...' : 'Se connecter' }}
      </button>
    </form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'LoginForm',
  data() {
    return {
      formData: {
        login: '',
        mdp: '',
      },
      error: null,
      validationErrors: {},
      isLoading: false,
    }
  },
  methods: {
    async handleLogin() {
      this.error = null
      this.validationErrors = {}
      this.isLoading = true

      try {
        if (!this.formData.login.trim()) {
          this.validationErrors.login = 'Le login est requis'
          return
        }
        if (!this.formData.mdp.trim()) {
          this.validationErrors.mdp = 'Le mot de passe est requis'
          return
        }

        const response = await axios.post('http://localhost:3000/api/login', this.formData)

        localStorage.setItem('user', JSON.stringify(response.data.user))
        this.$emit('login-success', response.data.user)
        this.$router.push('/home')
      } catch (error) {
        if (error.response) {
          switch (error.response.status) {
            case 401:
              this.error = 'Login ou mot de passe incorrect'
              break
            case 400:
              this.error = 'Données invalides'
              break
            default:
              this.error = 'Une erreur est survenue, veuillez réessayer'
          }
        } else if (error.request) {
          this.error = 'Impossible de contacter le serveur'
        } else {
          this.error = 'Une erreur est survenue'
        }
      } finally {
        this.isLoading = false
      }
    },
  },
}
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

h2 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-weight: bold;
  color: #2c3e50;
}

input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

input.error {
  border-color: #e74c3c;
}

.error-message {
  background-color: #ffebee;
  color: #c62828;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.error-text {
  color: #e74c3c;
  font-size: 0.875rem;
}

button {
  padding: 0.75rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.2s;
}

button:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background-color: #2980b9;
}
</style>
