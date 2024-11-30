const UserModel = require("../models/userModel");

class AuthService {
  static async verifierLoginMdp(login, mdp) {
    try {
      const user = await UserModel.findByCredentials(login, mdp);

      if (user) {
        return {
          success: true,
          user: user,
        };
      }

      return {
        success: false,
        message: "Login ou mot de passe incorrect",
      };
    } catch (error) {
      console.error("Erreur lors de la vérification:", error);
      throw error;
    }
  }
}

module.exports = AuthService;
