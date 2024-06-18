const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users.model');
const Invitation = require('../models/invitations.model');
const Membership = require('../models/memberships.model');
const Notification = require('../models/notifications.model');
const Group = require('../models/groups.model');
const Dayjs = require('dayjs');

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
        
        //comprobar si tiene invitaciones
        const [findEmail] = await Invitation.selectByEmail(req.body.email);
        const groups_id = findEmail[0].groups_id;
        const invitator_id = findEmail[0].users_id;
        const [invitator] = await User.selectById(invitator_id);
        const invitatorName = invitator[0].name;
        
        if ((findEmail[0].email)===(req.body.email)) {
            
            const [users] = await User.selectByEmail(req.body.email);
            const users_id = users[0].id;
            const [result2] = await Membership.insertMemberFromInvitation(users_id, groups_id, 'Joined', 0);
            
            //Crear notificaciones a interesados
            var title = 'Usuario recien registrado añadido a un grupo tuyo';
            const [group] =await  Group.selectById(groups_id);
            const groupTitle = group[0].title;
            var description = `El usuario ${req.body.name} se ha añadido al grupo: ${groupTitle}, gestionado por ti`;
            const currentDate = await Dayjs().format('YYYY-MM-DD HH:mm');
            console.log(invitator_id, 'Unread', currentDate, title, description)
            await Notification.insertNotification(invitator_id, 'Unread', currentDate, title, description)
            
            title = 'Se te ha añadido a grupo';
            description = `Te has añadido al grupo ${groupTitle} al que estabas invitado por ${invitatorName}`;
            await Notification.insertNotification(users_id, 'Unread', currentDate, title, description);

        }

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
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image_url: user.image_url,
                    state: user.state
                }
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
