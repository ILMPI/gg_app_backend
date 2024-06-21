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

const getExpensesByUserGroup = (users_id, groups_id) => {
    return db.query('SELECT expe.concept, expa.users_id, expa.group_id, expe.amount, expa.cost, expa.status FROM expense_assignments expa inner join expenses expe ON expa.expenses_id = expe.expense_id WHERE expa.users_id= ? and expa.group_id= ?',[users_id, groups_id]);
}

const getExpenseById = (expense_id) => {
    return db.query('Select * FROM expenses where expense_id = ?',[expense_id]);
}

const getAmountTotalGroup = (groups_id) => {
    return db.query('select SUM(amount) as amountTotal from expenses where groups_id=?',[groups_id]);
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

const updateExpenseFields = (expenseId, { concept, expenseDate, maxDate }) => {
    return db.query(`
        UPDATE expenses 
        SET  
            concept = COALESCE(?, concept), 
            date = COALESCE(?, date), 
            max_date = COALESCE(?, max_date)
        WHERE 
            expense_id = ?
    `, [concept, expenseDate, maxDate, expenseId]);
};

const deleteExpenseById = (expense_id) => {
    const result = db.query('DELETE FROM expense_assignments where expenses_id =?', [expense_id]);    
    return db.query('DELETE FROM expenses WHERE expense_id=?',[expense_id]);
}

const getExpensesByUsers = (users_id) => {
    return db.query('SELECT * FROM expense_assignments where users_id =?',[users_id]);
}

const getOnlyExpensesByUser = (users_id) => {
    return db.query(`SELECT 
            e.expense_id AS id,
            e.groups_id AS group_id,
            e.concept,
            e.amount,
            e.payer_user_id AS paidBy,
            e.created_on AS createdBy,
            e.date AS expenseDate,
            e.max_date AS maxDate,
            e.image_url AS image,
            ea.cost AS myAmount,
            ea.status AS myStatus
        FROM 
            expenses e
        JOIN 
            expense_assignments ea ON e.expense_id = ea.expenses_id
        WHERE 
            ea.users_id = ?;`,[users_id]);
}
 const getOnlyExpensesByGroup = (groups_id) => {
    return db.query(`   SELECT 
                e.expense_id AS id,
                e.groups_id AS group_id,
                e.concept,
                e.amount,
                e.payer_user_id AS paidBy,
                e.created_on AS createdBy,
                e.date AS expenseDate,
                e.max_date AS maxDate,
                e.image_url AS image,
                ea.cost AS myAmount,
                ea.status AS myStatus
            FROM 
                expenses e
            LEFT JOIN 
                expense_assignments ea ON e.expense_id = ea.expenses_id
            WHERE 
                e.groups_id = ?`, [groups_id]);
 }

const payExpense = (users_id, groups_id, expenses_id, balance) => {
    const result = db.query('UPDATE membership SET balance = ? WHERE users_id = ? AND groups_id = ?', [balance, users_id, groups_id]);
    return db.query(`UPDATE expense_assignments SET status = 'Paid'  WHERE users_id = ? AND expenses_id = ?`,[users_id, expenses_id]);
}

const getBalance = (users_id, groups_id) => {
    const balance = db.query('SELECT balance FROM membership WHERE users_id = ? AND groups_id = ?', [users_id, groups_id]);
    return balance;
}
//ea = expense_assignment
const getExpenseParticipants = (expense_id) => {
    return db.query( `
     SELECT 
            ea.users_id AS participant_id,
            u.name AS participant_name,
            ea.cost AS participant_amount,
            ea.status AS participant_expense_status
        FROM 
            expense_assignments ea
        JOIN 
            users u ON ea.users_id = u.id
        WHERE 
            ea.expenses_id = ?
            `, [expense_id])
}

const getExpenseStatuses = async (expenseId) => {
    const results = await db.query(`
        SELECT 
            ea.status AS expenseStatus
        FROM 
            expense_assignments ea
        WHERE 
            ea.expenses_id = ?
    `, [expenseId]);
    
    return results;
};

const getExpenseOverallStatus = async (expenseId) => {
    return db.query(`
        SELECT 
            CASE 
                WHEN COUNT(CASE WHEN ea.status != 'Paid' THEN 1 END) > 0 THEN 'Reported'
                ELSE 'Paid'
            END AS overallStatus
        FROM 
            expense_assignments ea
        WHERE 
            ea.expenses_id = ?
    `, [expenseId]);
};





module.exports = {
    insertExpense, asignExpense, listMembers, updateBalance, getExpenseByConcept, 
    selectExpensesByGroup, getExpenseById, updateExpenseById, deleteExpenseById,
    getExpensesByUsers, getExpensesByUserGroup, payExpense, getBalance,
    getAmountTotalGroup, getExpenseParticipants, getExpenseStatuses, getExpenseOverallStatus,
    getOnlyExpensesByUser,getOnlyExpensesByGroup, updateExpenseFields
}