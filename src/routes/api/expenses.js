const express = require('express');
const router = express.Router();
const expensesController = require('../../controllers/expenses.controller');
const checkAdmin = require('../../middleware/checkAdmin');

router.get('/group/:groups_id', expensesController.getAllExpensesByGroup);
router.get('/users/:users_id', expensesController.getExpensesByUserID);

router.get('/:expenses_id', expensesController.getExpenseById);
router.get('/usersgroup/:users_id/:groups_id', expensesController.getExpensesByUserGroup)
//router.get('/balance/:users_id/:groups_id', expensesController.getExpenseBalanceByUserGroup);
/**
 * @swagger
 * /api/expenses:
 *   post:
 *     summary: Create an expense
 *     tags: [Expenses]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: Access token for authorization
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               groups_id:
 *                 type: integer
 *                 example: 4
 *                 description: The ID of the group
 *               concept:
 *                 type: string
 *                 example: Taller de Paella
 *                 description: The concept of the expense
 *               amount:
 *                 type: number
 *                 format: float
 *                 example: 800
 *                 description: The amount of the expense
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-06-21 10:00:00"
 *                 description: The date of the expense
 *               max_date:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-07-01 14:00:00"
 *                 description: The deadline to settle the expense
 *               image_url:
 *                 type: string
 *                 format: uri
 *                 nullable: true
 *                 example: null
 *                 description: The URL of the expense image
 *               payer_user_id:
 *                 type: integer
 *                 example: 1
 *                 description: The ID of the user who paid the expense
 *     responses:
 *       201:
 *         description: Expense created and distributed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Expense created and distributed successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 46
 *             example:
 *               success: true
 *               message: Expense created and distributed successfully
 *               data:
 *                 id: 46
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Failed to create expense
 *                 data:
 *                   type: null
 *                   example: null
 *             example:
 *               success: false
 *               message: Failed to create expense
 *               data: null
 */
router.post('/', checkAdmin, expensesController.createExpense);

router.put('/update/:expenses_id',checkAdmin, expensesController.updateExpense);
router.delete('/:expenses_id',checkAdmin, expensesController.deleteExpense);

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