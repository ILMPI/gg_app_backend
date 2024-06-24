const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');

router.use('/auth', require('./api/auth')); //public route
router.use('/users', require('./api/users'));
router.use('/groups', require('./api/groups'));
router.use('/expenses', verifyToken, require('./api/expenses'));
router.use('/membership', require('./api/memberships'));
router.use('/notifications', verifyToken, require('./api/notifications'));
router.use('/invitations', require('./api/invitations'));


module.exports = router;
