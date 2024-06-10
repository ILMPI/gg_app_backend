const express = require('express');
const router = express.Router();
const { createGroup, getGroups, getGroupById, getGroupsByCreatorId, updateGroup, deleteGroup, getGroupStateByGroupId, activateGroup } = require('../../controllers/groups.controller');
const verifyToken = require('../../middleware/auth.middleware');

router.post('/', verifyToken, createGroup);
router.get('/', verifyToken, getGroups);
router.get('/:id', verifyToken, getGroupById);
router.get('/creator/:creator_id', verifyToken, getGroupsByCreatorId);
router.put('/:id', verifyToken, updateGroup);
router.delete('/:id', verifyToken, deleteGroup);
router.get('/:groupId/state', verifyToken, getGroupStateByGroupId);
router.post('/:id/activate', verifyToken, activateGroup);

module.exports = router;
