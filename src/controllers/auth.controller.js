const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users.model');

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
        const [users] = await User.selectByEmail(email);
        if (users.length === 0) {
            return res.status(401).json({ error: 'error en email y/o password' });
        }

        const user = users[0];
        const iguales = bcrypt.compareSync(password, user.password);
        if (!iguales) {
            return res.status(401).json({ error: 'error en email y/o en password' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: 86400 // 24 hours
        });

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

module.exports = {
    register,
    login
};
