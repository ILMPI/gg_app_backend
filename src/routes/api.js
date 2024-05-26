const router = require('express').Router();

router.use('/users', require('./api/users'));

router.use('/groups', require('./api/groups'));

module.exports = router;
