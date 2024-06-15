const express = require('express');
const router = express.Router();
const authController = require('../../controllers/auth.controller');
const refreshToken = require('../../middleware/refreshToken');

router.post('/login', authController.login);
router.post('/register', authController.register);

//refreshtoken
router.post('/refresh-token', refreshToken);
module.exports = router;