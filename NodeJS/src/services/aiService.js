const axios = require("axios");
const config = require("../config/config");

const responseCache = new Map();

class AIService {
  async generateResponse(prompt, conversationHistory) {
    const cacheKey = this.buildCacheKey(prompt, conversationHistory);

    // Vérifier le cache
    if (responseCache.has(cacheKey)) {
      return responseCache.get(cacheKey);
    }

    try {
      console.time("AI Response Time");

      const contextPrompt = this.buildPrompt(prompt, conversationHistory);
      const response = await axios({
        method: "post",
        url: "http://localhost:11434/api/generate",
        data: {
          model: "gemma:2b",
          prompt: contextPrompt,
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
            num_predict: 150,
            num_ctx: 2048,
            num_thread: 4,
            repeat_penalty: 1.1,
          },
        },
        timeout: 30000,
      });

      console.timeEnd("AI Response Time");

      // Mettre en cache
      responseCache.set(cacheKey, response.data.response);

      return response.data.response;
    } catch (error) {
      console.error("Erreur IA:", error);
      throw new Error(
        error.code === "ECONNABORTED"
          ? "L'IA met trop de temps à répondre"
          : "Erreur de communication avec l'IA"
      );
    }
  }

  buildPrompt(prompt, conversationHistory) {
    const history = conversationHistory
      .map(
        (msg) =>
          `${msg.role === "user" ? "Utilisateur" : "Assistant"}: ${msg.content}`
      )
      .join("\n");
    return `${history}\nUtilisateur: ${prompt}\nAssistant:`;
  }

  buildCacheKey(prompt, history) {
    return `${history.length}_${prompt}`;
  }

  async checkHealth() {
    try {
      await axios.get(`${config.aiConfig.baseUrl}/api/version`);
      return true;
    } catch (error) {
      return false;
    }
  }
}

module.exports = new AIService();
