const express = require('express');
const router = express.Router();
const expensesController = require('../../controllers/expenses.controller');


// expense routes

router.post('/', expensesController.createExpense);

module.exports = router;