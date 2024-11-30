const express = require("express");
const cors = require("cors");
const apiRoutes = require("./src/routes/api");

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

app.use("/api", apiRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
