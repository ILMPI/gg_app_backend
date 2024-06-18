const bcrypt = require('bcryptjs');
const User = require('../models/users.model');

const getAllUsers = async (req, res, next) => {
    try {
        const [result] = await User.selectAll();
        res.json({
            success: true,
            message: 'Users retrieved successfully',
            data: result
        });
    } catch (err) {
        next(err);
    }
};

const getUserById = async (req, res, next) => {
    try {
        const [result] = await User.selectById(req.params.id);
        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
                data: null
            });
        }
        res.json({
            success: true,
            message: 'User retrieved successfully',
            data: result[0]
        });
    } catch (err) {
        next(err);
    }
};

const updateUserById = async (req, res, next) => {
    console.log('updateUserById function called');
    try {
        const { id } = req.params;
        if (req.userId !== parseInt(id, 10)) {
            return res.status(403).json({
                success: false,
                message: 'Forbidden: You can only update your own profile',
                data: null
            });
        }

        const hashedPassword = req.body.password ? await bcrypt.hash(req.body.password, 10) : undefined;
        const userData = {
            ...req.body,
            password: hashedPassword,
            image_url: req.body.image_url || null,
            state: req.body.state || 'Active'
        };

        const [result] = await User.updateUserById(id, userData);
        if (result.affectedRows === 1) {
            res.json({
                success: true,
                message: 'Profile updated successfully',
                data: userData
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'User not found',
                data: null
            });
        }
    } catch (err) {
        next(err);
    }
};

const searchUserByEmail = async (req, res, next) => {
    try {
        const { email } = req.params;
        const [result] = await User.selectByEmail(email);
        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
                data: null
            });
        }
        res.json({
            success: true,
            message: 'User retrieved successfully',
            data: result[0]
        });
    } catch (err) {
        next(err);
    }
};

const getUsersWithCommonGroups = async (req, res, next) => {
    try {
        const userId = req.params.userId;

        //Check if the user doesnt have a moro and is requesting their own common groups
        if (req.userId !== parseInt(userId, 10)) {
            return res.status(403).json({
                success: false,
                message: 'Forbidden: You can only retrieve the list of users with common groups for your own profile',
                data: null
            });
        }

        const [users] = await User.selectUsersWithCommonGroups(userId);
        
        res.status(200).json({
            success: true,
            message: 'Users with common groups retrieved successfully',
            data: users
        });
    } catch (error) {
        next(error);
    }
};



const deleteUserById = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (req.userId !== parseInt(id, 10)) {
            return res.status(403).json({
                success: false,
                message: 'Forbidden: You can only delete your own profile',
                data: null
            });
        }

        const [connections] = await User.checkActiveConnections(id);
        const status = connections[0].status;

        if (status === 'Admin of Active Group' || status === 'Member of Active Group') {
            return res.status(400).json({
                success: false,
                message: 'User has active connections and cannot be deleted',
                data: null
            });
        }

        const [result] = await User.deleteById(id);
        if (result.affectedRows === 1) {
            res.json({
                success: true,
                message: 'User deleted successfully',
                data: null
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'User not found',
                data: null
            });
        }
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    deleteUserById,
    updateUserById,
    searchUserByEmail,
    getUsersWithCommonGroups
};
