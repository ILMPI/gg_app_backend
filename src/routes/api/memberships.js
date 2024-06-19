const express = require('express');
const router = express.Router();
const membershipsController = require('../../controllers/memberships.controller');
const checkAdmin = require('../../middleware/checkAdmin');

router.get('/', membershipsController.getAllMembership);
router.get('/group/:groups_id', membershipsController.getAllMembershipByGroup);
//router.post('/', membershipsController.addMemberToGroup);
router.put('/:users_id/:groups_id', membershipsController.updateMembership);
router.delete('/:users_id/:groups_id', checkAdmin, membershipsController.deleteMembership);

module.exports = router;
