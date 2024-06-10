const express = require('express');
const router = express.Router();
const { createGroup, getGroups, getGroupById, getGroupsByCreatorId, updateGroup, deleteGroup, getGroupStateByGroupId, activateGroup } = require('../../controllers/groups.controller');

router.post('/',createGroup);
router.get('/',getGroups);
router.get('/:id',getGroupById);
router.get('/creator/:creator_id',getGroupsByCreatorId);
router.put('/:id',updateGroup);
router.delete('/:id',deleteGroup);
router.get('/:groupId/state',getGroupStateByGroupId);
router.post('/:id/activate',activateGroup);

module.exports = router;
