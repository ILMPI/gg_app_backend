const Group = require('../models/groups.model');

const createGroup = async (req, res) => {
    try {
        const { creator_id, title, description, image_url } = req.body;
        await Group.insertGroup({ creator_id, title, description, image_url });
        res.status(201).json({ message: 'Group created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getGroups = async (req, res) => {
    try {
        const groups = await Group.selectAll();
        res.status(200).json(groups);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getGroupById = async (req, res) => {
    try {
        const { id } = req.params;
        const group = await Group.selectById(id);
        if (group.length) {
            res.status(200).json(group[0]);
        } else {
            res.status(404).json({ error: 'Group not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getGroupsByCreatorId = async (req, res) => {
    try {
        const { creator_id } = req.params;
        const groups = await Group.selectByCreatorId(creator_id);
        res.status(200).json(groups);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateGroup = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, image_url } = req.body;
        await Group.updateGroup(id, { title, description, image_url });
        res.status(200).json({ message: 'Group updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteGroup = async (req, res) => {
    try {
        const { id } = req.params;
        await Group.deleteGroup(id);
        res.status(200).json({ message: 'Group archived successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getGroupStateByGroupId = async (req, res) => {
    try {
        const { groupId } = req.params;
        const state = await Group.selectGroupStateByGroupId(groupId);
        if (state.length) {
            res.status(200).json(state[0]);
        } else {
            res.status(404).json({ error: 'State not found for the given group ID' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const activateGroup = async (req, res) => {
    try {
        const { id } = req.params;
        await Group.activateGroup(id);
        res.status(200).json({ message: 'Group activated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
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
