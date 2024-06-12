const express = require('express');
const router = express.Router();
const userController = require('../../controllers/users.controller');
const verifyUser = require('../../middleware/verifyUser');
const refreshToken = require('../../middleware/refreshToken');

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.get('/email/:email', userController.searchUserByEmail);
router.put('/:id', userController.updateUserById);
router.delete('/:id', userController.deleteUserById);

//refreshtoken
router.post('/refresh-token', refreshToken);
module.exports = router;
