const express = require('express');
const router = express.Router();

// Import your route files
const authRoutes = require('./auth.routes');
const userRoutes = require('./users.routes');
const groupRoutes = require('./groups.routes');

// Use your routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/groups', groupRoutes);

module.exports = router;
