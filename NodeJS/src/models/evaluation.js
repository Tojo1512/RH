const db = require("../config/database");

class Evaluation {
  static async create(userId, note, commentaire) {
    try {
      const query = `
        INSERT INTO Evaluation (id_user, date_evaluation, note, commentaire)
        VALUES ($1, CURRENT_DATE, $2, $3)
        RETURNING *
      `;
      const values = [userId, note, commentaire];
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error("Erreur lors de la création de l'évaluation:", error);
      throw error;
    }
  }

  static async getByUserId(userId) {
    const query =
      "SELECT * FROM Evaluation WHERE id_user = $1 ORDER BY date_evaluation DESC";
    const result = await db.query(query, [userId]);
    return result.rows;
  }
}

module.exports = Evaluation;
