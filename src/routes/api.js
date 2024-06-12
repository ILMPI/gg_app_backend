const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');

// Use your routes
router.use('/auth', require('./api/auth')); //public route
router.use('/users', verifyToken, require('./api/users'));
router.use('/groups', verifyToken, require('./api/groups'));
router.use('/expenses', verifyToken, require('./api/expenses'));

module.exports = router;
