const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobController");

// Routes pour les offres d'emploi et candidatures
router.get("/offres", jobController.getAllJobs);
router.get("/offres/:id", jobController.getJobById);
router.post("/candidatures", jobController.submitApplication);
router.get("/candidatures/:userId", jobController.getUserApplications);

module.exports = router;
