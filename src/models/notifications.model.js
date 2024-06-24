const selectAll = () => {
    return db.query('select * from notifications');
}

const selectById = (id) => {
    return db.query('SELECT * FROM notifications WHERE id =?', [id]);
}

const selectByUsersId = (users_id) => {
    return db.query('select * from notifications where users_id=?', [users_id]);
}

const selectByUserGroup = (users_id, groups_id) => {
    return db.query('SELECT * FROM notifications WHERE users_id = ? AND group_id = ?', [users_id, groups_id]);
}

const selectInvitesForUserAndGroup = (users_id, groups_id) => {
    return db.query('SELECT * FROM notifications WHERE users_id = ? AND group_id = ? AND title = ?', [users_id, groups_id, 'Has sido invitado a un nuevo grupo']);
};

const insertNotification = (users_id, status, date, title, description, group_id = null, expense_id = null) => {
    return db.query(
        'INSERT INTO notifications (users_id, status, date, title, description, group_id, expense_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [users_id, status, date, title, description, group_id, expense_id]
    );
}

const updateNotification = (id, {users_id, status, date, title, description}) => {
    return db.query('UPDATE notifications SET users_id = ?, status = ?, date = ?, title = ?, description = ? WHERE id = ?', [users_id, status, date, title, description, id]);
}

const deleteNotification = (id) => {
    return db.query('DELETE FROM notifications WHERE id = ?', [id])
}


const setStatusReadNotifications = (id) => {
    return db.query(`UPDATE notifications SET status='Read' WHERE id = ?`, [id]);
}

const setAllNotificationsAsRead = (userId) => {
    return db.query(`
        UPDATE notifications 
        SET status = 'Read' 
        WHERE users_id = ? AND status = 'Unread'
    `, [userId]);
};
const unreadNotifications = (userId) => {
    return db.query(`
    SELECT * FROM notifications 
    WHERE users_id = ? AND status = 'Unread'
`, [userId]);
};

const checkExistingNotification = (users_id, expenses_id, title) => {
    return db.query(`
        SELECT * 
        FROM notifications 
        WHERE users_id = ? 
        AND expense_id = ? 
        AND title = ?
    `, [users_id, expenses_id, title]);
};



module.exports = {
    selectAll,
    selectById,
    selectByUsersId,
    selectByUserGroup,
    insertNotification,
    updateNotification,
    deleteNotification,
    selectInvitesForUserAndGroup,
    setStatusReadNotifications,
    setAllNotificationsAsRead,
    unreadNotifications,
    checkExistingNotification
}