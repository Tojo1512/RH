const pool = require("../config/database");

class UserModel {
  static async findByCredentials(login, mdp) {
    try {
      // Notre requête principale
      const query = {
        text: "SELECT * FROM Users WHERE login = $1",
        values: [login],
      };
      const result = await pool.query(query);

      if (result.rows[0]) {
        console.log(
          "Utilisateur trouvé avec le mot de passe:",
          result.rows[0].login
        );
        if (result.rows[0].mdp === mdp) {
          return result.rows[0];
        }
      }
      return null;
    } catch (error) {
      console.error("Erreur dans findByCredentials:", error);
      throw error;
    }
  }
}

module.exports = UserModel;
