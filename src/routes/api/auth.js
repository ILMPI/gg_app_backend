const express = require('express');
const router = express.Router();
const authController = require('../../controllers/users.controller');
const verifyToken = require('../../middleware/auth.middleware');

// Public routes
router.post('/login', authController.login);
router.post('/register', authController.register);

// Protected routes
router.get('/users', verifyToken, authController.getAllUsers);
router.get('/users/:id', verifyToken, authController.getUserById);
router.get('/users/email/:email', verifyToken, authController.searchUserByEmail);
router.put('/users/:id', verifyToken, authController.updateUserById);
router.delete('/users/:id', verifyToken, authController.deleteUserById);

module.exports = router;
