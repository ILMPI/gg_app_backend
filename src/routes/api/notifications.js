const express = require('express');
const router = express.Router();
const notificationsController = require('../../controllers/notifications.controller');

router.get('/', notificationsController.getAllNotifications);
router.get('/:users_id', notificationsController.getNotificationsByUsersID);
router.get('/:users_id/:groups_id', notificationsController.getNotificationsByUserGroup);

router.put('/:id', notificationsController.updateNotification);
router.post('/', notificationsController.createNotification);
router.use('/changestatus/:users_id/:groups_id', notificationsController.setStatusReadNotificationsUserGroup);
// añadir ruta para metodo de cambiar estado a una notificacion en particualr, por su :id

// añadir ruta para metodo que devuelva true si todas las notificaciones de un usuario en un grupo son estatus 'Read', false si no se cumple
 

router.delete('/:id',notificationsController.deleteNotification);
router.delete('/usersgroups/:users_id/:groups_id', notificationsController.deleteNotificationsByUserGroup);

module.exports = router;