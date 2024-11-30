const express = require("express");
const router = express.Router();
const conversationController = require("../controllers/conversationController");

router.post("/conversations", conversationController.createConversation);
router.post(
  "/conversations/:conversationId/messages",
  conversationController.sendMessage
);
router.get(
  "/conversations/:conversationId",
  conversationController.getConversation
);
router.delete(
  "/conversations/:conversationId",
  conversationController.deleteConversation
);
router.get("/health", conversationController.checkHealth);

module.exports = router;
