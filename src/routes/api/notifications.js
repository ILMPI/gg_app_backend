const express = require('express');
const router = express.Router();
const notificationsController = require('../../controllers/notifications.controller');

router.get('/', notificationsController.getAllNotifications);
router.get('/:users_id', notificationsController.getNotificationsByUsersID);

router.put('/:id', notificationsController.updateNotification);
router.post('/', notificationsController.createNotification);
router.delete('/:id',notificationsController.deleteNotification);

module.exports = router;