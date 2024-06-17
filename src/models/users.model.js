const selectAll = () => {
    return db.query('SELECT id, name, email, image_url, state FROM users');
};

const selectById = (id) => {
    return db.query('SELECT id, name, email, image_url, state FROM users WHERE id=?', [id]);
};

const insertUser = ({ password, name, email, image_url = null, state = 'Active' }) => {
    return db.query('INSERT INTO users (password, name, email, image_url, state) VALUES (?, ?, ?, ?, ?)', [password, name, email, image_url, state]);
};

const deleteById = (id) => {
    return db.query('DELETE FROM users WHERE id=?', [id]);
};
// for front
const selectByEmail = (email) => {
    return db.query(`SELECT id, name, email FROM users WHERE email=? AND state = 'Active'`, [email]);
};
//only for login
const auth_selectByEmail = (email) => {
    return db.query('SELECT * FROM users WHERE email=?', [email]);
};

const updateUserById = (id, { password, name, email, image_url, state }) => {
    const query = `
        UPDATE users 
        SET 
            password = COALESCE(?, password), 
            name = COALESCE(?, name), 
            email = COALESCE(?, email), 
            image_url = COALESCE(?, image_url), 
            state = COALESCE(?, state) 
        WHERE id = ?
    `;
    const params = [password, name, email, image_url, state, id];
    return db.query(query, params);
};

const checkActiveConnections = (id) => {
    const query = `
SELECT 
    CASE
        WHEN EXISTS (
            SELECT 1
            FROM \`groups\`
            JOIN \`group_states\` ON \`groups\`.\`id\` = \`group_states\`.\`groups_id\`
            WHERE \`groups\`.\`creator_id\` = ?
              AND \`group_states\`.\`status\` = 'Active'
        ) THEN 'Admin of Active Group'
        WHEN EXISTS (
            SELECT 1
            FROM \`membership\`
            JOIN \`group_states\` ON \`membership\`.\`groups_id\` = \`group_states\`.\`groups_id\`
            WHERE \`membership\`.\`users_id\` = ?
              AND \`group_states\`.\`status\` = 'Active'
        ) THEN 'Member of Active Group'
        ELSE 'No Membership or Admin Role in Active Group'
    END AS status;
`;
    return db.query(query, [id, id]);
};

module.exports = {
    selectAll,
    selectById,
    insertUser,
    deleteById,
    auth_selectByEmail,
    selectByEmail,
    updateUserById,
    checkActiveConnections
};
