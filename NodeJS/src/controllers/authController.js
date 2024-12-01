const AuthService = require("../services/authService");

class AuthController {
  static async login(req, res) {
    try {
      const { login, mdp } = req.body;
      const resultat = await AuthService.verifierLoginMdp(login, mdp);

      if (resultat.success) {
        res.json(resultat);
      } else {
        res.status(401).json(resultat);
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Erreur serveur",
      });
    }
  }
}

module.exports = AuthController;
