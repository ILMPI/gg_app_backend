const User = require('../models/users.model');
const Group = require('../models/groups.model');
const Membership = require('../models/memberships.model');
const Notification = require('../models/notifications.model');
const {
    sendInviteUserToGroupNotification,
    sendGroupCreationNotification
} = require('../controllers/notifications.controller')
const Invitation = require('../models/invitations.model');
const Dayjs = require('dayjs');
const { transformGroupData } = require('../utils/groupUtils');




const createGroup = async (req, res, next) => {
    try {
        const { title, name, description, image, image_url } = req.body;
        const groupName = title || name;
        const imageUrl = image || image_url;
        const creator_id = req.userId;// id from TOKEN

        if (!groupName  || !description) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required: title, description'
            });
        }

        // if user created such group before
        const existingGroups = await Group.selectByCreatorId(creator_id);
        const duplicateGroup = existingGroups[0].find(group => group.title === groupName);

        if (duplicateGroup) {
            return res.status(400).json({
                success: false,
                message: 'A group with this name already exists for this user',
                data: null
            });
        }

        //add group
        const result = await Group.insertGroup({ creator_id, title: groupName, description, imageUrl });
        const groupId = result[0].insertId;

        //add creator to grrup
        const status = 'Joined';
        const balance = 0;
        await Membership.insertMemberToGroup({ users_id: creator_id, groups_id: groupId, status, balance });

        //state = 'Active'
        await Group.activateGroup(groupId);

        //notification to the creator of the group
        await sendGroupCreationNotification(creator_id, groupName, groupId);


        res.status(201).json({
            success: true,
            message: 'Group created successfully',
            data: { id: groupId }
        });

    } catch (error) {
        next(error);
    }
};
const getGroups = async (req, res, next) => {
    try {
        const groups = await Group.selectAll();
        const transformedGroups = await Promise.all(groups[0].map(transformGroupData));
        res.status(200).json({
            success: true,
            message: 'Groups retrieved successfully',
            //data: groups[0]
            data: transformedGroups
        });
    } catch (error) {
        next(error);
    }
};

const getGroupById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const group = await Group.selectById(id);
        if (group[0].length !== 0) {
            const transformedGroup = await transformGroupData(group[0][0]);
            res.status(200).json({
                success: true,
                message: 'Group retrieved successfully',
                //data: group[0]
                data: transformedGroup
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Group not found',
                data: null
            });
        }
    } catch (error) {
        next(error);
    }
};


const getGroupsByCreatorId = async (req, res, next) => {
    try {
        const { creator_id } = req.params;

        //creator exists ???
        const [user] = await User.selectById(creator_id);
        if (!user.length) {
            return res.status(404).json({
                success: false,
                message: 'Creator not found',
                data: null
            });
        }
        //grups by creator
        const groups = await Group.selectByCreatorId(creator_id);
        if (groups[0].length !== 0) {
            const transformedGroups = await Promise.all(groups[0].map(transformGroupData));
            res.status(200).json({
                success: true,
                message: 'Groups retrieved successfully',
                data: transformedGroups
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'No groups found for this creator',
                data: null
            });
        }
    } catch (error) {
        next(error);
    }
};
//shows all groups where this user is a member/including where he is creator
const getAllGroupsByUserId = async (req, res, next) => {
    try {
        const userId = req.params.userId;

        // Check if the user exists
        const [user] = await User.selectById(userId);
        if (!user.length) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
                data: null
            });
        }

        const groups = await Group.selectAllGroupsByUserId(userId);
        const transformedGroups = await Promise.all(groups[0].map(transformGroupData));
        res.status(200).json({
            success: true,
            message: 'Groups retrieved successfully',
            data: transformedGroups
        });
    } catch (error) {
        next(error);
    }
}
const updateGroup = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, description, image} = req.body;
        //const groupName = title || name;
        //const imageUrl = image || image_url;

        await Group.updateGroup(id, {title: name, description, image_url: image});
        res.status(200).json({
            success: true,
            message: 'Group updated successfully',
            data: null
        });
    } catch (error) {
        next(error);
    }
};
const deleteGroup = async (req, res, next) => {
    try {
        const { id } = req.params;
        await Group.deleteGroup(id);
        res.status(200).json({
            success: true,
            message: 'Group archived successfully',
            data: null
        });
    } catch (error) {
        next(error);
    }
};
const getGroupStateByGroupId = async (req, res, next) => {
    try {
        const { groupId } = req.params;

        //group exists ??
        const groupExists = await Group.selectById(groupId);
        if (groupExists[0].length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Group not found',
                data: null
            });
        }
        //group state
        const state = await Group.selectGroupStateByGroupId(groupId);
        if (state.length) {
            res.status(200).json({
                success: true,
                message: 'Group state retrieved successfully',
                data: state[0] //specify what to give back exactly, to not send all data
            });
        }
    } catch (error) {
        next(error);
    }
};

//make check if group is already Active 
//add a message that Group is activated 
//already and add a date when it was activated.

const activateGroup = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Check the current state of the group
        const currentState = await Group.selectGroupStateByGroupId(id);
        if (currentState[0][0].status === 'Active') {
            return res.status(400).json({
                success: false,
                message: 'Group is already active',
                data: {
                    activated_on: currentState[0][0].changed_on
                }
            });
        }

        // Activate the group
        await Group.activateGroup(id);
        res.status(200).json({
            success: true,
            message: 'Group activated successfully',
            data: null
        });
    } catch (error) {
        next(error);
    }
};

const inviteUserToGroup = async (req, res, next) => {
    try {
        const { participants, users } = req.body;
        const invitees = participants || users;
        const groupId = req.params.id;
        const inviterId = req.userId;
        const sentOn = Dayjs().format('YYYY-MM-DD HH:mm:ss');

        let results = [];

        for (let user of invitees) {
            const { email, name } = user;
            let success = true;
            let message = '';

            try {
                const [existingUsers] = await User.selectByEmail(email);
                const userId = existingUsers.length > 0 ? existingUsers[0].id : null;

                if (userId) {
                    const [existingMembership] = await Membership.selectMember(userId, groupId);
                    if (existingMembership.length > 0) {
                        message = 'The user is already a member of the group';
                        success = false;
                    }
                }

                const [recentInvitations] = await Invitation.selectRecentInvitation(inviterId, groupId, email);
                if (recentInvitations.length > 0) {
                    message = 'An invitation has already been sent to this email for this group in the last 24 hours';
                    success = false;
                }

                if (success) {
                    if (userId) {
                        await Membership.insertMemberToGroup({ users_id: userId, groups_id: groupId, status: 'Invited', balance: 0 });
                        await sendInviteUserToGroupNotification(userId, inviterId, groupId);
                        await Invitation.insertInvitation(inviterId, groupId, sentOn, null, email);
                        message = 'User added to the group';
                    } else {
                        await Invitation.insertInvitation(inviterId, groupId, sentOn, null, email);
                        message = 'Invitation sent to the email';
                    }
                }
            } catch (error) {
                success = false;
                message = error.message;
            }

            results.push({
                email,
                success,
                message
            });
        }

        const allFailures = results.every(result => !result.success);

        return res.status(200).json({
            success: !allFailures,
            message: allFailures ? 'All invitations failed' : 'Batch invitation process completed',
            data: results
        });
    } catch (error) {
        next(error);
    }
};

const getGroupImage = async (req, res, next) => {
    try {
        const groupId = req.params.groupId;
        const [result] = await Group.getImageByGroupId(groupId);

        if (!result.length) {
            return res.status(404).json({
                success: false,
                message: 'Group image not found',
                data: null
            });
        }

        res.json({
            success: true,
            message: 'Group image retrieved successfully',
            data: result[0]
        });

    } catch (error) {
        console.error('Error retrieving group image:', error);
        next(error);
    }
};



//previous version
// const inviteUserToGroup = async (req, res, next) => {
//     try {
//         const { users } = req.body; //array of users
//         const groupId = req.params.id;
//         const inviterId = req.userId;
//         const sentOn = Dayjs().format('YYYY-MM-DD HH:mm:ss');

//         let results = [];
//         let membershipErrors = req.membershipErrors || [];
//         let invitationErrors = req.invitationErrors || [];

//         for (let user of users) {
//             const { email, name } = user;

//             if (membershipErrors.some(err => err.email === email) || invitationErrors.some(err => err.email === email)) {
//                 results.push({
//                     email,
//                     success: false,
//                     message: membershipErrors.find(err => err.email === email)?.message || invitationErrors.find(err => err.email === email)?.message
//                 });
//                 continue;
//             }

//             const [existingUsers] = await User.selectByEmail(email);

//             if (existingUsers.length > 0) {
//                 const userId = existingUsers[0].id;
//                 await Membership.insertMemberToGroup({ users_id: userId, groups_id: groupId, status: 'Invited', balance: 0 });
//                 await sendInviteUserToGroupNotification(userId, inviterId, groupId);
//                 await Invitation.insertInvitation(inviterId, groupId, sentOn, null, email);
//                 results.push({
//                     email,
//                     success: true,
//                     message: 'User added to the group'
//                 });
//             } else {
//                 await Invitation.insertInvitation(inviterId, groupId, sentOn, null, email);
//                 results.push({
//                     email,
//                     success: true,
//                     message: 'Invitation sent to the email'
//                 });
//             }
//         }

//         return res.status(200).json({
//             success: true,
//             message: 'Batch invitation process completed',
//             data: results
//         });
//     } catch (error) {
//         next(error);
//     }
// };


// for one by one user
// const inviteUserToGroup = async (req, res, next) => {
//     try {
//         const { email } = req.body;
//         const groupId = req.params.id; // :id from route
//         const inviterId = req.userId; //the current user, who is inviting
//         const sentOn = Dayjs().format('YYYY-MM-DD HH:mm:ss');

//         // Check if the user is already registered
//         const [existingUsers] = await User.selectByEmail(email);

//         if (existingUsers.length > 0) {
//             const userId = existingUsers[0].id;

//             // User is registered and not a member -> add to the group
//             await Membership.insertMemberToGroup({ users_id: userId, groups_id: groupId, status: 'Invited', balance: 0 });
//             await sendInviteUserToGroupNotification(userId,inviterId, groupId);
//             //send invitation to registered user
//             await Invitation.insertInvitation(inviterId, groupId, sentOn, null, email);
//             return res.status(200).json({
//                 success: true,
//                 message: 'User added to the group',
//                 data: null
//             });
//         } else {
//             // User doesn't exist, send an invitation
//             await Invitation.insertInvitation(inviterId, groupId, sentOn, null, email);

//             return res.status(200).json({
//                 success: true,
//                 message: 'Invitation sent to the email',
//                 data: null
//             });
//         }
//     } catch (error) {
//         next(error);
//     }
// };

module.exports = {
    createGroup,
    getGroups,
    getGroupById,
    getGroupsByCreatorId,
    updateGroup,
    deleteGroup,
    getGroupStateByGroupId,
    activateGroup,
    getAllGroupsByUserId,
    inviteUserToGroup,
    getGroupImage
};
