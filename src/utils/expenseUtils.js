const Expense = require('../models/expenses.model');
const Group = require('../models/groups.model');
const { transformGroupData } = require('./groupUtils');


const getTransformedGroup = async (groups_id) => {
    const [groupResult] = await Group.selectById(groups_id);
    if (groupResult.length === 0) {
        throw new Error('Group not found');
    }
    const group = groupResult[0];
    const transformedGroup = await transformGroupData(group);
    return transformedGroup;
};

const getExpenseStatus = async (expense_id) => {
    const [expenseStatusResult] = await Expense.getExpenseOverallStatus(expense_id);
    if (expenseStatusResult.length === 0) {
        throw new Error('Expense status not found');
    }
    return expenseStatusResult[0].overallStatus;
};

const getExpenseParticipants = async (expense_id, amount) => {
    const [expenseParticipantsResult] = await Expense.getExpenseParticipants(expense_id);
    return expenseParticipantsResult.map(participant => ({
        idParticipant: participant.participant_id,
        participantName: participant.participant_name,
        participantImage: participant.participant_image || '',
        percentage: (Number(participant.participant_amount) / Number(amount)),
        amount: Number(participant.participant_amount),
        expenseStatus: participant.participant_expense_status
    }));
};

const constructDetailedExpense = async (expense_id) => {
    const [expenseResult] = await Expense.getExpenseById(expense_id);
    if (expenseResult.length === 0) {
        throw new Error('Expense not found');
    }
    const expense = expenseResult[0];
    const transformedGroup = await getTransformedGroup(expense.groups_id);
    //const expenseParticipants = await getExpenseParticipants(expense_id, expense.amount);
    const expenseStatus = await getExpenseStatus(expense_id);

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
        //participants: expenseParticipants
    };

    return detailedExpense;
};

module.exports = {
    getTransformedGroup,
    getExpenseStatus,
    getExpenseParticipants,
    constructDetailedExpense
};
