const express = require("express");
const cors = require("cors");
const apiRoutes = require("./src/routes/api");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api", apiRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
