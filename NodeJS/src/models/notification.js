const pool = require("../config/database");

class Notification {
  static async findAllByUser(userId) {
    try {
      if (isNaN(userId) || userId <= 0) {
        throw new Error("ID utilisateur invalide");
      }

      const query = {
        text: `
          SELECT * FROM Notifications 
          WHERE userId = $1 AND read = false 
          ORDER BY date DESC
        `,
        values: [userId],
      };

      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error("Erreur dans findAllByUser:", error);
      throw error;
    }
  }

  static async markAsRead(notificationId) {
    try {
      if (isNaN(notificationId) || notificationId <= 0) {
        throw new Error("ID notification invalide");
      }

      const query = {
        text: `
          UPDATE Notifications 
          SET read = true 
          WHERE id = $1
          RETURNING *
        `,
        values: [notificationId],
      };

      const result = await pool.query(query);
      return result.rows[0];
    } catch (error) {
      console.error("Erreur dans markAsRead:", error);
      throw error;
    }
  }

  static async create(userId, message, type = "success") {
    try {
      const query = {
        text: `
          INSERT INTO Notifications (userId, message, type, date, read)
          VALUES ($1, $2, $3, CURRENT_TIMESTAMP, false)
          RETURNING *
        `,
        values: [userId, message, type],
      };

      const result = await pool.query(query);
      return result.rows[0];
    } catch (error) {
      console.error("Erreur dans create:", error);
      throw error;
    }
  }
}

module.exports = Notification;
