const router = require('express').Router();

const {getAllGroups, getGroupById, getGroupsByCreatorId, createGroup} = require('../controllers/groups.controller');

router.get('/', getAllGroups);
router.get('/:id', getGroupById);

router.use('/creator_id/:creator_id', getGroupsByCreatorId);

router.post('/',createGroup);


module.exports = router;