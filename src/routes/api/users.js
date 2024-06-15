const express = require('express');
const router = express.Router();
const userController = require('../../controllers/users.controller');

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.get('/email/:email', userController.searchUserByEmail);
router.put('/:id', userController.updateUserById);
router.delete('/:id', userController.deleteUserById);

module.exports = router;
