const Nodemailer = require('nodemailer');
const Dayjs = require('dayjs');
const Notification = require('../models/notifications.model');
const User = require('../models/users.model');
const Group = require('../models/groups.model');
const Membership = require('../models/memberships.model')
const { transformNotificationDescription } = require('../utils/notificationUtils');
//const { sendMail } = require('../utils/emailUtils');  

const getAllNotifications = async (req, res, next) => { 
    try {
        const [result] = await Notification.selectAll();

        //this.saludar();

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
/*--------------------------------------------------------------*/
//CREATE group

const sendGroupCreationNotification = async (users_id, title, group_id) => {
    const notifTitle = `Grupo ${title} creado`;
    const notifDescription = 'Ahora añade miembros al grupo y gestiona sus gastos';
    const currentDate = Dayjs().format('YYYY-MM-DD HH:mm');
    await Notification.insertNotification(users_id, 'Unread', currentDate, notifTitle, notifDescription, group_id);
};
/*---------------------------------------------------------------*/
//INVITE to group

// invite to the group
const sendInviteUserToGroupNotification = async (userId, inviterId, groupId) => {
    try {
        const notifTitle = `Has sido invitado a un nuevo grupo`;

        let notifDescription = `Has sido invitado al grupo ${groupId} por ${inviterId}`;

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

//notification on update user status
const sendUserJoinedNotification = async (users_id, groups_id) => {
    try {
        // Get the group admin and the user details
        const [groupAdmin] = await User.selectAdminByGroupId(groups_id);
        const [user] = await User.selectById(users_id);
        const [group] = await Group.selectById(groups_id);

        if (groupAdmin.length === 0 || user.length === 0 || group.length === 0) {
            throw new Error('Group admin, user, or group not found');
        }

        // Send a notification to the group admin
        const notificationTitle = 'Nuevo miembro se unió al grupo';
        const notificationDescription = `${user[0].name} se ha unido al grupo`;

        await Notification.insertNotification(
            groupAdmin[0].id,
            'Unread',
            Dayjs().format('YYYY-MM-DD HH:mm'),
            notificationTitle,
            notificationDescription,
            groups_id
        );

        // Find all existing notifications for the user about the invite to this group and delete them
        const [existingInvites] = await Notification.selectInvitesForUserAndGroup(users_id, groups_id);

        for (const invite of existingInvites) {
            await Notification.deleteNotification(invite.id);
        }

        // Add a new notification for the user indicating they successfully joined the group
        const userNotificationTitle = 'Te has unido al grupo exitosamente';
        const userNotificationDescription = `Te has unido al grupo ${group[0].title} exitosamente`;

        await Notification.insertNotification(
            users_id,
            'Unread',
            Dayjs().format('YYYY-MM-DD HH:mm'),
            userNotificationTitle,
            userNotificationDescription,
            groups_id
        );

    } catch (error) {
        console.error('Error creating notification:', error);
        throw error;
    }
};

// user refuse to unite
const sendRefusalNotification = async (users_id, groups_id) => {
    try {
        // Get the group admin and the user details
        const [groupAdmin] = await User.selectAdminByGroupId(groups_id);
        const [user] = await User.selectById(users_id);
        const [group] = await Group.selectById(groups_id);

        if (groupAdmin.length === 0 || user.length === 0 || group.length === 0) {
            throw new Error('Group admin, user, or group not found');
        }

        // Send a notification to the group admin about the user's refusal
        const notificationTitle = 'Un usuario ha rechazado la invitación al grupo';
        const notificationDescription = `${user[0].name} ha rechazado la invitación para unirse al grupo`;

        await Notification.insertNotification(
            groupAdmin[0].id,
            'Unread',
            Dayjs().format('YYYY-MM-DD HH:mm'),
            notificationTitle,
            notificationDescription,
            groups_id
        );

        // Find all existing notifications for the user about the invite to this group and delete them
        const [existingInvites] = await Notification.selectInvitesForUserAndGroup(users_id, groups_id);

        for (const invite of existingInvites) {
            await Notification.deleteNotification(invite.id);
        }

        // Add a new notification for the user indicating they have refused the group invitation
        const userNotificationTitle = 'Has rechazado la invitación al grupo';
        const userNotificationDescription = `Has rechazado la invitación para unirte al grupo ${group[0].title}`;

        await Notification.insertNotification(
            users_id,
            'Unread',
            Dayjs().format('YYYY-MM-DD HH:mm'),
            userNotificationTitle,
            userNotificationDescription,
            groups_id
        );

    } catch (error) {
        console.error(error);
        throw error;
    }
};
/*--------------------------------------------------------------------------------------*/
// CREATE expense
// to the payer
const sendPayerExpenseNotification = async (users_id, expense_name, reparto, expenses_id, group_id) => {
    try {
        const title = 'Se ha asignado tu parte del gasto';
        const description = `Del gasto: ${expense_name}, has pagado la totalidad, pero al participar, se descuenta tu parte correspondiente, que son: ${reparto}€.`;
        const currentDate = Dayjs().format('YYYY-MM-DD HH:mm');
        await Notification.insertNotification(users_id, 'Unread', currentDate, title, description, group_id, expenses_id);
        console.log('Notification created for payer');
    } catch (error) {
        console.error('Error creating payer notification:', error);
        throw error;
    }
};
//to the participant of the expense
const sendMemberExpenseNotification = async (users_id, expense_name, reparto, expenses_id, group_id) => {
    try {
        const title = 'Se ha asignado tu parte del gasto';
        const description = `Del gasto: ${expense_name}, te corresponde pagar ${reparto}€. No te demores en hacerlo.`;
        const currentDate = Dayjs().format('YYYY-MM-DD HH:mm');
        await Notification.insertNotification(users_id, 'Unread', currentDate, title, description, group_id, expenses_id);
        console.log('Notification created for member');
    } catch (error) {
        console.error('Error creating member notification:', error);
        throw error;
    }
};

/*------------------------------------------------*/
// PAY expense

const notifyPaymentMade = async (users_id, expenseName, cost, expenses_id, groups_id) => {
    try {
        const title = 'Has pagado tu parte de un gasto';
        const description = `Del gasto: ${expenseName}, has pagado tu parte correspondiente: ${cost}€`;
        const currentDate = Dayjs().format('YYYY-MM-DD HH:mm');
        await Notification.insertNotification(users_id, 'Unread', currentDate, title, description, groups_id, expenses_id);
        console.log('Notification created for member');
    } catch (error) {
        console.error('Error creating member notification:', error);
        throw error;
    }
};

const notifyPaymentReceived = async (payer_user_id, expenseName, payerName, cost, expenses_id, groups_id) => {
    try {
    const title = 'Has cobrado una parte de un gasto';
    const description = `${payerName}, del gasto: ${expenseName}, has cobrado, la parte que te correspondia: ${cost}€`;
    const currentDate = Dayjs().format('YYYY-MM-DD HH:mm');
    await Notification.insertNotification(payer_user_id, 'Unread', currentDate, title, description, groups_id, expenses_id);
    console.log('Notification created for payer');
    }catch (error) {
        console.error('Error creating member notification:', error);
        throw error;
    }
};

/*----------------------------------------------------- */
// STATUS change of notification
// make a one notification read
const setStatusReadNotificationId = async (req, res, next) => {
    try {
        const {id} = req.params;
        const [result] = await Notification.selectById(id);

        if (!result.length) {
            return res.status(404).json({
                success: false,
                message: 'No existe esa notificacion',
                data: null
            });
        }

        await Notification.setStatusReadNotifications(id);  
        
        res.status(200).json({
            success: true,
            message: 'Notification setting Read successfully',
            data: null
        });
    } catch (error) {
        console.error('Error setting status Unread in notifications:', error);
        next(error);
    }
};

// make all notifications which are unread for this user -> Read
const setStatusReadAllNotifications = async (req, res, next) => {
    try {
        const users_id = req.params.users_id;
        const [unreadNotifications] = await Notification.unreadNotifications(users_id);

        if (!unreadNotifications.length) {
            return res.status(404).json({
                success: false,
                message: 'No unread notifications found for this user',
                data: null
            });
        }

        await Notification.setAllNotificationsAsRead(users_id);

        res.status(200).json({
            success: true,
            message: 'Notifications set to Read successfully',
            data: null
        });
    } catch (error) {
        next(error);
    }
};
/*--------------------------------------------------------------- */



module.exports = {
    getAllNotifications,
    getNotificationsByUsersID,
    createNotification,
    updateNotification,
    deleteNotification,
    sendInviteUserToGroupNotification,
    sendUserJoinedNotification,
    sendPayerExpenseNotification,
    sendMemberExpenseNotification,
    notifyPaymentMade,
    notifyPaymentReceived,
    setStatusReadNotificationId,
    setStatusReadAllNotifications,
    sendRefusalNotification,
    sendGroupCreationNotification
}