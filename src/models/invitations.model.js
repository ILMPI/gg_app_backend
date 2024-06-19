const selectByUsers = (users_id, groups_id) => {
    return db.query('SELECT * FROM invitations WHERE users_id = ?', [users_id, groups_id]);
}

const selectByEmail = (email) => {
    return db.query('SELECT * FROM invitations WHERE email = ?', [email]);
}

const insertInvitation = (users_id, groups_id, sent_on, responded_on, email) => {
    return db.query('INSERT INTO invitations (users_id, groups_id, sent_on, responded_on, email) VALUES (?, ?, ?, ?, ?)', [users_id, groups_id, sent_on, responded_on, email]);
}
const selectRecentInvitation = (users_id, groups_id, email) => {
    return db.query(`
        SELECT * FROM invitations
        WHERE users_id = ? AND groups_id = ? AND email = ? AND sent_on > NOW() - INTERVAL 1 DAY
    `, [users_id, groups_id, email]);
};

module.exports = {
    selectByUsers,
    selectByEmail,
    insertInvitation,
    selectRecentInvitation
}