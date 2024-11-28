class ConversationService {
  constructor() {
    this.conversations = new Map();
  }

  createConversation() {
    const conversationId = Date.now().toString();
    this.conversations.set(conversationId, []);
    return conversationId;
  }

  async addMessage(conversationId, message, role) {
    if (!this.conversations.has(conversationId)) {
      throw new Error("Conversation non trouvée");
    }

    const newMessage = {
      id: Date.now(),
      content: message,
      role,
      timestamp: new Date(),
    };

    const conversation = this.conversations.get(conversationId);
    conversation.push(newMessage);
    this.conversations.set(conversationId, conversation);

    return newMessage;
  }

  getConversation(conversationId) {
    if (!this.conversations.has(conversationId)) {
      throw new Error("Conversation non trouvée");
    }
    return this.conversations.get(conversationId);
  }

  deleteConversation(conversationId) {
    if (!this.conversations.has(conversationId)) {
      throw new Error("Conversation non trouvée");
    }
    return this.conversations.delete(conversationId);
  }
}

module.exports = new ConversationService();
