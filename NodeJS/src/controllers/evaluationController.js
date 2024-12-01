const AIService = require("../services/aiService");
const Evaluation = require("../models/Evaluation");

class EvaluationController {
  async startEvaluation(req, res) {
    try {
      const questions = await AIService.generateQuestions();
      req.session.questions = questions; // Stockage temporaire des questions
      res.json({ questions });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erreur lors de la génération des questions" });
    }
  }

  async evaluateAnswer(req, res) {
    try {
      const { questionNumber, question, answer } = req.body;
      const evaluation = await AIService.evaluateAnswer(
        question,
        answer,
        questionNumber
      );
      res.json({ evaluation });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erreur lors de l'évaluation de la réponse" });
    }
  }

  async finishEvaluation(req, res) {
    try {
      const { userId, answers } = req.body;
      const finalEvaluation = await AIService.generateFinalEvaluation(answers);

      // Sauvegarde dans la base de données
      const evaluation = await Evaluation.create(
        userId,
        finalEvaluation.note,
        finalEvaluation.remarque
      );

      res.json({ evaluation });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erreur lors de la finalisation de l'évaluation" });
    }
  }
}

module.exports = new EvaluationController();
