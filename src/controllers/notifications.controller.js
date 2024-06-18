const Notification = require('../models/notifications.model')


const getAllNotifications = async (req, res, next) => { 
    try {
        const [result] = await Notification.selectAll();
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

module.exports = {
    getAllNotifications, getNotificationsByUsersID, createNotification, updateNotification, deleteNotification
}