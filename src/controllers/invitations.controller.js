const Invitation = require('../models/invitations.model');
const Nodemailer = require('nodemailer');
const { selectById } = require('../models/users.model');
const Group = require('../models/groups.model');


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
        const groupName = group[0].title;
        const [author] = await selectById(users_id);
        const authorName = author[0].name;
        
        var message = {
            from: 'edllaor77@gmail.com',
            to: `${email}`,
            subject: `Invitacion a la gg_app de ${authorName}`,
            text: `Se te quiere añadir al grupo ${groupName}. Registrate en GG-APP y en cuanto lo hagas, se te añadira al grupo automaticamente`
        };

        var transporter = Nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD,
                clientId: process.env.OAUTH_CLIENTID,
                clientSecret: process.env.OAUTH_CLIENT_SECRET,
                refreshToken: process.env.OAUTH_REFRESH_TOKEN
            }
        });

        transporter.sendMail(message, (error, info) => {
            if (error) {
                console.log("Error enviando email")
                console.log(error.message)
            } else {
                console.log("Email enviado")
            }
        })
        
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