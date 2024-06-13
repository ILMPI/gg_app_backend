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
//SELECT id, title, description, image_url,created_on FROM  `groups` WHERE creator_id = ?;

const updateGroup = (id, { title, description, image_url }) => {
    return db.query('UPDATE `groups` SET title = ?, description = ?, image_url = ? WHERE id = ?', [title, description, image_url, id]);
}

const deleteGroup = (id) => {
    return db.query(`
        INSERT INTO \`mydb\`.\`group_states\` (\`id\`, \`status\`, \`changed_on\`, \`groups_id\`)
        SELECT NULL, 'Archived', NOW(), g.id
        FROM \`mydb\`.\`groups\` g
        WHERE g.id = ?
          AND NOT EXISTS (
              SELECT 1
              FROM \`mydb\`.\`expenses\` e
              JOIN \`mydb\`.\`expense_assignments\` ea ON e.id = ea.expenses_id
              WHERE e.groups_id = g.id
                AND ea.status != 'Paid'
          );
    `, [id]);
}

//group_state
// to change the status of archived group to active
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
    selectCreatorByGroupId
}
