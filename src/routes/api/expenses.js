const express = require('express');
const router = express.Router();
const expensesController = require('../../controllers/expenses.controller');
const checkAdmin = require('../../middleware/checkAdmin');

router.get('/group/:groups_id', expensesController.getAllExpensesByGroup);
router.get('/users/:users_id', expensesController.getExpensesByUserID);
/**
 * @swagger
 * /expenses:
 *   post:
 *     summary: Create a new expense
 *     tags: [Expenses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               groups_id:
 *                 type: string
 *               concept:
 *                 type: string
 *               amount:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               max_date:
 *                 type: string
 *                 format: date-time
 *               image_url:
 *                 type: string
 *                 nullable: true
 *               payer_user_id:
 *                 type: string
 *             example:
 *               groups_id: "4"
 *               concept: "Cena en La Trattoria da Luigi"
 *               amount: "300"
 *               date: "2024-06-16 14:00:00"
 *               max_date: "2024-07-05 14:00:00"
 *               image_url: null
 *               payer_user_id: "1"
 *     responses:
 *       201:
 *         description: Expense created successfully
 *       400:
 *         description: Invalid input data
 */
router.post('/', checkAdmin, expensesController.createExpense);

router.put('/:expense_id',checkAdmin, expensesController.updateExpense);
router.delete('/:expense_id',checkAdmin, expensesController.deleteExpense);

module.exports = router;
