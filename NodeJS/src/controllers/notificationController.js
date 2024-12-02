const NotificationService = require("../services/notificationService");

class NotificationController {
  async getUserNotifications(req, res) {
    try {
      const userId = parseInt(req.params.userId);

      // Vérification que userId est un nombre valide
      if (isNaN(userId) || userId <= 0) {
        return res.status(400).json({
          success: false,
          error: "ID utilisateur invalide",
        });
      }

      const notifications = await NotificationService.getUserNotifications(
        userId
      );
      res.json({
        success: true,
        notifications,
      });
    } catch (error) {
      console.error("Erreur récupération notifications:", error);
      res.status(500).json({
        success: false,
        error: "Erreur lors de la récupération des notifications",
      });
    }
  }

  async markAsRead(req, res) {
    try {
      const notificationId = parseInt(req.params.notificationId);

      // Vérification que notificationId est un nombre valide
      if (isNaN(notificationId) || notificationId <= 0) {
        return res.status(400).json({
          success: false,
          error: "ID de notification invalide",
        });
      }

      const notification = await NotificationService.markAsRead(notificationId);
      if (!notification) {
        return res.status(404).json({
          success: false,
          error: "Notification non trouvée",
        });
      }
      res.json({
        success: true,
        message: "Notification marquée comme lue",
      });
    } catch (error) {
      console.error("Erreur marquage notification:", error);
      res.status(500).json({
        success: false,
        error: "Erreur lors du marquage de la notification",
      });
    }
  }
}

module.exports = new NotificationController();
