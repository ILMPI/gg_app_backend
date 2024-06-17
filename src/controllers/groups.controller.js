const User = require('../models/users.model');
const Group = require('../models/groups.model');
const Membership = require('../models/memberships.model');
const Notification = require('../models/notifications.model');

const Dayjs = require('dayjs'); 

const createGroup = async (req, res, next) => {
    try {
        const { title, description, image_url } = req.body;
        const creator_id = req.userId;// id from TOKEN

        if (!title || !description) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required: title, description'
            });
        }

        // if user created such group before
        const existingGroups = await Group.selectByCreatorId(creator_id);
        const duplicateGroup = existingGroups[0].find(group => group.title === title);

        if (duplicateGroup) {
            return res.status(400).json({
                success: false,
                message: 'A group with this name already exists for this user',
                data: null
            });
        }

        //add group
        const result = await Group.insertGroup({ creator_id, title, description, image_url });
        const groupId = result[0].insertId;

        //add creator to grrup
        const status = 'Joined';
        const balance = 0;
        await Membership.insertMemberToGroup({ users_id: creator_id, groups_id: groupId, status, balance });

        //state = 'Active'
        await Group.activateGroup(groupId);

        //notification
        const notifTitle = `Grupo ${title} creado`;
        const notifDescription = 'Ahora añade miembros al grupo y gestiona sus gastos';
        const currentDate = Dayjs().format('YYYY-MM-DD HH:mm');
        await Notification.insertNotification(creator_id, 'Unread', currentDate, notifTitle, notifDescription);

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
        res.status(200).json({
            success: true,
            message: 'Groups retrieved successfully',
            data: groups[0]
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
            res.status(200).json({
                success: true,
                message: 'Group retrieved successfully',
                data: group[0]
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
            res.status(200).json({
                success: true,
                message: 'Groups retrieved successfully',
                data: groups[0]
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


const updateGroup = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, description, image_url } = req.body;
        await Group.updateGroup(id, { title, description, image_url });
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




module.exports = {
    createGroup,
    getGroups,
    getGroupById,
    getGroupsByCreatorId,
    updateGroup,
    deleteGroup,
    getGroupStateByGroupId,
    activateGroup
};
