const insertExpense = ({groups_id, concept, amount, date, max_date, image_url, payer_user_id})=>{
    return db.query('insert into expenses (groups_id, concept, amount, date, max_date, image_url, payer_user_id) values (?,?,?,?,?,?,?)',[groups_id, concept, amount, date, max_date, image_url, payer_user_id]);
}

const asignExpense = (users_id, expenses_id, group_id, cost, status)=>{
    return db.query('insert into expense_assignments (users_id, expenses_id, group_id, cost, status) values (?,?,?,?,?)',[users_id, expenses_id, group_id, cost, status]);    
}

const listMembers = (groups_id) => {
    return db.query('SELECT * FROM membership where groups_id = ?',[groups_id]);
}

const updateBalance = (users_id, groups_id, balance) =>{
    return db.query('UPDATE membership SET balance=? where (users_id =? AND groups_id=?)',[balance, users_id, groups_id]);
}

const getExpenseByConcept = (concept, groups_id) => {
    return db.query('SELECT * FROM expenses where concept = ? AND groups_id = ?',[concept, groups_id]);
}

const selectExpensesByGroup = (groups_id) => {
    return db.query('SELECT * FROM expenses where groups_id = ?',[groups_id]);
}

const getExpenseById = (expense_id) => {
    return db.query('Select * FROM expenses where expense_id = ?',[expense_id]);
}

const updateExpenseById = (expense_id, concept, amount, date, max_date, image_url, payer_user_id)=>{
 
    return db.query(`UPDATE expenses 
                    SET  
                    concept = ?, 
                    amount = ?, 
                    date = ?, 
                    max_date = ?, 
                    image_url = ?, 
                    payer_user_id = ? 
                    WHERE expense_id = ?`,
                    [concept, amount, date, max_date, image_url, payer_user_id, expense_id]);
}



const deleteExpenseById = (expense_id) => {
    const result = db.query('DELETE FROM expense_assignments where expenses_id =?', [expense_id]);    
    return db.query('DELETE FROM expenses WHERE expense_id=?',[expense_id]);
}

const getExpensesByUsers = (users_id) => {
    return db.query('SELECT * FROM expense_assignments where users_id =?',[users_id]);
}


const payExpense = (users_id, groups_id, expenses_id, balance) => {
    const result = db.query('UPDATE membership SET balance = ? WHERE users_id = ? AND groups_id = ?', [balance, users_id, groups_id]);
    return db.query(`UPDATE expense_assignments SET status = 'Paid'  WHERE users_id = ? AND expenses_id = ?`,[users_id, expenses_id]);
}

const getBalance = (users_id, groups_id) => {
    const balance = db.query('SELECT balance FROM membership WHERE users_id = ? AND groups_id = ?', [users_id, groups_id]);
    return balance;
}







module.exports = {
    insertExpense, asignExpense, listMembers, updateBalance, getExpenseByConcept, 
    selectExpensesByGroup, getExpenseById, updateExpenseById, deleteExpenseById,
    getExpensesByUsers, payExpense, getBalance
}