const express = require("express");
const router = express.Router();
const conversationController = require("../controllers/conversationController");
const typesCongeController = require("../controllers/typesCongeController");
const droitCongeController = require("../controllers/droitCongeController");
const demandesCongeController = require("../controllers/demandesCongeController");
const congeController = require("../controllers/congeController");

// Routes pour les conversations
router.post("/conversations", conversationController.createConversation);
router.post("/conversations/:conversationId/messages", conversationController.sendMessage);
router.get("/conversations/:conversationId", conversationController.getConversation);
router.delete("/conversations/:conversationId", conversationController.deleteConversation);
router.get("/health", conversationController.checkHealth);

// Routes pour Types_conge
router.get("/types_conge", typesCongeController.getAll);
router.get("/types_conge/:id", typesCongeController.getById);
router.post("/types_conge", typesCongeController.create);
router.put("/types_conge/:id", typesCongeController.update);
router.delete("/types_conge/:id", typesCongeController.delete);

// Routes pour droit_conge
router.get("/droit_conge", droitCongeController.getAll);
router.get("/droit_conge/:id", droitCongeController.getById);
router.post("/droit_conge", droitCongeController.create);
router.put("/droit_conge/:id", droitCongeController.update);
router.delete("/droit_conge/:id", droitCongeController.delete);

// Routes pour Demandes_conge
router.get("/demandes_conge", demandesCongeController.getAll);
router.get("/demandes_conge/:id", demandesCongeController.getById);
router.post("/demandes_conge", demandesCongeController.create);
router.put("/demandes_conge/:id", demandesCongeController.update);
router.delete("/demandes_conge/:id", demandesCongeController.delete);

// Routes pour les vues et la fonction
router.get("/conge_dispo", congeController.getCongeDispo);
router.get("/calculer_conge_dispo/:annee", congeController.calculerCongeDispo);

module.exports = router;
