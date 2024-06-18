const selectByUsers = (users_id, groups_id) => {
    return db.query('SELECT * FROM invitations WHERE users_id = ?', [users_id, groups_id]);
}

const selectByEmail = (email) => {
    return db.query('SELECT * FROM invitations WHERE email = ?', [email]);
}

const insertInvitation = (users_id, groups_id, sent_on, responded_on, email) => {
    return db.query('INSERT INTO invitations (users_id, groups_id, sent_on, responded_on, email) VALUES (?, ?, ?, ?, ?)', [users_id, groups_id, sent_on, responded_on, email]);
}

module.exports = {
    selectByUsers,
    selectByEmail,
    insertInvitation
}