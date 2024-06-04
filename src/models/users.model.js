const selectAll = () => {
    return db.query('SELECT * FROM users');
};

const selectById = (id) => {
    return db.query('SELECT * FROM users WHERE id=?', [id]);
};

const insertUser = ({ password, name, email, image_url = null, state = 'Active' }) => {
    return db.query('INSERT INTO users (password, name, email, image_url, state) VALUES (?, ?, ?, ?, ?)', [password, name, email, image_url, state]);
};

const deleteById = (id) => {
    return db.query('DELETE FROM users WHERE id=?', [id]);
};

const selectByEmail = (email) => {
    return db.query('SELECT * FROM users WHERE email=?', [email]);
};

module.exports = {
    selectAll, selectById, insertUser, deleteById, selectByEmail
};
