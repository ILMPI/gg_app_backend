const express = require('express');
const router = express.Router();
const invitationsController = require('../../controllers/invitations.controller');

router.get('/:users_id', invitationsController.getInvitationsByUsers);
router.get('/email/:email', invitationsController.getInvitationsByMail);

router.post('/', invitationsController.createInvitation);




module.exports = router;