const Membership = require('../models/memberships.model');
const Group = require('../models/groups.model');

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
        const [result] = await Membership.selectByGroupId(req.params.groups_id);
        res.json({
            success: true,
            message: 'Operation successful',
            data: result
        });
    } catch (err) {
        next(err);
    }
}

const addMemberToGroup = async (req, res, next) => {
    try {
        const {users_id, groups_id} = req.body;
        const [Member] = await Membership.selectMember(users_id, groups_id);
        if (Member[0]) {
            res.json({
                success: false,
                message: 'USEREXISTS',
                data: null
            });
        } else {
            const [result] = await Membership.insertMemberToGroup(req.body);
            res.json({
                success: true,
                message: 'Member added successfully',
                data: result
            });
        }
    } catch (err) {
        next(err);
    }
}

const updateMembership = async (req, res, next) => {
    try {
        const [result] = await Membership.updateMembershipStatus(req.params.users_id, req.params.groups_id);
        res.json({
            success: true,
            message: 'Membership status updated successfully',
            data: result
        });
    } catch (err) {
        next(err);
    }
}

const deleteMembership = async (req, res, next) => {
    try {
        const users_id = req.params.users_id;
        const groups_id = req.params.groups_id;

        const [result] = await Membership.deleteMember(users_id, groups_id);

        if (result.affectedRows === 0) {
            return res.json({
                success: false,
                message: 'Failed to delete member: Either the user is the creator or the balance is not zero',
                data: null
            });
        }

        res.json({
            success: true,
            message: 'Member deleted successfully',
            data: result
        });
    } catch (err) {
        res.json({
            success: false,
            message: 'Failed to delete member from group',
            data: null
        });
        next(err);
    }
}


// const deleteMembership = async (req, res, next) => {
//     try {
//         const userActive = '1';
//         const users_id = req.params.users_id;
//         const groups_id = req.params.groups_id;
//         const [member] = await Membership.selectMember(users_id, groups_id);
//         const [group] = await Group.selectById(groups_id);

//         if (group[0].creator_id != userActive) {
//             res.json({
//                 success: false,
//                 message: 'NOT CREATOR',
//                 data: null
//             });
//         } else if (member[0].balance === '0') {
//             const [result] = await Membership.deleteMember(users_id, groups_id);
//             res.json({
//                 success: true,
//                 message: 'Member deleted successfully',
//                 data: result
//             });
//         } else {
//             res.json({
//                 success: false,
//                 message: 'UNDELETED',
//                 data: null
//             });
//         }
//     } catch (err) {
//         next(err);
//     }
// }

module.exports = {
    getAllMembership,
    getAllMembershipByGroup,
    addMemberToGroup,
    updateMembership,
    deleteMembership
}
