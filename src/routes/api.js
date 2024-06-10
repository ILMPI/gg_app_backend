const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth.middleware');

// Use your routes
router.use('/users', require('./api/users'));
router.use('/groups', verifyToken, require('./api/groups'));
router.use('/expenses', verifyToken, require('./api/expenses'));

module.exports = router;
