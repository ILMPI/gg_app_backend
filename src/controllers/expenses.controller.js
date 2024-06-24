const Expense = require('../models/expenses.model');
const Notification = require('../models/notifications.model');
const notificationController = require('../controllers/notifications.controller')
const User = require('../models/users.model');
const { 
    constructDetailedExpense, 
    getExpenseParticipants
 } = require('../utils/expenseUtils');


const createExpense = async (req, res, next) => {
    try {
        const groups_id = req.body.groups_id;

        // Use payer_user_id if provided, otherwise use paidBy
        const payer_user_id = req.body.payer_user_id ? Number(req.body.payer_user_id) : Number(req.body.paidBy);

        // Use image_url if provided, otherwise use image
        const image_url = req.body.image_url ? req.body.image_url : req.body.image;

        // Use max_date if provided, otherwise use maxDate
        const max_date = req.body.max_date ? req.body.max_date : req.body.maxDate;

        // Use date if provided, otherwise use expenseDate
        const date = req.body.date ? req.body.date : req.body.expenseDate;

        // Meto en array los datos de los miembros del grupo
        const [listMembersGroup] = await Expense.listMembers(groups_id);

        // Inserto el gasto en la tabla de gastos
        const expenseData = {
            ...req.body,
            payer_user_id,
            image_url,
            max_date,
            date
        };
        const [result] = await Expense.insertExpense(expenseData);

        if (!result) {
            throw new Error('Failed to insert expense');
        }

        const [expense] = await Expense.getExpenseByConcept(req.body.concept, groups_id);
        const expenses_id = expense[0].expense_id;
        const expense_name = expense[0].concept;

        // reparto guarda el gasto repartido entre los usuarios
        const reparto = Number(req.body.amount) / listMembersGroup.length;

        // Asigno el gasto a cada miembro del grupo, hago una query para actualizarlo en la lista de membership
        for (let id = 0; id < listMembersGroup.length; id++) {
            if (payer_user_id === listMembersGroup[id].users_id) {
                // Es el usuario que ha pagado el ticket
                const [assingn1] = await Expense.asignExpense(listMembersGroup[id].users_id, expenses_id, groups_id, reparto, 'Paid');
                const resultado = Number(req.body.amount) - reparto;
                // A su balance hay que añadir resultado, en positivo, por pagarlo
                const balance = Number(listMembersGroup[id].balance) + resultado;
                // Hacer update en balance de tabla membership
                const [updateBal1] = await Expense.updateBalance(listMembersGroup[id].users_id, groups_id, balance);

                // // Notificacion correspondiente al pagador
                await notificationController.sendPayerExpenseNotification(payer_user_id, expense_name, reparto, expenses_id, groups_id);
                //console.log('Notification created for payer');

            } else {
                // Es usuario que no ha pagado el ticket
                const [assgign2] = await Expense.asignExpense(listMembersGroup[id].users_id, expenses_id, groups_id, reparto, 'Reported');
                // A su balance hay que añadir en negativo reparto
                const balance = Number(listMembersGroup[id].balance) - reparto;
                const [updateBal2] = await Expense.updateBalance(listMembersGroup[id].users_id, groups_id, balance);
                // // Notificacion correspondiente
                await notificationController.sendMemberExpenseNotification(listMembersGroup[id].users_id, expense_name, reparto, expenses_id, groups_id);
                //console.log('Notification created for member');
             }
        }

        res.status(201).json({
            success: true,
            message: 'Expense created and distributed successfully',
            data: {"id": result.insertId}
        });
    } catch (err) {
        if (!res.headersSent) {
            console.error('Error creating expense:', err);
            res.status(500).json({
                success: false,
                message: 'Failed to create expense',
                data: null
            });
        }
        next(err);
    }
};
const getAllExpensesByGroup = async (req, res, next) => {
    try {
        const userId = req.userId;
        const groupId = req.params.groups_id;
        console.log(groupId, userId);

        const [expensesResult] = await Expense.getOnlyExpensesByGroup(groupId, userId);

        if (expensesResult.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No expenses found for this group',
                data: []
            });
        }

        const detailedExpenses = await Promise.all(expensesResult.map(async (expense) => {
            const result = await constructDetailedExpense(expense.id);
            return {
                ...expense,
                group: result.group,
                expenseStatus: result.expenseStatus
            };
        }));

        console.log(detailedExpenses);

        res.status(200).json({
            success: true,
            message: 'Expenses retrieved successfully',
            data: detailedExpenses
        });
    } catch (err) {
        next(err);
    }
};
const updateExpense = async (req, res, next) => {
    try {
        const expense_id = req.params.expenses_id;
        const [expenseAnterior] = await Expense.getExpenseById(expense_id);

        const amountAnterior = Number(expenseAnterior[0].amount);
        const payer_user_idAnterior = expenseAnterior[0].payer_user_id;
        const amountNum = Number(req.body.amount);

        // Use payer_user_id if provided, otherwise use paidBy
        const payer_user_id = req.body.payer_user_id ? Number(req.body.payer_user_id) : Number(req.body.paidBy);

        // Use image_url if provided, otherwise use image
        const image_url = req.body.image_url ? req.body.image_url : req.body.image;

        // Use max_date if provided, otherwise use maxDate
        const max_date = req.body.max_date ? req.body.max_date : req.body.maxDate;

        // Use date if provided, otherwise use expenseDate
        const date = req.body.date ? req.body.date : req.body.expenseDate;

        // Comprobar si el update es porque el coste del gasto es igual o distinto
        if ((amountNum === amountAnterior) && (payer_user_id === payer_user_idAnterior)) {
            // Es igual, se actualiza sin repercutir en balances ni asignamientos
            const [resultado] = await Expense.updateExpenseById(expense_id, req.body.concept, req.body.amount, date, max_date, image_url, payer_user_id);
            res.status(200).json({
                success: true,
                message: 'Expense updated successfully without changing balances',
                data: null
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Update not allowed: cost or payer changed',
                data: null
            });
        }
    } catch (err) {
        if (!res.headersSent) {
            res.status(500).json({
                success: false,
                message: 'Failed to update expense',
                data: null
            });
        }
        next(err);
    }
};

const deleteExpense = async (req, res, next) => {
    try {
        const expense_id = req.params.expenses_id;
        const [expense] = await Expense.getExpenseById(expense_id);

        if (!expense || expense.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Expense not found',
                data: null
            });
        }

        const groups_id = expense[0].groups_id;
        const amount = Number(expense[0].amount);
        const payer_user_id = expense[0].payer_user_id;
        const [listMembersGroup] = await Expense.listMembers(groups_id);
        const reparto = amount / listMembersGroup.length;

        console.log(`Expense amount: ${amount}, Payer user ID: ${payer_user_id}, Reparto: ${reparto}`);

        // Balancear al reves
        for (let id = 0; id < listMembersGroup.length; id++) {
            const member = listMembersGroup[id];
            let balance;

            if (Number(payer_user_id) === member.users_id) {
                // Es el usuario que habia pagado el ticket
                const resultado = amount - reparto;
                // A su balance hay que restar resultado, para balanceo al reves
                balance = Number(member.balance) - resultado;
                console.log(`Updating balance for payer user ID ${member.users_id}: new balance ${balance}`);
            } else {
                // Es usuario que no ha pagado el ticket, a su balance hay que sumar reparto
                balance = Number(member.balance) + reparto;
                console.log(`Updating balance for non-payer user ID ${member.users_id}: new balance ${balance}`);
            }

            const [result2] = await Expense.updateBalance(member.users_id, groups_id, balance);
            console.log(`Update result for user ID ${member.users_id}: ${JSON.stringify(result2)}`);
        }

        const [result] = await Expense.deleteExpenseById(expense_id);
        console.log(`Expense deletion result: ${JSON.stringify(result)}`);

        res.status(200).json({
            success: true,
            message: 'Expense deleted and balances updated successfully',
            data: null
        });
    } catch (err) {
        if (!res.headersSent) {
            res.status(500).json({
                success: false,
                message: 'Failed to delete expense',
                data: null
            });
        }
        next(err);
    }
};


const getExpensesByUserID = async (req, res, next) => {
    try {
        const userId = req.params.users_id;
        const [expensesResult] = await Expense.getOnlyExpensesByUser(userId);

        if (expensesResult.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No expenses found for this user',
                data: []
            });
        }

        const detailedExpenses = await Promise.all(expensesResult.map(async (expense) => {
            const result = await constructDetailedExpense(expense.id);
            return {
                ...expense,
                group: result.group,
                expenseStatus: result.expenseStatus
            };
        }));

        console.log(detailedExpenses);

        res.status(200).json({
            success: true,
            message: 'Expenses retrieved successfully',
            data: detailedExpenses
        });
    } catch (err) {
        next(err);
    }
};

const getExpensesByUserGroup = async (req, res, next) => {
    // devuelve los gastos asignados a un usuario en un grupo, los campos a visualizar en el front
    // concepto, usuario_id, group_id, amount, cost, status 
    try {
        const [result] = await Expense.getExpensesByUserGroup(req.params.users_id, req.params.groups_id);
        res.status(200).json({
            success: true,
            message: 'Expenses retrieved successfully',
            data: result
        });
        

    } catch (err) {
        if (!res.headersSent) {
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve expenses',
                data: null
            });
        }
        next(err);
    }
}

const getExpenseBalanceByUserGroup = async (req, res, next) => {
    // devuelve los datos para poder representar el balance que tiene en un grupo
    // la suma de los gastos que debe y la suma de los gastos que ha pagado, frente al total de los gastos del grupo
    
    try{
        const [expenses] = await Expense.getExpensesByUserGroup(req.params.users_id, req.params.groups_id);
        let cantDebida=0;
        let cantPagada=0;
    
        for (let id = 0; id < expenses.length; id++) {
            if (expenses[id].status ==='Paid'){
                cantPagada = cantPagada + Number(expenses[id].cost);
            }else{
                cantDebida = cantDebida + Number(expenses[id].cost);
            }
        }
        const amountTotal = cantDebida + cantPagada;
        console.log(cantDebida, cantPagada, amountTotal);
        
        
        return res.json({
            success: true,
            message: 'Balance of user on a group',
            data: {
                cantDebida : cantDebida,
                cantPagada : cantPagada,
                amountTotal : amountTotal 
            }
            
        });
    
    }catch(err){
        next(err);
    }

}

const getExpenseById = async (req, res, next) => {
    try {
        const expense_id = req.params.expenses_id;
        console.log(`Fetching details for expense_id: ${expense_id}`);

        //constructor
        const detailedExpense = await constructDetailedExpense(expense_id);

        // Fetch and add expense participants
        const expenseParticipants = await getExpenseParticipants(expense_id, detailedExpense.amount);
        detailedExpense.participants = expenseParticipants;

        res.status(200).json({
            success: true,
            message: 'Expense retrieved successfully',
            data: detailedExpense
        });
    } catch (err) {
        next(err);
    }
};

const payExpense = async (req, res, next) => {
    try {
        const { users_id, expenses_id, groups_id, cost, status } = req.body;

        const [response] = await Expense.getBalance(users_id, groups_id);
        const balanceAnterior = Number(response[0].balance);
        
        if (status === 'Paid') {
            const [result] = [];
            return res.status(200).json({
                success: true,
                message: 'Expense already paid',
                data: result
            });
        }

        // El deudor paga y se queda el balance en cero
        const balance = balanceAnterior + Number(cost);
        const [result] = await Expense.payExpense(users_id, groups_id, expenses_id, balance);

        // Fetch expense details
        const [expense] = await Expense.getExpenseById(expenses_id);
        const expenseName = expense[0].concept;


        // Fetch payer details
        const payer_user_id = expense[0].payer_user_id;
        const [payer] = await User.selectById(payer_user_id);
        const payerName = payer[0].name;

        // Update payer's balance
        const [response2] = await Expense.getBalance(payer_user_id, groups_id);
        const balancePayerAnterior = Number(response2[0].balance);
        const balancePayer = balancePayerAnterior - Number(cost);
        await Expense.updateBalance(payer_user_id, groups_id, balancePayer);

      
        // Fetch the list of members of the group
        const [listMembersGroup] = await Expense.listMembers(groups_id);

        // Notify members who are not the payer
        for (const member of listMembersGroup) {
            if (member.users_id !== payer_user_id) {
                await notificationController.notifyPaymentMade(member.users_id, expenseName, cost, expenses_id, groups_id);
            }
        }

        // Initialize the first non-payer user name
        let firstNonPayerName = null;

        // Get the first non-payer user's name outside the loop
        for (const member of listMembersGroup) {
            if (member.users_id !== payer_user_id) {
                const [nonPayer] = await User.selectById(member.users_id);
                firstNonPayerName = nonPayer[0].name;
                break;
            }
        }
                // Notify the payer with the name of the first non-payer user
                await notificationController.notifyPaymentReceived(payer_user_id, expenseName, payerName, firstNonPayerName, cost, expenses_id, groups_id);


        res.status(200).json({
            success: true,
            message: 'Expense assignment paid successfully',
            data: result
        });

    } catch (err) {
        next(err);
    }
};

module.exports = payExpense;


module.exports = {
    createExpense,
    getAllExpensesByGroup,
    updateExpense,
    deleteExpense,
    getExpensesByUserID,
    getExpensesByUserGroup,
    getExpenseBalanceByUserGroup,
    getExpenseById,
    payExpense
}