const AuthService = require("../services/authService");

class AuthController {
  static async login(req, res) {
    try {
      console.log("Corps de la requête reçue:", req.body);
      const { login, mdp } = req.body;

      // Vérification des données reçues
      if (!login || !mdp) {
        return res.status(400).json({
          message: "Login et mot de passe requis",
          received: { login, mdp },
        });
      }

      console.log("Données extraites:", { login, mdp });

      const resultat = await AuthService.verifierLoginMdp(login, mdp);

      if (resultat.success) {
        res.json({ message: "Connexion réussie", user: resultat.user });
      } else {
        res.status(401).json({ message: resultat.message });
      }
    } catch (error) {
      console.error("Erreur dans le contrôleur:", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  }
}

module.exports = AuthController;
