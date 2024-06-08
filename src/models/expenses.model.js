const insertExpense = ({groups_id, concept, amount, date, max_date, image_url, payer_user_id})=>{
    return db.query('insert into mydb_prueba.expenses (groups_id, concept, amount, date, max_date, image_url, payer_user_id) values (?,?,?,?,?,?,?)',[groups_id, concept, amount, date, max_date, image_url, payer_user_id]);
}

const asignExpense = (users_id, expenses_id, cost, status)=>{
    return db.query('insert into mydb_prueba.expense_assignments (users_id, expenses_id, cost, status) values (?,?,?,?)',[users_id, expenses_id, cost, status]);    
}

const listMembers = (groups_id) => {
    return db.query('SELECT * FROM mydb_prueba.membership where groups_id = ?',[groups_id]);
}

const updateBalance = (users_id, groups_id, balance) =>{
    return db.query('UPDATE mydb_prueba.membership SET balance=? where (users_id =? AND groups_id=?)',[balance, users_id, groups_id]);
}

const getExpenseByConcept = (concept, groups_id) => {
    return db.query('SELECT * FROM mydb_prueba.expenses where concept = ? AND groups_id = ?',[concept, groups_id]);
}

module.exports = {
    insertExpense, asignExpense, listMembers, updateBalance, getExpenseByConcept
}