const selectAll = () => {
    return db.query('SELECT * FROM `groups`');
}

const selectById = (id) => {
    return db.query('SELECT * FROM `groups` WHERE id = ?', [id]);
}

const insertGroup = ({ creator_id, title, description, image_url }) => {
    return db.query('INSERT INTO `groups` (creator_id, title, description, image_url) VALUES (?, ?, ?, ?)', [creator_id, title, description, image_url]);
}

const selectByCreatorId = (creator_id) => {
    return db.query('SELECT * FROM `groups` WHERE creator_id = ?', [creator_id]);
}

const selectAllGroupsByUserId = (userId) => {
    return db.query(`
        SELECT DISTINCT g.* 
        FROM ggapp.groups g
        LEFT JOIN ggapp.membership m ON g.id = m.groups_id
        WHERE m.users_id = ? OR g.creator_id = ?
    `, [userId, userId]);
}


const selectGroupByCretorAndTitle = (creator_id, title) => {
    return db.query('SELECT * FROM ggapp.groups WHERE creator_id=? AND title=?',[creator_id, title]);
}

//SELECT id, title, description, image_url,created_on FROM  `groups` WHERE creator_id = ?;

const updateGroup = (id, { title, description, image_url }) => {
    return db.query('UPDATE `groups` SET title = ?, description = ?, image_url = ? WHERE id = ?', [title, description, image_url, id]);
}

const deleteGroup = (id) => {
    return db.query(`
        INSERT INTO \`ggapp\`.\`group_states\` (\`status\`, \`changed_on\`, \`groups_id\`)
        SELECT 'Archived', NOW(), g.id
        FROM \`ggapp\`.\`groups\` g
        WHERE g.id = ?
        AND NOT EXISTS (
        SELECT 1
        FROM \`ggapp\`.\`expenses\` e
        JOIN \`ggapp\`.\`expense_assignments\` ea ON e.expense_id = ea.expenses_id
        WHERE e.groups_id = g.id
        AND ea.status != 'Paid'
  );`
, [id]);
}

//group_state
// to change the status of group to active
const activateGroup = (groupId) => {
    return db.query('INSERT INTO `group_states` (status, changed_on, groups_id) VALUES ("Active", NOW(), ?)', [groupId]);
}
//recent state of the group
const selectGroupStateByGroupId = (groupId) => {
    return db.query('SELECT * FROM `group_states` WHERE groups_id = ? ORDER BY changed_on DESC LIMIT 1', [groupId]);
}

const selectCreatorByGroupId = (groupId) => {
    return db.query('SELECT creator_id FROM `groups` WHERE id = ?', [groupId]);
}

module.exports = {
    selectAll,
    selectById,
    insertGroup,
    selectByCreatorId,
    updateGroup,
    deleteGroup,
    activateGroup,
    selectGroupStateByGroupId,
    selectCreatorByGroupId,
    selectGroupByCretorAndTitle,
    selectAllGroupsByUserId
}
