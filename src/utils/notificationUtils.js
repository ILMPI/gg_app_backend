const User = require('../models/users.model');
const Group = require('../models/groups.model');

const transformNotificationDescription = async (description, inviterId, groupId) => {
    let transformedDescription = description;

    // console.log('Initial Description:', description);
    // console.log('User ID:', userId);
    // console.log('Group ID:', groupId);

    const [userResult] = await User.selectUserNameById(inviterId);
    if (userResult.length > 0) {
        const userName = userResult[0].name;
        console.log('User Name:', userName);
        transformedDescription = transformedDescription.replace(`${inviterId}`, userName);

    }
    const [groupResult] = await Group.selectGroupTitleById(groupId);
    if (groupResult.length > 0) {
        const groupTitle = groupResult[0].title;
        console.log('Group Title:', groupTitle);
        transformedDescription = transformedDescription.replace(`${groupId}`, groupTitle);
        }

    console.log('Transformed Description:', transformedDescription);
    return transformedDescription;
};

module.exports = {
    transformNotificationDescription,
};
