const Invitation = require('../models/invitations.model');
const Notification = require('../models/notifications.model')

const isRecentlyInvited = async (inviterId, groupId, email) => {
    const [recentInvitations] = await Invitation.selectRecentInvitation(inviterId, groupId, email);
    
    if (recentInvitations.length > 0) {
        return {
            success: false,
            message: 'An invitation has already been sent to this email for this group in the last 24 hours',
            data: null
        };
    }
    return null;
};

module.exports = {
    isRecentlyInvited,
};
