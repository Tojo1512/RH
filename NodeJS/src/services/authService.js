const pool = require("../config/database");

class AuthService {
  static async verifierLoginMdp(login, mdp) {
    try {
      const query = {
        text: "SELECT * FROM Users WHERE login = $1 AND mdp = $2",
        values: [login, mdp],
      };

      const result = await pool.query(query);

      if (result.rows.length > 0) {
        const user = result.rows[0];
        return {
          success: true,
          user: {
            id: user.id_user,
            login: user.login,
            est_admin: user.est_admin,
          },
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
