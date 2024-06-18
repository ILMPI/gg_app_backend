const selectAll = () => {
    return db.query('select * from notifications');
}

const selectByUsersId = (users_id) => {
    return db.query('select * from notifications where users_id=?', [users_id]);
}

const insertNotification = (users_id, status, date, title, description) => {
    return db.query('INSERT INTO notifications (users_id, status, date, title, description) VALUES (?, ?, ?, ?, ?)', [users_id, status, date, title, description]);
}

const updateNotification = (id, {users_id, status, date, title, description}) => {
    return db.query('UPDATE notifications SET users_id = ?, status = ?, date = ?, title = ?, description = ? WHERE id = ?', [users_id, status, date, title, description, id]);
}

const deleteNotification = (id) => {
    return db.query('DELETE FROM notifications WHERE id = ?', [id])
}

module.exports = {
    selectAll, selectByUsersId, insertNotification, updateNotification, deleteNotification
}