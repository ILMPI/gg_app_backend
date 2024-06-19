const express = require('express');
const router = express.Router();
const expensesController = require('../../controllers/expenses.controller');
const checkAdmin = require('../../middleware/checkAdmin');

router.get('/group/:groups_id', expensesController.getAllExpensesByGroup);
router.get('/users/:users_id', expensesController.getExpensesByUserID);
router.get('/:expenses_id', expensesController.getExpenseById);
router.get('/usersgroup/:users_id/:groups_id', expensesController.getExpensesByUserGroup)
//router.get('/balance/:users_id/:groups_id', expensesController.getExpenseBalanceByUserGroup);

router.post('/', checkAdmin, expensesController.createExpense);
router.put('/:expense_id',checkAdmin, expensesController.updateExpense);
router.delete('/:expense_id',checkAdmin, expensesController.deleteExpense);

router.post('/payment', expensesController.payExpense);


/**
 * @swagger
 * /api/expenses/balance/{users_id}/{groups_id}:
 *   get:
 *     summary: Get the expense balance of a user in a group
 *     tags: [Balance]
 *     parameters:
 *       - in: path
 *         name: users_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *       - in: path
 *         name: groups_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The group ID
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: The JWT token for authentication
 *     responses:
 *       200:
 *         description: Balance of user on a group
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     cantDebida:
 *                       type: number
 *                     cantPagada:
 *                       type: number
 *                     amountTotal:
 *                       type: number
 *             example:
 *               success: true
 *               message: "Balance of user on a group"
 *               data:
 *                 cantDebida: 50
 *                 cantPagada: 150
 *                 amountTotal: 200
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   nullable: true
 *             example:
 *               success: false
 *               message: "Invalid user ID or group ID"
 *               data: null
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   nullable: true
 *             example:
 *               success: false
 *               message: "Internal Server Error"
 *               data: {
 *                 error: "Error message details here"
 *               }
 */
router.get('/balance/:users_id/:groups_id', expensesController.getExpenseBalanceByUserGroup);


module.exports = router;