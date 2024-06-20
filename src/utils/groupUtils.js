const Membership = require('../models/memberships.model');

const transformGroupData = async (group) => {
    const participants = await Membership.selectMembersDataByGroupId(group.id);
    return {
        id: group.id,
        name: group.title,
        description: group.description,
        createdBy: group.creator_id,
        image: group.image_url,
        createdOn: group.created_on,
        participants: participants[0].map(participant => ({
            id: participant.users_id,
            name: participant.name,  //name
            email: participant.email,  //email
            image: participant.image_url //image_url
        }))
    };
};


module.exports = {
    transformGroupData,

};
