const aiService = require("../services/aiService");
const conversationService = require("../services/conversationService");

class ConversationController {
  async createConversation(req, res) {
    const conversationId = conversationService.createConversation();
    console.log("Conversation créée avec l'ID :", conversationId);
    res.json({ conversationId });
  }

  async sendMessage(req, res) {
    // Configuration pour le streaming de la réponse
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Transfer-Encoding", "chunked");

    try {
      const { conversationId } = req.params;
      const { message } = req.body;

      // 1. Message initial avec loader
      res.write(
        JSON.stringify({
          type: "status",
          status: "started",
          message: "Début du traitement...",
        }) + "\n"
      );

      // 2. Enregistrer et envoyer le message utilisateur
      const userMessage = await conversationService.addMessage(
        conversationId,
        message,
        "user"
      );

      res.write(
        JSON.stringify({
          type: "userMessage",
          message: userMessage,
        }) + "\n"
      );

      // 3. Indiquer que l'IA traite la demande
      res.write(
        JSON.stringify({
          type: "status",
          status: "processing",
          message: "L'IA réfléchit...",
        }) + "\n"
      );

      // 4. Obtenir la réponse de l'IA
      try {
        const aiResponse = await aiService.generateResponse(
          message,
          conversationService.getConversation(conversationId)
        );

        // 5. Sauvegarder la réponse de l'IA
        const assistantMessage = await conversationService.addMessage(
          conversationId,
          aiResponse,
          "assistant"
        );

        // 6. Envoyer la réponse finale et terminer
        res.write(
          JSON.stringify({
            type: "assistantMessage",
            message: assistantMessage,
          }) + "\n"
        );

        res.end(); // Terminer la réponse ici
      } catch (error) {
        // En cas d'erreur pendant la génération
        res.write(
          JSON.stringify({
            type: "error",
            error: error.message,
          }) + "\n"
        );

        res.end(); // Terminer la réponse en cas d'erreur
      }
    } catch (error) {
      // Ne pas utiliser res.json() ici car les headers ont peut-être déjà été envoyés
      if (!res.headersSent) {
        res.status(500).json({
          type: "error",
          error: error.message,
        });
      } else {
        res.write(
          JSON.stringify({
            type: "error",
            error: error.message,
          }) + "\n"
        );
        res.end();
      }
    }
  }

  async getConversation(req, res) {
    try {
      const { conversationId } = req.params;
      const messages = conversationService.getConversation(conversationId);
      res.json({ conversationId, messages });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async deleteConversation(req, res) {
    try {
      const { conversationId } = req.params;
      conversationService.deleteConversation(conversationId);
      res.json({ message: "Conversation supprimée" });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async checkHealth(req, res) {
    const isHealthy = await aiService.checkHealth();
    if (isHealthy) {
      res.json({ status: "ok" });
    } else {
      res.status(500).json({ status: "error", message: "IA non disponible" });
    }
  }
}

module.exports = new ConversationController();
