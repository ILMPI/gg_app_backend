const selectAll = () => {
    return db.query('select * from mydb.groups');
}

const selectById = (id)=>{
    return db.query('select * from mydb.groups where id=?',[id]);
}

const insertGroup = ({creator_id, title, description, image_url})=>{
    return db.query('insert into mydb.groups (creator_id, title, description, image_url) values (?,?,?,?)',[creator_id, title, description, image_url]);
}

const selectByCreatorId = (creator_id)=>{
    return db.query('select * from mydb.groups where creator_id=?',[creator_id]);
}


module.exports = {
    selectAll, selectById, insertGroup, selectByCreatorId
}