const express = require('express');
const router = express.Router();
const notificationsController = require('../../controllers/notifications.controller');

router.get('/', notificationsController.getAllNotifications);
router.get('/:users_id', notificationsController.getNotificationsByUsersID);
router.get('/:users_id/:groups_id', notificationsController.getNotificationsByUserGroup);

router.put('/:id', notificationsController.updateNotification);
router.post('/', notificationsController.createNotification);
router.use('/changestatus/:users_id/:groups_id', notificationsController.setStatusReadNotificationsUserGroup);
router.use('/changestatus/:id', notificationsController.setStatusReadNotificationId);

router.delete('/:id',notificationsController.deleteNotification);
router.delete('/usersgroups/:users_id/:groups_id', notificationsController.deleteNotificationsByUserGroup);

module.exports = router;