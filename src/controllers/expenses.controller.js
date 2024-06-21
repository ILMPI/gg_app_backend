const Expense = require('../models/expenses.model');
const Notification = require('../models/notifications.model');
const notificationController = require('../controllers/notifications.controller')
const User = require('../models/users.model');
const Group = require('../models/groups.model');
const { transformGroupData } = require('../utils/groupUtils');




const createExpense = async (req, res, next) => {
    try {
        const groups_id = req.body.groups_id;

        // Meto en array los datos de los miembros del grupo
        const [listMembersGroup] = await Expense.listMembers(groups_id);
        
        // Inserto el gasto en la tabla de gastos
        const [result] = await Expense.insertExpense(req.body);

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
            
            if (Number(req.body.payer_user_id) === listMembersGroup[id].users_id) {
                // Es el usuario que ha pagado el ticket
                const [assingn1] = await Expense.asignExpense(listMembersGroup[id].users_id, expenses_id, groups_id, reparto, 'Paid');
                const resultado = Number(req.body.amount) - reparto;
                // A su balance hay que añadir resultado, en positivo, por pagarlo
                const balance = Number(listMembersGroup[id].balance) + resultado;
                // Hacer update en balance de tabla membership
                const [updateBal1] = await Expense.updateBalance(listMembersGroup[id].users_id, groups_id, balance);

                // // Notificacion correspondiente al pagador
                //await notificationController.sendPayerExpenseNotification(member.users_id, expense_name, reparto, expenses_id);
                //console.log('Notification created for payer');
                // const title = 'Se ha asignado tu parte del gasto';
                // const description = `Del gasto: ${expense_name}, has pagado la totalidad, pero al participar, se descuenta tu parte correspondiente, que son: ${reparto}€`;
                // const currentDate = Dayjs().format('YYYY-MM-DD HH:mm');
                // await Notification.insertNotification(listMembersGroup[id].users_id, 'Unread', currentDate, title, description);
                
            } else {

                // Es usuario que no ha pagado el ticket
                const [assgign2] = await Expense.asignExpense(listMembersGroup[id].users_id, expenses_id, groups_id, reparto, 'Reported');
                // A su balance hay que añadir en negativo reparto
                const balance = Number(listMembersGroup[id].balance) - reparto;
                const [updateBal2] = await Expense.updateBalance(listMembersGroup[id].users_id, groups_id, balance);
                // // Notificacion correspondiente
                //await notificationController.sendMemberExpenseNotification(member.users_id, expense_name, reparto, expenses_id);
                //console.log('Notification created for member');
                // const title = 'Se ha asignado tu parte del gasto';
                // const description = `Del gasto: ${expense_name}, te corresponde pagar ${reparto}€. No te demores en hacerlo`;
                // const currentDate = Dayjs().format('YYYY-MM-DD HH:mm');
                // await Notification.insertNotification(listMembersGroup[id].users_id, 'Unread', currentDate, title, description);
                
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
}

const getAllExpensesByGroup = async (req, res, next) => {
    try {
        const [result] = await Expense.selectExpensesByGroup(req.params.groups_id);
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

const updateExpense = async (req, res, next) => {
    try {
        const expense_id = req.params.expense_id;
        const [expenseAnterior] = await Expense.getExpenseById(expense_id);

        const amountAnterior = Number(expenseAnterior[0].amount);
        const payer_user_idAnterior = expenseAnterior[0].payer_user_id;
        const amountNum = Number(req.body.amount);

        // Comprobar si el update es porque el coste del gasto es igual o distinto
        if ((amountNum === amountAnterior) && (Number(req.body.payer_user_id) === payer_user_idAnterior)) {
            // Es igual, se actualiza sin repercutir en balances ni asignamientos
            const [resultado] = await Expense.updateExpenseById(expense_id, req.body.concept, req.body.amount, req.body.date, req.body.max_date, req.body.image_url, req.body.payer_user_id);
            res.status(200).json({
                success: true,
                message: 'Expense updated successfully without changing balances',
                data: resultado
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
}

const deleteExpense = async (req, res, next) => {
    try {
        const expense_id = req.params.expense_id;
        const [expense] = await Expense.getExpenseById(expense_id);
        const groups_id = expense[0].groups_id;
        const amount = Number(expense[0].amount);
        const payer_user_id = expense[0].payer_user_id;
        const [listMembersGroup] = await Expense.listMembers(groups_id);
        const reparto = amount / listMembersGroup.length;

        // Balancear al reves
        for (let id = 0; id < listMembersGroup.length; id++) {
            if (Number(payer_user_id) === listMembersGroup[id].users_id) {
                // Es el usuario que habia pagado el ticket
                const resultado = amount - reparto;
                // A su balance hay que restar resultado, para balanceo al reves
                const balance = Number(listMembersGroup[id].balance) - resultado;
                const [result2] = await Expense.updateBalance(listMembersGroup[id].users_id, groups_id, balance);
            } else {
                // Es usuario que no ha pagado el ticket, a su balance hay que sumar reparto
                const balance = Number(listMembersGroup[id].balance) + reparto;
                const [result2] = await Expense.updateBalance(listMembersGroup[id].users_id, groups_id, balance);
            }
        }

        const [result] = await Expense.deleteExpenseById(expense_id);
        res.status(200).json({
            success: true,
            message: 'Expense deleted and balances updated successfully',
            data: result
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
}

const getExpensesByUserID = async (req, res, next) => {
    try {
        const [result] = await Expense.getExpensesByUsers(req.params.users_id);
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

        //expense
        const [expenseResult] = await Expense.getExpenseById(expense_id);
        console.log(`Expense details fetched: ${JSON.stringify(expenseResult)}`);

        if (expenseResult.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Expense not found',
                data: []
            });
        }

        const expense = expenseResult[0];

        //group
        const [groupResult] = await Group.selectById(expense.groups_id);
        console.log(`Group details fetched: ${JSON.stringify(groupResult)}`);

        if (groupResult.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Group not found',
                data: []
            });
        }

        const group = groupResult[0];

        //group with participants
        const transformedGroup = await transformGroupData(group);

        //expense participants
        const [expenseParticipantsResult] = await Expense.getExpenseParticipants(expense_id);
        console.log(`Expense participants fetched: ${JSON.stringify(expenseParticipantsResult)}`);

        const expenseParticipants = expenseParticipantsResult.map(participant => ({
            idParticipant: participant.participant_id,
            participantName: participant.participant_name,
            participantImage: participant.participant_image || '', 
            percentage: (Number(participant.participant_amount) / Number(expense.amount)),
            amount: Number(participant.participant_amount),
            expenseStatus: participant.participant_expense_status
        }));

//expense overall status
const [expenseStatusResult] = await Expense.getExpenseOverallStatus(expense_id);
        const expenseStatus = expenseStatusResult[0].overallStatus;
console.log(`Expense overall status retrieved: ${expenseStatus}`);

        //response contructor
        const detailedExpense = {
            id: expense.expense_id,
            group: transformedGroup,
            concept: expense.concept,
            amount: Number(expense.amount),
            paidBy: expense.payer_user_id,
            createdOn: new Date(expense.created_on),
            expenseDate: new Date(expense.date),
            maxDate: new Date(expense.max_date),
            image: expense.image_url,
            expenseStatus: expenseStatus,
            participants: expenseParticipants
        };

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
        
        if (status==='Paid'){
            const [result] = [];
            res.status(200).json({
                success: true,
                message: 'Expense already payed',
                data: result
            });
        }

        // El deudor paga y se queda el balance en cero
        const balance = balanceAnterior + Number(cost);
        const [result] = await Expense.payExpense(users_id, groups_id, expenses_id, balance);
        // Notificar al deudor que ha pagado
        const [expense] = await Expense.getExpenseById(expenses_id);
        const expenseName = expense[0].concept;
        var title = 'Has pagado tu parte de un gasto';
        var description = `Del gasto: ${expenseName}, has pagado tu parte correspondiente: ${cost}€`;
        var currentDate = Dayjs().format('YYYY-MM-DD HH:mm');
        await Notification.insertNotification(users_id, 'Unread', currentDate, title, description);

        // El pagador del gasto cobra la parte correspondiente del deudor
        const payer_user_id = expense[0].payer_user_id;
        const [payer] = await User.selectById(payer_user_id);
        const payerName = payer[0].name;
        const [response2] = await Expense.getBalance(payer_user_id, groups_id);
        const balancePayerAnterior = Number(response2[0].balance);
        const balancePayer = balancePayerAnterior - Number(cost);
        await Expense.updateBalance(payer_user_id, groups_id, balancePayer);
        // Notificar al pagador inicial del gasto total, que el usuario le ha pagado su parte al gasto referido
        title = 'Has cobrado una parte de un gasto';
        description = `Del gasto: ${expenseName}, has cobrado de ${payerName}, la parte que le correspondia: ${cost}€`;
        currentDate = Dayjs().format('YYYY-MM-DD HH:mm');
        await Notification.insertNotification(payer_user_id, 'Unread', currentDate, title, description);

        
        

        res.status(200).json({
            success: true,
            message: 'Expense assignment payed successfully',
            data: result
        });

    }catch (err) {
        next(err);
    }
}

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