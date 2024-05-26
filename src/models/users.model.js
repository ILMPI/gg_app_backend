const selectAll = () =>{
    return db.query('select * from users');
}

const selectById = (id)=>{
    return db.query('select * from users where id=?',[id]);
}

const insertUser = ({password, name, email, image_url, state})=>{
    return db.query('insert into users (password, name, email, image_url, state) values (?,?,?,?,?)',[password, name, email, image_url, state]);
}

const deleteById = (id) =>{
    return db.query('delete from users where id=?',[id]);
}

const selectByEmail = (email) => {
    return db.query('select * from users where email=?',[email]);
}

module.exports = {
    selectAll, selectById, insertUser, deleteById, selectByEmail
}