const Expense = require('../models/expenses.model');

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

        // reparto guarda el gasto repartido entre los usuarios
        const reparto = Number(req.body.amount) / listMembersGroup.length;

        // Asigno el gasto a cada miembro del grupo, hago una query para actualizarlo en la lista de membership
        for (let id = 0; id < listMembersGroup.length; id++) {
            if (Number(req.body.payer_user_id) === listMembersGroup[id].users_id) {
                // Es el usuario que ha pagado el ticket
                const [result2] = await Expense.asignExpense(listMembersGroup[id].users_id, expenses_id, reparto, 'Paid');
                const resultado = Number(req.body.amount) - reparto;
                // A su balance hay que añadir resultado, en positivo, por pagarlo
                const balance = Number(listMembersGroup[id].balance) + resultado;
                // Hacer update en balance de tabla membership
                const [result3] = await Expense.updateBalance(listMembersGroup[id].users_id, groups_id, balance);
            } else {
                // Es usuario que no ha pagado el ticket
                const [result2] = await Expense.asignExpense(listMembersGroup[id].users_id, expenses_id, reparto, 'Reported');
                // A su balance hay que añadir en negativo reparto
                const balance = Number(listMembersGroup[id].balance) - reparto;
                const [result3] = await Expense.updateBalance(listMembersGroup[id].users_id, groups_id, balance);
            }
        }

        res.status(201).json({
            success: true,
            message: 'Expense created and distributed successfully',
            data: result
        });
    } catch (err) {
        console.error('Error creating expense:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to create expense',
            data: null
        });
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
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve expenses',
            data: null
        });
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
        res.status(500).json({
            success: false,
            message: 'Failed to update expense',
            data: null
        });
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
        res.status(500).json({
            success: false,
            message: 'Failed to delete expense',
            data: null
        });
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
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve expenses',
            data: null
        });
        next(err);
    }
}

module.exports = {
    createExpense,
    getAllExpensesByGroup,
    updateExpense,
    deleteExpense,
    getExpensesByUserID
}
