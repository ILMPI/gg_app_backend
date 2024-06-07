const express = require('express');
const router = express.Router();
const authController = require('../../controllers/users.controller');
const verifyToken = require('../../middleware/auth.middleware');

//Public routes
router.post('/login', authController.login);
router.post('/register', authController.register);

//Protected routes
router.get('/', verifyToken, authController.getAllUsers);
router.get('/:id', verifyToken, authController.getUserById);
router.get('/email/:email', verifyToken, authController.searchUserByEmail);
router.put('/:id', verifyToken, authController.updateUserById);
router.delete('/:id', verifyToken, authController.deleteUserById);

module.exports = router;
