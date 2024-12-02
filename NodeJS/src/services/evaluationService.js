const aiService = require("./aiService");
const Evaluation = require("../models/evaluation");

class EvaluationService {
  async generateQuestions(theme) {
    const prompt = `Génère 5 questions sur ${theme}. Format strict:
Q1: [question courte]
Q2: ...`;

    try {
      const response = await aiService.generateResponse(prompt, [], 10000);
      const questions = this.parseQuestions(response);

      if (
        !questions ||
        questions.length !== 5 ||
        !this.validateQuestions(questions)
      ) {
        console.log(
          "Questions invalides, utilisation des questions par défaut"
        );
        return this.getDefaultQuestions(theme);
      }

      return questions;
    } catch (error) {
      console.error("Erreur génération questions:", error);
      return this.getDefaultQuestions(theme);
    }
  }

  parseQuestions(response) {
    const questions = [];
    const questionBlocks = response
      .split(/Q\d+:/)
      .filter((block) => block.trim());

    for (let i = 0; i < Math.min(5, questionBlocks.length); i++) {
      const block = questionBlocks[i].trim();
      const lines = block.split("\n").filter((line) => line.trim());

      if (lines.length < 5) continue;

      const question = {
        question: lines[0].trim(),
        choices: [],
        correctAnswer: "a",
      };

      for (let j = 1; j <= 4; j++) {
        const choice =
          lines[j]?.trim() || `${String.fromCharCode(96 + j)}) Option ${j}`;
        question.choices.push(choice);
      }

      const correctLine = lines.find((l) =>
        l.toLowerCase().includes("correct")
      );
      if (correctLine) {
        const match = correctLine.match(/[a-d]/i);
        if (match) {
          question.correctAnswer = match[0].toLowerCase();
        }
      }

      questions.push(question);
    }

    return questions;
  }

  getDefaultQuestions(theme) {
    return [
      {
        question: `Quelle est la principale caractéristique de ${theme} ?`,
        choices: [
          "a) Première caractéristique",
          "b) Deuxième caractéristique",
          "c) Troisième caractéristique",
          "d) Quatrième caractéristique",
        ],
        correctAnswer: "a",
      },
      {
        question: `Comment ${theme} est-il généralement utilisé ?`,
        choices: [
          "a) Première utilisation",
          "b) Deuxième utilisation",
          "c) Troisième utilisation",
          "d) Quatrième utilisation",
        ],
        correctAnswer: "b",
      },
      {
        question: `Quel est l'avantage principal de ${theme} ?`,
        choices: [
          "a) Premier avantage",
          "b) Deuxième avantage",
          "c) Troisième avantage",
          "d) Quatrième avantage",
        ],
        correctAnswer: "c",
      },
      {
        question: `Quelle est la meilleure pratique en ${theme} ?`,
        choices: [
          "a) Première pratique",
          "b) Deuxième pratique",
          "c) Troisième pratique",
          "d) Quatrième pratique",
        ],
        correctAnswer: "d",
      },
      {
        question: `Comment optimiser l'utilisation de ${theme} ?`,
        choices: [
          "a) Première optimisation",
          "b) Deuxième optimisation",
          "c) Troisième optimisation",
          "d) Quatrième optimisation",
        ],
        correctAnswer: "a",
      },
    ];
  }

  async evaluateAnswers(userId, theme, answers) {
    try {
      // Calcul du score (2 points par bonne réponse)
      const score = answers.reduce((acc, answer) => {
        return (
          acc +
          (answer.answer.toLowerCase() === answer.correctAnswer.toLowerCase()
            ? 2
            : 0)
        );
      }, 0);

      // Calcul des statistiques
      const correctAnswers = answers.filter(
        (a) => a.answer.toLowerCase() === a.correctAnswer.toLowerCase()
      ).length;

      const averageTime = Math.round(
        answers.reduce((acc, a) => acc + a.time, 0) / answers.length
      );

      // Génération du feedback détaillé
      const feedback = this.generateDetailedFeedback(
        answers,
        score,
        correctAnswers,
        averageTime,
        theme
      );

      // Sauvegarde de l'évaluation
      await Evaluation.create(userId, score, feedback);

      return {
        score,
        feedback,
        stats: {
          correctAnswers,
          totalQuestions: answers.length,
          averageTime,
          percentage: (score / 10) * 100,
        },
      };
    } catch (error) {
      console.error("Erreur évaluation réponses:", error);
      throw new Error("Erreur lors de l'évaluation des réponses");
    }
  }

  generateDetailedFeedback(answers, score, correctAnswers, averageTime, theme) {
    let feedback = `📊 Résultats de l'évaluation sur ${theme}\n`;
    feedback += `═══════════════════════════\n\n`;

    // Score global
    feedback += `📈 Score final: ${score}/10\n`;
    feedback += `✓ ${correctAnswers} réponses correctes sur ${answers.length}\n`;
    feedback += `⏱️ Temps moyen par question: ${averageTime}s\n\n`;

    // Niveau atteint
    feedback += `🎯 Niveau: ${this.getLevel(score)}\n`;
    feedback += `${this.getLevelComment(score)}\n\n`;

    // Détail par question
    feedback += `📝 Détail des réponses:\n`;
    answers.forEach((answer, index) => {
      const isCorrect =
        answer.answer.toLowerCase() === answer.correctAnswer.toLowerCase();
      feedback += `Q${index + 1}: ${isCorrect ? "✅" : "❌"} (${
        answer.time
      }s)\n`;
    });

    return feedback;
  }

  getLevel(score) {
    if (score >= 9) return "Expert 🏆";
    if (score >= 7) return "Avancé 🌟";
    if (score >= 5) return "Intermédiaire 📚";
    return "Débutant 🌱";
  }

  getLevelComment(score) {
    if (score >= 9) {
      return "🎉 Excellent ! Vous maîtrisez parfaitement le sujet.";
    }
    if (score >= 7) {
      return "👏 Très bien ! Vous avez une bonne compréhension du sujet.";
    }
    if (score >= 5) {
      return "👍 Pas mal ! Continuez à pratiquer pour progresser.";
    }
    return "💪 Continuez d'apprendre, la pratique fait la perfection !";
  }

  validateQuestions(questions) {
    return questions.every(
      (q) =>
        q.question &&
        Array.isArray(q.choices) &&
        q.choices.length === 4 &&
        q.correctAnswer &&
        ["a", "b", "c", "d"].includes(q.correctAnswer.toLowerCase())
    );
  }
}

module.exports = new EvaluationService();
