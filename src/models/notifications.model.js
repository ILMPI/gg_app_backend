const selectAll = () => {
    return db.query('select * from notifications');
}

const selectByUsersId = (users_id) => {
    return db.query('select * from notifications where users_id=?', [users_id]);
}

const selectInvitesForUserAndGroup = (users_id, groups_id) => {
    return db.query('SELECT * FROM notifications WHERE users_id = ? AND group_id = ? AND title = ?', [users_id, groups_id, 'Has sido invitado a un nuevo grupo']);
};

const insertNotification = (users_id, status, date, title, description, group_id, expense_id) => {
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


module.exports = {
    selectAll,
    selectByUsersId,
    insertNotification,
    updateNotification,
    deleteNotification,
    selectInvitesForUserAndGroup,
}