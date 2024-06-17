const express = require('express');
const router = express.Router();
const expensesController = require('../../controllers/expenses.controller');
const checkAdmin = require('../../middleware/checkAdmin');

router.get('/group/:groups_id', expensesController.getAllExpensesByGroup);
router.get('/users/:users_id', expensesController.getExpensesByUserID);
router.get('/:expenses_id', expensesController.getExpenseById);

router.post('/', checkAdmin, expensesController.createExpense);
router.put('/:expense_id',checkAdmin, expensesController.updateExpense);
router.delete('/:expense_id',checkAdmin, expensesController.deleteExpense);

router.post('/payment', expensesController.payExpense);

module.exports = router;
