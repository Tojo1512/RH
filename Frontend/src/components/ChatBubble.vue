<template>
  <div class="chat-widget">
    <button v-if="!isOpen" @click="toggleChat" class="chat-bubble-button">
      <svg viewBox="0 0 24 24" class="chat-icon">
        <path
          fill="currentColor"
          d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"
        />
      </svg>
    </button>

    <div v-if="isOpen" class="chat-container">
      <div class="chat-header">
        <span>FrAssistant</span>
        <button @click="toggleChat" class="close-button">×</button>
      </div>
      <div class="chat-messages" ref="messageContainer">
        <TransitionGroup name="message">
          <div
            v-for="message in allMessages"
            :key="message.id"
            :class="['message', getMessageClass(message)]"
          >
            <template v-if="message.type === 'status'">
              <div class="typing-indicator" v-if="message.status === 'processing'">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span v-else>{{ message.content }}</span>
            </template>
            <template v-else>
              <div class="message-content">
                <div class="message-header" v-if="message.sender === 'bot'">
                  <div class="avatar">
                    <svg viewBox="0 0 24 24" class="bot-icon">
                      <path
                        fill="currentColor"
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
                      />
                    </svg>
                  </div>
                  <span class="bot-name">FrAssistant</span>
                </div>
                <div class="formatted-content" v-html="formatMessage(message.content)"></div>
              </div>
            </template>
          </div>
        </TransitionGroup>
      </div>

      <div class="chat-input">
        <input
          v-model="newMessage"
          @keyup.enter="sendMessage"
          :disabled="isLoading"
          placeholder="Écrivez votre message..."
        />
        <button @click="sendMessage" :disabled="isLoading || !newMessage.trim()">
          <span v-if="!isLoading">Envoyer</span>
          <span v-else>...</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:3000'

export default {
  name: 'ChatBubble',
  data() {
    return {
      isOpen: false,
      messages: [],
      statusMessages: [],
      newMessage: '',
      conversationId: null,
      isLoading: false,
    }
  },
  computed: {
    allMessages() {
      return [...this.messages, ...this.statusMessages]
    },
  },
  methods: {
    toggleChat() {
      this.isOpen = !this.isOpen
      if (this.isOpen && !this.conversationId) {
        this.createConversation()
      }
    },
    getMessageClass(message) {
      return {
        'user-message': message.sender === 'user',
        'bot-message': message.sender === 'bot',
        'status-message': message.type === 'status',
        'processing-message': message.status === 'processing',
        persistent: !message.type || message.type !== 'status',
      }
    },

    addWelcomeMessage() {
      this.messages.push({
        id: Date.now(),
        content:
          "Bonjour ! Je suis FrAssistant, votre assistant virtuel. Comment puis-je vous aider aujourd'hui ?",
        sender: 'bot',
        persistent: true,
      })
      this.scrollToBottom()
    },

    async createConversation() {
      try {
        const response = await axios.post('/api/conversations')
        this.conversationId = response.data.conversationId
        console.log('Conversation créée avec ID:', this.conversationId)
        this.addWelcomeMessage()
      } catch (error) {
        console.error('Erreur lors de la création de la conversation:', error)
      }
    },

    updateStatusMessage(status, content) {
      this.statusMessages = [
        {
          id: `status-${Date.now()}`,
          type: 'status',
          status,
          content,
          sender: 'bot',
        },
      ]
      this.scrollToBottom()
    },

    async sendMessage() {
      if (!this.newMessage.trim() || this.isLoading) return

      const userMessage = this.newMessage
      this.newMessage = ''
      this.isLoading = true

      if (!this.conversationId) {
        await this.createConversation()
      }

      try {
        this.messages.push({
          id: Date.now(),
          content: userMessage,
          sender: 'user',
          persistent: true,
        })

        const response = await fetch(
          `${axios.defaults.baseURL}/api/conversations/${this.conversationId}/messages`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userMessage }),
          },
        )

        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop()

          for (const line of lines) {
            if (line.trim()) {
              try {
                const data = JSON.parse(line)

                switch (data.type) {
                  case 'status':
                    this.updateStatusMessage(data.status, data.message)
                    break

                  case 'assistantMessage':
                    this.statusMessages = []
                    this.messages.push({
                      id: Date.now(),
                      content: data.message.content || data.message,
                      sender: 'bot',
                      persistent: true,
                    })
                    break
                }
                this.scrollToBottom()
              } catch (e) {
                console.error('Erreur parsing:', e)
              }
            }
          }
        }
      } catch (error) {
        console.error('Erreur:', error)
        this.messages.push({
          id: Date.now(),
          content: 'Une erreur est survenue',
          sender: 'bot',
          persistent: true,
        })
      } finally {
        this.isLoading = false
        this.statusMessages = []
        this.scrollToBottom()
      }
    },

    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.messageContainer
        container.scrollTop = container.scrollHeight
      })
    },

    formatMessage(content) {
      return content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/- (.*?)(?=\n|$)/g, '<li>$1</li>')
        .replace(/<li>/g, '<ul><li>')
        .replace(/<\/li>\n/g, '</li></ul>')
        .replace(/\n/g, '<br>')
    },
  },
  async created() {
    await this.createConversation()
  },
}
</script>

<style scoped>
.chat-widget {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

.chat-bubble-button {
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: #007bff;
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.chat-bubble-button:hover {
  transform: scale(1.1);
  background-color: #0056b3;
}

.chat-icon {
  width: 24px;
  height: 24px;
  color: white;
}

.chat-container {
  position: absolute;
  bottom: 80px;
  right: 0;
  width: 350px;
  height: 500px;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease-out;
  background-color: white;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-header {
  padding: 12px 15px;
  background-color: #007bff;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 500;
}

.close-button {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 0 5px;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.close-button:hover {
  opacity: 1;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #f8f9fa;
}

.message {
  max-width: 80%;
  padding: 10px 15px;
  border-radius: 15px;
  margin: 5px 0;
}

.user-message {
  background-color: #007bff;
  color: white;
  align-self: flex-end;
}

.bot-message {
  background-color: white;
  color: #ffffff;
  align-self: flex-start;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.chat-input {
  padding: 15px;
  background-color: white;
  border-top: 1px solid #e9ecef;
  display: flex;
  gap: 10px;
}

.chat-input input {
  flex: 1;
  padding: 10px;
  border: 1px solid #dee2e6;
  border-radius: 20px;
  outline: none;
}

.chat-input button {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
}

.chat-input button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.status-message {
  align-self: center;
  background-color: #f8f9fa;
  color: #666;
  font-size: 0.9em;
  padding: 5px 10px;
}

/* Support pour les petits écrans */
@media (max-width: 480px) {
  .chat-container {
    width: calc(100vw - 40px);
    height: calc(100vh - 120px);
    right: 20px;
  }
}

.fade-in {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.typing-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px !important;
}

.typing-indicator span {
  height: 8px;
  width: 8px;
  background: #6c757d;
  border-radius: 50%;
  margin: 0 2px;
  display: inline-block;
  animation: bounce 1.3s ease infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes bounce {
  0%,
  60%,
  100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-4px);
  }
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

input:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
}

.message-enter-active,
.message-leave-active {
  transition: all 0.3s ease;
}

.message-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.message-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.message {
  transition: all 0.3s ease;
}

.message-move {
  transition: transform 0.3s ease;
}

.typing-indicator {
  background-color: #e9ecef;
  padding: 8px 15px;
  border-radius: 15px;
  display: inline-flex;
  align-items: center;
  margin: 5px 0;
  align-self: flex-start;
}

/* Animation améliorée pour les messages */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message {
  animation: slideIn 0.3s ease forwards;
}

/* Style pour les messages persistants */
.message.persistent {
  animation: none;
}

/* Animation pour le message de bienvenue */
.bot-message:first-child {
  animation: slideInWelcome 0.5s ease-out forwards !important;
}

@keyframes slideInWelcome {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Nouveaux styles pour l'esthétique */
.message-content {
  position: relative;
  padding: 12px;
  border-radius: 15px;
}

.message-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 0.9em;
  color: #666;
}

.avatar {
  width: 24px;
  height: 24px;
  margin-right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #007bff;
  border-radius: 50%;
}

.bot-icon {
  width: 16px;
  height: 16px;
  color: white;
}

.bot-name {
  font-weight: 600;
  color: #2c3e50;
}

.bot-message {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  max-width: 80%;
  margin: 8px 0;
  padding: 12px 16px;
  line-height: 1.5;
  font-size: 1em;
  color: #2c3e50;
}

.user-message {
  background-color: #007bff;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 80%;
  margin: 8px 0 8px auto;
  padding: 12px 16px;
  line-height: 1.5;
  font-size: 1em;
}

.status-message {
  background-color: transparent;
  color: #666;
  text-align: center;
  font-style: italic;
  margin: 8px auto;
  padding: 4px 12px;
}

.typing-indicator {
  background-color: #f8f9fa;
  padding: 12px;
  border-radius: 15px;
  display: inline-flex;
  align-items: center;
  margin: 5px 0;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background-color: #007bff;
  border-radius: 50%;
  margin: 0 2px;
  display: inline-block;
  animation: bounce 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) {
  animation-delay: -0.32s;
}
.typing-indicator span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%,
  80%,
  100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

/* Animation pour les nouveaux messages */
.message-enter-active,
.message-leave-active {
  transition: all 0.3s ease;
}

.message-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.message-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Style du conteneur de chat */
.chat-container {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Style de la zone de saisie */
.chat-input {
  background-color: #f8f9fa;
  border-top: 1px solid #e9ecef;
  padding: 16px;
}

.chat-input input {
  background-color: white;
  border: 1px solid #dee2e6;
  border-radius: 20px;
  padding: 10px 16px;
  font-size: 1em;
  transition: border-color 0.3s ease;
}

.chat-input input:focus {
  outline: none;
  border-color: #007bff;
}

.chat-input button {
  background-color: #007bff;
  border-radius: 20px;
  padding: 10px 20px;
  font-size: 1em;
  transition: background-color 0.3s ease;
}

.chat-input button:hover:not(:disabled) {
  background-color: #0056b3;
}

.chat-input button:disabled {
  background-color: #b0b0b0;
  cursor: not-allowed;
}

.formatted-content {
  font-size: 1em;
  line-height: 1.6;
  color: #2c3e50;
}

.formatted-content :deep(strong) {
  color: #1a1a1a;
  font-weight: 600;
}

.formatted-content :deep(em) {
  color: #4a4a4a;
  font-style: italic;
}

.formatted-content :deep(ul) {
  margin: 8px 0;
  padding-left: 20px;
  list-style-type: none;
}

.formatted-content :deep(li) {
  position: relative;
  padding: 4px 0 4px 24px;
  margin: 4px 0;
}

.formatted-content :deep(li::before) {
  content: '•';
  color: #007bff;
  font-weight: bold;
  position: absolute;
  left: 0;
  top: 4px;
}

.bot-message {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  max-width: 85%;
  margin: 8px 0;
  padding: 16px;
  border-radius: 12px;
}

.bot-message .message-content {
  padding: 0;
}

.message-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e9ecef;
}

.bot-name {
  font-weight: 600;
  color: #2c3e50;
  font-size: 1.1em;
}

.avatar {
  width: 32px;
  height: 32px;
  margin-right: 12px;
  background-color: #007bff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bot-icon {
  width: 20px;
  height: 20px;
  color: white;
}

/* Styles pour les sections */
.formatted-content :deep(br) {
  margin-bottom: 8px;
}

/* Animation d'apparition */
.message-enter-active {
  transition: all 0.3s ease;
}

.message-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

/* Style pour les titres en gras */
.formatted-content :deep(strong) {
  display: block;
  margin: 12px 0 8px 0;
  color: #007bff;
  font-size: 1.1em;
}

/* Style pour les listes imbriquées */
.formatted-content :deep(ul ul) {
  margin-left: 16px;
}
</style>
