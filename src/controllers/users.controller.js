const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users.model');

const getAllUsers = async (req, res, next) => {
    try {
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

const deleteUserById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const [result] = await User.deleteById(id);
        if (result.affectedRows === 1) {
            res.json({ message: 'Se ha borrado el usuario' });
        } else {
            res.status(404).json({ message: 'El usuario no existe' });
        }
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
        //check email
        const [users] = await User.selectByEmail(email);
        if (users.length === 0) {
            return res.status(401).json({ error: 'error en email y/o password' });
        }

        const user = users[0];

        //check password
        const iguales = bcrypt.compareSync(password, user.password);
        if (!iguales) {
            return res.status(401).json({ error: 'error en email y/o en password' });
        }

        //generate JWT
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: 86400 // 24 hours
        });

        //login
        res.json({ success: 'login correcto', accessToken: token });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    register,
    login,
    deleteUserById
};
