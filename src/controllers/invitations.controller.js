const Invitation = require('../models/invitations.model');
const { selectById } = require('../models/users.model');
const Group = require('../models/groups.model');
const emailUtil = require('../utils/emailUtils');

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
        const [group] = await Group.selectById(groups_id);
        const textMail = `Se te quiere añadir al grupo ${group[0].title}. Registrate en GG-APP y en cuanto lo hagas, se te añadira al grupo automaticamente`;
        const [author] = await selectById(users_id);
        const textSubject = `Invitacion a la gg_app de ${author[0].name}`
        await emailUtil.sendEmail(email, textSubject, textMail);

        
    } catch (err) {
        next(err);
    }
}


module.exports = {
    getInvitationsByUsers,
    getInvitationsByMail,
    createInvitation,
}