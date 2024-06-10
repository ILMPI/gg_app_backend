const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users.model');

const getAllUsers = async (req, res, next) => {
    try {
        console.log('getallusers');
        const [result] = await User.selectAll();
        res.send(result);
    } catch (err) {
        next(err);
    }
};

const getUserById = async (req, res, next) => {
    try {
        const [result] = await User.selectById(req.params.id);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

const register = async (req, res, next) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const userData = {
            ...req.body,
            password: hashedPassword,
            image_url: req.body.image_url || null,
            state: req.body.state || 'Active'
        };
        const [result] = await User.insertUser(userData);

        if (result.affectedRows === 1) {
            res.json({
                id: result.insertId,
                name: req.body.name,
                email: req.body.email,
                image_url: req.body.image_url,
                state: req.body.state
            });
        } else {
            res.status(500).json({ error: 'User registration failed' });
        }
    } catch (err) {
        next(err);
    }
};

const login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        // Check email
        const [users] = await User.selectByEmail(email);
        if (users.length === 0) {
            return res.status(401).json({ error: 'error en email y/o password' });
        }

        const user = users[0];

        // Check password
        const iguales = bcrypt.compareSync(password, user.password);
        if (!iguales) {
            return res.status(401).json({ error: 'error en email y/o en password' });
        }

        // Generate JWT
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: 86400 // 24 hours
        });

        // Login response with user data
        res.json({
            success: 'login correcto',
            accessToken: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                image_url: user.image_url,
                state: user.state
            }
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
            return res.status(403).send({ message: 'Forbidden: You can only update your own profile' });
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
            res.json({ message: 'Profile updated successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        next(err);
    }
};

const searchUserByEmail = async (req, res, next) => {
    try {
        const { email } = req.params;
        const [result] = await User.selectByEmail(email);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

const deleteUserById = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (req.userId !== parseInt(id, 10)) {
            return res.status(403).send({ message: 'Forbidden: You can only delete your own profile' });
        }

        const [connections] = await User.checkActiveConnections(id);
        const status = connections[0].status;

        if (status === 'Admin of Active Group' || status === 'Member of Active Group') {
            return res.status(400).json({ message: 'User has active connections and cannot be deleted' });
        }

        const [result] = await User.deleteById(id);
        if (result.affectedRows === 1) {
            res.json({ message: 'User deleted successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    register,
    login,
    deleteUserById,
    updateUserById,
    searchUserByEmail
};
