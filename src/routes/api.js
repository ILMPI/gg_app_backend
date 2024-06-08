const express = require('express');
const router = express.Router();

// Import your route files
const authRoutes = require('./api/auth');
const userRoutes = require('./api/users');
const groupRoutes = require('./api/groups');
const expenseRoutes = require('./api/expenses');

// Use your routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/groups', groupRoutes);
router.use('/expenses', expenseRoutes);

module.exports = router;
