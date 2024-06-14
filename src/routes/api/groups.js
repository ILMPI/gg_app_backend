const express = require('express');
const router = express.Router();
const { createGroup, getGroups, getGroupById, getGroupsByCreatorId, updateGroup, deleteGroup, getGroupStateByGroupId, activateGroup } = require('../../controllers/groups.controller');
const checkAdmin = require('../../middleware/checkAdmin');

router.post('/',createGroup);
router.get('/',getGroups);
router.get('/:id',getGroupById);
router.get('/creator/:creator_id',getGroupsByCreatorId);
router.put('/:id',checkAdmin, updateGroup);
router.delete('/:id',checkAdmin, deleteGroup);
router.get('/:groupId/state',getGroupStateByGroupId);
router.post('/:id/activate',checkAdmin, activateGroup);

module.exports = router;
