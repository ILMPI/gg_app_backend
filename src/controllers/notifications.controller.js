const Nodemailer = require('nodemailer');
const Dayjs = require('dayjs');
const Notification = require('../models/notifications.model');
const User = require('../models/users.model');
const { transformNotificationDescription } = require('../utils/notificationUtils');
//const { sendMail } = require('../utils/emailUtils');  

const getAllNotifications = async (req, res, next) => { 
    try {
        const [result] = await Notification.selectAll();

        this.saludar();

        res.json({
            success: true,
            message: 'Notifications retrieved successfully',
            data: result
        });
    }catch(err){
        next(err);
    }
}

const getNotificationsByUsersID = async (req, res, next) => {
    try{
        const { users_id } = req.params;
        const notifications = await Notification.selectByUsersId(users_id);
        res.status(200).json({
            success: true,
            message: 'Notifications retrieved successfully',
            data: notifications[0]
        });
    }catch(err){
        next(err);
    }
}

const createNotification = async (req, res, next) => {
    try {
        const {users_id, status, date, title, description} = req.body;
        await Notification.insertNotification(users_id, status, date, title, description );
        
        const [user] = await User.selectById(users_id);
        const email = user[0].email;
        const textSubject = `Notificacion de gg_app ${title}`;
        //await sendmail(email,textSubject,description);

        res.status(201).json({
            success: true,
            message: 'Notification created successfully',
            data: null
        });
    } catch (err) {
        next(err);
    }
}

const updateNotification = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { users_id, status, date, title, description} = req.body;
        await Notification.updateNotification(id, { users_id, status, date, title, description });
        res.status(200).json({
            success: true,
            message: 'Notification updated successfully',
            data: null
        });
    } catch (error) {
        next(error);
    }
}

const deleteNotification = async (req, res, next) => {
    try{
        const { id } = req.params;
        await Notification.deleteNotification(id);
        res.status(200).json({
            succes: true,
            message: 'Notification deleted successfully',
            data: null
        })
    }catch(error){
        next(error);
    }
}

const sendInviteUserToGroupNotification = async (userId, inviterId, groupId) => {
    try {
        const notifTitle = `Has sido añadido a un nuevo grupo`;

        let notifDescription = `Has sido añadido al grupo ${groupId} por ${inviterId}`;

        notifDescription = await transformNotificationDescription(notifDescription, inviterId, groupId);

        const currentDate = Dayjs().format('YYYY-MM-DD HH:mm');
        await Notification.insertNotification(userId, 'Unread', currentDate, notifTitle, notifDescription, groupId);
        console.log('Notification inserted successfully');
        
        const email = User.selectById(userId).email;
        //await sendMail(email, notifTitle, notifDescription);

    } catch (error) {
        console.error('Error inserting notification:', error);
        throw error;
    }
};

module.exports = {
    getAllNotifications,
    getNotificationsByUsersID,
    createNotification,
    updateNotification,
    deleteNotification,
    sendInviteUserToGroupNotification,
}