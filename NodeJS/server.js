require("dotenv").config();
const express = require("express");
const cors = require("cors");
const apiRoutes = require("./src/routes/api");
const authRoutes = require("./src/routes/authRoutes");
const evaluationRoutes = require("./src/routes/evaluationRoutes");
const jobRoutes = require("./src/routes/jobRoutes");
const app = express();

// Middleware CORS personnalisé
app.use((req, res, next) => {
  // Autoriser spécifiquement votre domaine frontend
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");

  // Autoriser les méthodes HTTP spécifiques
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );

  // Autoriser certains en-têtes
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );

  // Autoriser l'envoi de cookies
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Durée de mise en cache des résultats du preflight
  res.setHeader("Access-Control-Max-Age", "86400");

  // Gérer la requête OPTIONS
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  next();
});

// Middleware pour parser le JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", apiRoutes);
app.use("/api", authRoutes);
app.use("/api/evaluation", evaluationRoutes);
app.use("/api", jobRoutes);

// Ajoutez cette ligne pour déboguer les routes
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Middleware de gestion d'erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Une erreur est survenue",
    error: err.message,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
