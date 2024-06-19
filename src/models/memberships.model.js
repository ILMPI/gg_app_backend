const selectAll = () => {

    return db.query('select * from membership');
}

const selectByGroupId = (groups_id) => {
    
    return db.query(`select * from membership where groups_id= ?`,[groups_id]);
    
}
//select * from membership where groups_id= ? and status = 'Joined'

// to get the data of users from the exact group
const selectMembersDataByGroupId = (groups_id)=>{
    
    return db.query(`
        SELECT u.id as users_id, u.name, u.email, u.image_url
        FROM membership m
        JOIN users u ON m.users_id = u.id
        WHERE m.groups_id = ?
    `, [groups_id]);

};


const insertMemberToGroup = ({users_id, groups_id, status, balance})=> {
    
    return db.query('insert into membership (users_id, groups_id, status, balance) values (?,?,?,?)',[users_id, groups_id, status, balance]);

}

const insertMemberFromInvitation = (users_id, groups_id, status, balance) =>{

    return db.query('insert into membership (users_id, groups_id, status, balance) values (?,?,?,?)',[users_id, groups_id, status, balance]);

}

const updateMembershipStatus = (users_id, groups_id) => {
    
    return db.query('update membership set status="Joined" where (users_id=? and groups_id=?)',[users_id, groups_id])

}

const selectMember = (users_id, groups_id) => {
    return db.query('select * from membership where (users_id =? and groups_id= ?)',[users_id, groups_id]);
}

const deleteMember = (users_id, groups_id) => {
    return db.query(`
        DELETE FROM membership 
        WHERE users_id = ?
        AND groups_id = ?
        AND balance = 0
        AND users_id != (SELECT creator_id FROM \`groups\` WHERE id = ?)
    `, [users_id, groups_id, groups_id]);
}


module.exports = {
    selectAll,
    selectByGroupId,
    insertMemberToGroup,
    updateMembershipStatus,
    selectMember,
    deleteMember,
    selectMembersDataByGroupId,
}