const Group = require('../models/groups.model');

const createGroup = async (req, res) => {
    try {
        const { creator_id, title, description, image_url } = req.body;
        await Group.insertGroup({ creator_id, title, description, image_url });
        res.status(201).json({
            success: true,
            message: 'Group created successfully',
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

const getGroups = async (req, res) => {
    try {
        const groups = await Group.selectAll();
        res.status(200).json({
            success: true,
            message: 'Groups retrieved successfully',
            data: groups
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
            data: groups
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
            data: null
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
            data: null
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
