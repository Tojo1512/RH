const express = require("express");
const router = express.Router();
const evaluationService = require("../services/evaluationService");

router.post("/questions", async (req, res) => {
  try {
    const { theme } = req.body;
    if (!theme) {
      return res.status(400).json({ error: "Le thème est requis" });
    }

    const questions = await evaluationService.generateQuestions(theme);
    res.json({ questions });
  } catch (error) {
    console.error("Erreur route questions:", error);
    res.status(500).json({ error: error.message || "Erreur serveur" });
  }
});

router.post("/results", async (req, res) => {
  try {
    const { userId, theme, answers } = req.body;
    if (!userId || !theme || !answers) {
      return res.status(400).json({ error: "Données manquantes" });
    }

    const results = await evaluationService.evaluateAnswers(
      userId,
      theme,
      answers
    );
    res.json(results);
  } catch (error) {
    console.error("Erreur route results:", error);
    res.status(500).json({ error: error.message || "Erreur serveur" });
  }
});

module.exports = router;
