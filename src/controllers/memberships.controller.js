const Membership = require('../models/memberships.model');
const User = require('../models/users.model');
const Group = require('../models/groups.model');
const Notification = require('../models/notifications.model');
const { sendUserJoinedNotification, sendRefusalNotification } = require('../controllers/notifications.controller');



const getAllMembership = async (req, res, next) => {
    try {
        const [result] = await Membership.selectAll();
        res.json({
            success: true,
            message: 'Operation successful',
            data: result
        });
    } catch (err) {
        next(err);
    }
}

const getAllMembershipByGroup = async (req, res, next) => {
    try {
        const groupId = req.params.groups_id;
        const group = await Group.selectById(groupId);

        if (group[0].length !== 0) {
            const [result] = await Membership.selectMembersDataByGroupId(groupId);

            // Transform result to replace image_url with image
            const transformedResult = result.map(member => {
                return {
                    ...member,
                    image: member.image_url,
                    image_url: undefined  // Optionally, you can delete this property if you don't want to send it at all
                };
            });

            res.json({
                success: true,
                message: 'Operation successful',
                data: transformedResult
            });
        } else {
            res.json({
                success: false,
                message: 'This group does not exist!',
                data: null
            });
        }
    } catch (err) {
        next(err);
    }
};


// const addMemberToGroup = async (req, res, next) => {
//     try {
//         const {users_id, groups_id} = req.body;

//         const [Member] = await Membership.selectMember(users_id, groups_id);
//         const [GroupAdded] = await Group.selectById(groups_id);
        
//         console.log(Member[0]);

//         console.log('antes de logica');
        
//         if (!Member[0]) {
            
//             const [result] = await Membership.insertMemberToGroup(req.body);
//             const nameGroup = GroupAdded[0].title;
//             const notifTitle = `Añadido al grupo ${nameGroup}`;
//             const notifDescription = 'Ahora debes confirmar que aceptas estar en el grupo';
//             const currentDate = Dayjs().format('YYYY-MM-DD HH:mm');
//             const [result2] = await Notification.insertNotification(users_id, 'Unread', currentDate, notifTitle, notifDescription);
            
//             res.json({
//                 success: true,
//                 message: 'Member added successfully',
//                 data: result
//             }) 
//         }else{ 
//             res.json({
//                 success: false,
//                 message: 'USER EXISTS',
//                 data: null
//             });

//         }
//     } catch (err) {
//         next(err);
//     }
// }



const updateMembership = async (req, res, next) => {
    try {
        const users_id = req.params.users_id;
        const groups_id = req.params.groups_id;
        const currentUserId = req.userId;

        // Ensure that the user performing the update is the same as the user being updated
        if (users_id != currentUserId) {
            return res.json({
                success: false,
                message: 'You can only update your own membership status',
                data: null
            });
        }

        // Check if the user is invited to the group
        const [membershipCheck] = await Membership.selectMember(users_id, groups_id);

        if (membershipCheck.length === 0) {
            return res.json({
                success: false,
                message: 'You are not a member of this group',
                data: null
            });
        }

        const membershipStatus = membershipCheck[0].status;

        // If user already joined
        if (membershipStatus === 'Joined') {
            return res.json({
                success: false,
                message: 'You already joined this group',
                data: null
            });
        }

        if (membershipStatus !== 'Invited') {
            return res.json({
                success: false,
                message: 'You are not invited to this group',
                data: null
            });
        }

        // Update the membership status
        const [result] = await Membership.updateMembershipStatus(users_id, groups_id);
        
        // Send notifications
        await sendUserJoinedNotification(users_id, groups_id);

        res.json({
            success: true,
            message: 'Membership status updated successfully',
            data: null
        });
    } catch (err) {
        next(err);
    }
};

const deleteMembership = async (req, res, next) => {
    try {
        const users_id = req.params.users_id;
        const groups_id = req.params.groups_id;

        //if the user exists
        const [userCheck] = await User.selectById(users_id);

        if (userCheck.length === 0) {
            return res.json({
                success: false,
                message: 'User does not exist',
                data: null
            });
        }

        //is this user member of the group
        const [membershipCheck] = await Membership.selectMember(users_id, groups_id);

        if (membershipCheck.length === 0) {
            return res.json({
                success: false,
                message: 'User is not a member of the group',
                data: null
            });
        }

        const [result] = await Membership.deleteMember(users_id, groups_id);

        if (result.affectedRows === 0) {
            return res.status(400).json({
                success: false,
                message: 'Si balance no cero o user creator',
                data: null
            });
        }

        res.json({
            success: true,
            message: 'Member deleted successfully',
            data: null
        });
    } catch (err) {
        next(err);
    }
}

const refuseInvitation = async (req, res, next) => {
    try {
        const users_id = req.params.users_id;
        const groups_id = req.params.groups_id;
        const currentUserId = req.userId;

        // Ensure that the user performing the update is the same as the user being updated
        if (users_id != currentUserId) {
            return res.json({
                success: false,
                message: 'You can only refuse your own membership status',
                data: null
            });
        }


        const [membership] = await Membership.selectMember(users_id, groups_id);
        if (!membership.length || membership[0].status !== 'Invited') {
            return res.status(404).json({
                success: false,
                message: 'No invitation found for this user in this group',
                data: null
            });
        }

        //delete the membership
        await Membership.deleteMember(users_id, groups_id);

        // Send refusal notification
        await sendRefusalNotification(users_id, groups_id);

        res.json({
            success: true,
            message: 'The group refused successfully',
            data: null
        });

    } catch (error) {
        console.error(error);
        next(error);
    }
};

    

//get balance from membership by userId from all groups
const getBalance = async (req, res, next) => {
    try {
        const userId = req.userId;
        const [result] = await Membership.getTotalBalanceByUserId(userId);

        if (!result.length) {
            return res.status(404).json({
                success: false,
                message: 'No balance found for this user',
                data: null
            });
        }

        res.json({
            success: true,
            message: 'User balance retrieved successfully',
            data: result[0]
        });

    } catch (error) {
        console.error('Error retrieving user balance:', error);
        next(error);
    }
};




module.exports = {
    getAllMembership,
    getAllMembershipByGroup,
   // addMemberToGroup,
    updateMembership,
    deleteMembership,
    refuseInvitation,
    getBalance
}
