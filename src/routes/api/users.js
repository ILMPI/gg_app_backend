const router = require('express').Router();

const {getAllUsers, getUserById, register, login} = require('../../controllers/users.controller');

router.get('/', getAllUsers);
router.get('/:id', getUserById);

router.post('/register', register);
router.use('/login', login);

module.exports = router;