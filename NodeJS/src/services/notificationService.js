const Notification = require('../models/notification');

class NotificationService {
  async getUserNotifications(userId) {
    return await Notification.findAllByUser(userId);
  }

  async markAsRead(notificationId) {
    return await Notification.markAsRead(notificationId);
  }

  async createNotification(userId, message, type = 'success') {
    return await Notification.create(userId, message, type);
  }
}

module.exports = new NotificationService(); 