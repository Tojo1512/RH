<template>
  <div class="evaluation-card">
    <!-- Sélection du thème -->
    <div v-if="!evaluationStarted" class="theme-selection">
      <h2>Sur quel thème souhaitez-vous être évalué ?</h2>
      <div class="theme-input">
        <input
          type="text"
          v-model="theme"
          placeholder="Entrez un thème (ex: JavaScript, Marketing, Management...)"
          :disabled="loading"
          @keyup.enter="startEvaluation"
        />
        <button @click="startEvaluation" :disabled="!theme.trim() || loading" class="start-btn">
          {{ loading ? 'Chargement...' : 'Commencer' }}
        </button>
      </div>
    </div>

    <!-- Questions -->
    <div v-else-if="!evaluationFinished && currentQuestion" class="question-section">
      <div class="question-header">
        <div class="progress-info">
          <div class="progress-bar">
            <div class="progress" :style="{ width: `${(currentQuestionIndex + 1) * 20}%` }"></div>
          </div>
          <span class="question-counter">Question {{ currentQuestionIndex + 1 }}/5</span>
        </div>
        <div class="timer">⏱️ {{ formatTime(timer) }}</div>
      </div>

      <div class="question-container">
        <h3>{{ currentQuestion.question }}</h3>
        <div class="choices">
          <button
            v-for="choice in currentQuestion.choices"
            :key="choice"
            @click="selectAnswer(choice.charAt(0))"
            :class="{ selected: userAnswer === choice.charAt(0) }"
            class="choice-btn"
          >
            {{ choice }}
          </button>
        </div>
        <button @click="submitAnswer" :disabled="!userAnswer" class="submit-btn">
          {{ isLastQuestion ? 'Terminer' : 'Suivant' }}
        </button>
      </div>
    </div>

    <!-- Résultats -->
    <div v-else-if="evaluationFinished" class="results-section">
      <h2>Résultats de l'évaluation</h2>
      <div class="score">Score: {{ finalScore }}/10</div>
      <pre class="feedback">{{ feedback }}</pre>
      <button @click="resetEvaluation" class="reset-btn">Nouvelle évaluation</button>
    </div>

    <!-- Loading overlay -->
    <div v-if="loading" class="loading-overlay">
      <div class="loader"></div>
      <p>{{ loadingMessage }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'EvaluationCard',
  data() {
    return {
      theme: '',
      evaluationStarted: false,
      evaluationFinished: false,
      questions: [],
      currentQuestionIndex: 0,
      userAnswer: '',
      timer: 0,
      timerInterval: null,
      answers: [],
      finalScore: 0,
      feedback: '',
      loading: false,
      loadingMessage: '',
      questionStartTime: 0,
    }
  },
  computed: {
    currentQuestion() {
      return this.questions[this.currentQuestionIndex] || null
    },
    isLastQuestion() {
      return this.currentQuestionIndex === 4
    },
  },
  methods: {
    async startEvaluation() {
      if (!this.theme.trim() || this.loading) return

      this.loading = true
      this.loadingMessage = 'Génération des questions...'

      try {
        const response = await axios.post('/api/evaluation/questions', {
          theme: this.theme,
        })

        if (response.data.questions && response.data.questions.length === 5) {
          this.questions = response.data.questions
          this.evaluationStarted = true
          this.startTimer()
          this.questionStartTime = Date.now()
        } else {
          throw new Error('Questions invalides')
        }
      } catch (error) {
        console.error('Erreur:', error)
        alert('Erreur lors de la génération des questions')
        this.resetEvaluation()
      } finally {
        this.loading = false
      }
    },

    selectAnswer(answer) {
      this.userAnswer = answer
    },

    async submitAnswer() {
      if (!this.userAnswer) return

      const questionTime = Math.round((Date.now() - this.questionStartTime) / 1000)

      this.answers.push({
        question: this.currentQuestion.question,
        answer: this.userAnswer,
        correctAnswer: this.currentQuestion.correctAnswer,
        time: questionTime,
      })

      if (this.isLastQuestion) {
        await this.finishEvaluation()
      } else {
        this.currentQuestionIndex++
        this.userAnswer = ''
        this.questionStartTime = Date.now()
      }
    },

    async finishEvaluation() {
      this.loading = true
      this.loadingMessage = 'Analyse des réponses...'
      clearInterval(this.timerInterval)

      try {
        const userId = JSON.parse(localStorage.getItem('user'))?.id || 1
        const response = await axios.post('/api/evaluation/results', {
          userId,
          theme: this.theme,
          answers: this.answers,
        })

        this.finalScore = response.data.score
        this.feedback = response.data.feedback
        this.evaluationFinished = true
      } catch (error) {
        console.error('Erreur:', error)
        alert("Erreur lors de l'évaluation")
      } finally {
        this.loading = false
      }
    },

    startTimer() {
      this.timer = 0
      this.timerInterval = setInterval(() => {
        this.timer++
      }, 1000)
    },

    formatTime(seconds) {
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = seconds % 60
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
    },

    resetEvaluation() {
      clearInterval(this.timerInterval)
      this.theme = ''
      this.evaluationStarted = false
      this.evaluationFinished = false
      this.questions = []
      this.currentQuestionIndex = 0
      this.userAnswer = ''
      this.timer = 0
      this.timerInterval = null
      this.answers = []
      this.finalScore = 0
      this.feedback = ''
      this.loading = false
      this.loadingMessage = ''
      this.questionStartTime = 0
    },
  },
  beforeUnmount() {
    clearInterval(this.timerInterval)
  },
}
</script>

<style scoped>
.evaluation-card {
  background: #1e1e1e;
  border-radius: 12px;
  padding: 2rem;
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  position: relative;
}

.theme-selection {
  text-align: center;
}

.theme-input {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

input[type='text'] {
  width: 100%;
  padding: 0.8rem;
  border-radius: 8px;
  background: #2d2d2d;
  color: white;
  border: 1px solid #3d3d3d;
  font-size: 1rem;
  transition: all 0.3s ease;
}

input[type='text']:focus {
  outline: none;
  border-color: #4caf50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

input[type='text']::placeholder {
  color: #666;
}

input[type='text']:disabled {
  background: #222;
  cursor: not-allowed;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.progress-bar {
  width: 200px;
  height: 8px;
  background: #2d2d2d;
  border-radius: 4px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: #4caf50;
  transition: width 0.3s ease;
}

.question-counter {
  margin-left: 1rem;
  color: #888;
}

.timer {
  font-size: 1.2rem;
  color: #888;
}

.choices {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 1.5rem 0;
}

.choice-btn {
  text-align: left;
  padding: 1rem;
  background: #2d2d2d;
  border: 2px solid #3d3d3d;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.choice-btn:hover {
  background: #3d3d3d;
  border-color: #4caf50;
}

.choice-btn.selected {
  background: #4caf50;
  border-color: #4caf50;
}

.submit-btn,
.start-btn,
.reset-btn {
  background: #4caf50;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.1rem;
  transition: all 0.3s ease;
}

.submit-btn:hover,
.start-btn:hover,
.reset-btn:hover {
  background: #45a049;
}

.submit-btn:disabled,
.start-btn:disabled {
  background: #666;
  cursor: not-allowed;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4caf50;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.results-section {
  text-align: center;
}

.score {
  font-size: 2rem;
  margin: 2rem 0;
  color: #4caf50;
}

.feedback {
  text-align: left;
  background: #2d2d2d;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  white-space: pre-wrap;
}

h2,
h3 {
  color: white;
  margin-bottom: 1.5rem;
}

@media (max-width: 768px) {
  .evaluation-card {
    padding: 1rem;
  }

  .progress-bar {
    width: 150px;
  }

  .theme-input {
    padding: 0 1rem;
  }

  input[type='text'] {
    font-size: 0.9rem;
  }
}
</style>
