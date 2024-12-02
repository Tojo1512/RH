const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/notificationController');

// Route pour récupérer les notifications d'un utilisateur
router.get('/:userId', NotificationController.getUserNotifications);

// Route pour marquer une notification comme lue
router.put('/:notificationId/read', NotificationController.markAsRead);

// Middleware de gestion d'erreurs spécifique aux notifications
router.use((err, req, res, next) => {
  console.error('Erreur dans les routes de notification:', err);
  res.status(500).json({
    success: false,
    error: 'Erreur lors du traitement de la notification'
  });
});

module.exports = router;