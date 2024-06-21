const Group = require('../models/groups.model');

const checkAdmin = async (req, res, next) => {
    try {
        const userId = req.userId;
        const groupId = req.params.id || req.params.groups_id || req.body.groups_id;

        console.log('Checking admin status...');
        console.log('User ID:', userId);
        console.log('Group ID:', groupId);

        if (!groupId) {
            console.log('Group ID is required');
            return res.json({
                success: false,
                message: 'Group ID is required',
                data: null
            });
        }

        const [result] = await Group.selectCreatorByGroupId(groupId);

        if (result.length === 0) {
            console.log('Group not found');
            return res.json({
                success: false,
                message: 'Group not found',
                data: null
            });
        }

        const creatorId = result[0].creator_id;
        console.log('Creator ID:', creatorId);

        if (creatorId !== userId) {
            console.log('User is not the admin of this group');
            return res.json({
                success: false,
                message: 'You are not the admin of this group',
                data: null
            });
        }

        console.log('Admin check passed');
        next();
    } catch (err) {
        console.log('Failed to verify admin status', err);
        res.json({
            success: false,
            message: 'Failed to verify admin status',
            data: null
        });
        next(err);
    }
}

module.exports = checkAdmin;
