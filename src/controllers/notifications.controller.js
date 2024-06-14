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
        res.status(500).json({
            success: false,
            message: 'Server error',
            data: null
        });
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
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            data: null
        });
        next(err);
    }
    
};

module.exports = {
    getAllNotifications, createNotification
}