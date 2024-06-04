const express = require('express');
const router = express.Router();
const authController = require('../controllers/users.controller');
const verifyToken = require('../middleware/auth.middleware');

//Public
router.post('/login', authController.login);
router.post('/register', authController.register);

//protected routes
router.get('/users', verifyToken, authController.getAllUsers);
router.get('/users/:id', verifyToken, authController.getUserById);
router.delete('/users/:id', verifyToken, authController.deleteUserById);

module.exports = router;
