<template>
  <div class="notification-center">
    <div v-for="notif in notifications" :key="notif.id" class="notification" :class="notif.type">
      <div class="notification-content">
        <span class="notification-message">{{ notif.message }}</span>
        <span class="notification-date">{{ formatDate(notif.date) }}</span>
      </div>
      <button @click="markAsRead(notif.id)" class="mark-read-btn">Marquer comme lu</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'NotificationCenter',
  props: {
    userId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      notifications: [],
    }
  },
  methods: {
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit',
      })
    },
    async fetchNotifications() {
      try {
        console.log('UserId:', this.userId)
        const response = await axios.get(`http://localhost:3000/api/notifications/${this.userId}`)
        console.log('Réponse notifications:', response.data)
        this.notifications = response.data
      } catch (error) {
        console.error('Erreur lors de la récupération des notifications:', error)
      }
    },
    async markAsRead(notificationId) {
      try {
        await axios.put(`http://localhost:3000/api/notifications/${notificationId}/read`)
        await this.fetchNotifications()
      } catch (error) {
        console.error('Erreur lors du marquage de la notification:', error)
      }
    },
  },
  created() {
    this.fetchNotifications()
    // Rafraîchir les notifications toutes les 30 secondes
    setInterval(this.fetchNotifications, 30000)
  },
}
</script>

<style scoped>
.notification-center {
  position: fixed;
  top: 80px;
  right: 20px;
  width: 300px;
  max-height: 80vh;
  overflow-y: auto;
  background: #1e1e1e;
  border-radius: 8px;
  padding: 10px;
  z-index: 1000;
}

.notification {
  background: #2d2d2d;
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 10px;
  color: white;
  border-left: 4px solid #4caf50;
}

.notification.success {
  border-left-color: #4caf50;
}

.notification.error {
  border-left-color: #f44336;
}

.notification-content {
  margin-bottom: 10px;
}

.notification-message {
  display: block;
  margin-bottom: 5px;
}

.notification-date {
  font-size: 0.8em;
  color: #888;
}

.mark-read-btn {
  background: #333;
  border: none;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9em;
  width: 100%;
}

.mark-read-btn:hover {
  background: #444;
}
</style>
