const selectAll = () => {
    return db.query('select * from notifications');
}

const insertNotification = (users_id, status, date, title, description) => {
    console.log('en el model insert notif');
    return db.query('INSERT INTO notifications (users_id, status, date, title, description) VALUES (?, ?, ?, ?, ?)', [users_id, status, date, title, description]);
}

module.exports = {
    selectAll, insertNotification
}