const { validationResult } = require('express-validator');
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
            return res.json({
                success: true,
                message: 'User registered successfully',
                data: {
                    id: result.insertId,
                    name: req.body.name,
                    email: req.body.email,
                    image_url: req.body.image_url,
                    state: req.body.state
                }
            });
        } else {
            return res.status(500).json({
                success: false,
                message: 'User registration failed',
                data: null
            });
        }
    } catch (err) {
        next(err);
    }
};

const login = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation errors',
            data: errors.array()
        });
    }

    const { email, password } = req.body;
    try {
        const [users] = await User.selectByEmail(email);
        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
                data: null
            });
        }
        const user = users[0];
        const iguales = bcrypt.compareSync(password, user.password);
        if (!iguales) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
                data: null
            });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: 86400 // 24 hours
        });

        return res.json({
            success: true,
            message: 'Login successful',
            data: {
                accessToken: token,
                user:{
                    name: user.name
                }
                // user: {
                //     id: user.id,
                //     name: user.name,
                //     email: user.email,
                //     image_url: user.image_url,
                //     state: user.state
                // }
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
