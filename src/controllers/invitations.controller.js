const Invitation = require('../models/invitations.model');

const getInvitationsByUsers = async (req, res, next) => {
    try{
        const [result] = await Invitation.selectByUsers(req.params.users_id);
        res.json({
            success: true,
            message: 'Invitations retrieved successfully',
            data: result
        });
    }catch(err){
        next(err)
    }
}

const getInvitationsByMail = async (req, res, next) => {
    try{
        const [result] = await Invitation.selectByEmail(req.params.email);
        
        res.json({
            success: true,
            message: 'Invitations retrieved successfully',
            data: result
        });
    }catch(err){
        next(err)
    }
}

const createInvitation = async (req, res, next) => {
    try {
        const {users_id, groups_id, sent_on, responded_on, email} = req.body;
        await Invitation.insertInvitation(users_id, groups_id, sent_on, responded_on, email);
        res.status(201).json({
            success: true,
            message: 'Invitation created successfully',
            data: null
        });
    } catch (err) {
        next(err);
    }
}


module.exports = {
    getInvitationsByUsers,
    getInvitationsByMail,
    createInvitation
}