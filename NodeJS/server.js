require("dotenv").config();
const express = require("express");
const cors = require("cors");
const apiRoutes = require("./src/routes/api");
const authRoutes = require("./src/routes/authRoutes");
const evaluationRoutes = require("./src/routes/evaluationRoutes");
const jobRoutes = require("./src/routes/jobRoutes");
const app = express();

app.use(express.json());
// Configuration CORS
app.use(
  cors({
    origin: "http://localhost:5173", // Remplacez par l'URL de votre frontend Vue.js
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

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

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Une erreur est survenue sur le serveur" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
