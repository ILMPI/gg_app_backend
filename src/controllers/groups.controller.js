const Group = require('../models/groups.model');
const Membership = require('../models/memberships.model');
const Notification = require('../models/notifications.model');

const Dayjs = require('dayjs'); 

const createGroup = async (req, res) => {
    try {

        const { creator_id, title, description, image_url } = req.body;
        await Group.insertGroup({ creator_id, title, description, image_url });
        
        const users_id = Number(creator_id);
        const [group] = await Group.selectGroupByCretorAndTitle(creator_id, title);
        const groups_id = group[0].id;
        const status = 'Joined';
        const balance=0;
        const [result2] = await Membership.insertMemberToGroup({users_id, groups_id, status, balance});
        
        const notifTitle = `Grupo ${title} creado`;
        const notifDescription = 'Ahora añade miembros al grupo y gestiona sus gastos';
        const currentDate = Dayjs().format('YYYY-MM-DD HH:mm');
        const [result3] = await Notification.insertNotification(users_id, 'Unread', currentDate, notifTitle, notifDescription);
    
/*
        const result = await Group.insertGroup({ creator_id, title, description, image_url });
        
        const groupId = result[0].insertId;
        
*/
        res.status(201).json({
            success: true,
            message: 'Group created successfully',
            data: { id: groupId }
        });
    
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            data: { error: error.message }
        });
    }
};

const getGroups = async (req, res) => {
    try {
        const groups = await Group.selectAll();
        res.status(200).json({
            success: true,
            message: 'Groups retrieved successfully',
            data: groups[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            data: null
        });
    }
};

const getGroupById = async (req, res) => {
    try {
        const { id } = req.params;
        const group = await Group.selectById(id);
        if (group.length) {
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
        res.status(500).json({
            success: false,
            message: 'Server error',
            data: null
        });
    }
};

const getGroupsByCreatorId = async (req, res) => {
    try {
        const { creator_id } = req.params;
        const groups = await Group.selectByCreatorId(creator_id);
        res.status(200).json({
            success: true,
            message: 'Groups retrieved successfully',
            data: groups[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            data: null
        });
    }
};

const updateGroup = async (req, res) => {
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
        res.status(500).json({
            success: false,
            message: 'Server error',
            data: { error: error.message }
        });
    }
};

const deleteGroup = async (req, res) => {
    try {
        const { id } = req.params;
        await Group.deleteGroup(id);
        res.status(200).json({
            success: true,
            message: 'Group archived successfully',
            data: null
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            data: { error: error.message }
        });
    }
};

const getGroupStateByGroupId = async (req, res) => {
    try {
        const { groupId } = req.params;
        const state = await Group.selectGroupStateByGroupId(groupId);
        if (state.length) {
            res.status(200).json({
                success: true,
                message: 'Group state retrieved successfully',
                data: state[0]
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'State not found for the given group ID',
                data: null
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            data: null
        });
    }
};

const activateGroup = async (req, res) => {
    try {
        const { id } = req.params;
        await Group.activateGroup(id);
        res.status(200).json({
            success: true,
            message: 'Group activated successfully',
            data: null
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            data: null
        });
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
