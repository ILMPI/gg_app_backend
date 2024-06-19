const User = require('../models/users.model');
const Membership = require('../models/memberships.model');
const Invitation = require('../models/invitations.model');

// Middleware to check if any user in the array is already a member
const checkIfAlreadyMember = async (req, res, next) => {
    const { participants, users } = req.body;
    const invitees = participants || users;
    let errors = [];
    for (let user of invitees) {
        const { email } = user;
        const groupId = req.params.id;
        const [existingUsers] = await User.selectByEmail(email);
        if (existingUsers.length > 0) {
            const userId = existingUsers[0].id;
            const [existingMembership] = await Membership.selectMember(userId, groupId);
            if (existingMembership.length > 0) {
                errors.push({
                    email,
                    message: `The user with email ${email} is already a member of the group`
                });
            }
        }
    }
    req.membershipErrors = errors;
    next();
};

// Middleware to check if any user in the array was recently invited
const checkIfRecentlyInvited = async (req, res, next) => {
    const { participants, users } = req.body;
    const invitees = participants || users;
    const groupId = req.params.id;
    const inviterId = req.userId;
    let errors = [];
    for (let user of invitees) {
        const { email } = user;
        const [recentInvitations] = await Invitation.selectRecentInvitation(inviterId, groupId, email);
        if (recentInvitations.length > 0) {
            errors.push({
                email,
                message: `An invitation has already been sent to ${email} for this group in the last 24 hours`
            });
        }
    }
    req.invitationErrors = errors;
    next();
};

module.exports = {
    checkIfAlreadyMember,
    checkIfRecentlyInvited,
};
