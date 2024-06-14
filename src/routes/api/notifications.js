const express = require('express');
const router = express.Router();
const notificationsController = require('../../controllers/notifications.controller');

router.get('/', notificationsController.getAllNotifications);

router.post('/', notificationsController.createNotification);

module.exports = router;