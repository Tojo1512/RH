const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobController");

// Routes pour les offres d'emploi et candidatures
router.get("/offres", jobController.getAllJobs);
router.get("/offres/:id", jobController.getJobById);
router.post("/candidatures", jobController.submitApplication);
router.get("/candidatures/:userId", jobController.getUserApplications);

// Ajout de la nouvelle route pour toutes les candidatures
router.get("/candidatures", jobController.getAllApplications);
// Route pour mettre à jour le statut d'une candidature
router.put("/candidatures/:id", jobController.updateApplicationStatus);

module.exports = router;
