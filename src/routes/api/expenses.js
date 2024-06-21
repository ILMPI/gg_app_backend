const express = require('express');
const router = express.Router();
const expensesController = require('../../controllers/expenses.controller');
const checkAdmin = require('../../middleware/checkAdmin');

/**
 * @swagger
 * /api/expenses/{expenses_id}:
 *   get:
 *     summary: Get Expense Data by expense_id
 *     tags: [Expenses]
 *     parameters:
 *       - in: path
 *         name: expenses_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the expense
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: Access token for authorization
 *     responses:
 *       200:
 *         description: Expense retrieved successfully.
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
 *                   example: Expense retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     group:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 4
 *                         name:
 *                           type: string
 *                           example: Amantes de la administración
 *                         description:
 *                           type: string
 *                           example: Para todos los que les gusta administrar todo lo que está vivo y lo que no está realmente vivo.
 *                         createdBy:
 *                           type: integer
 *                           example: 7
 *                         image:
 *                           type: string
 *                           nullable: true
 *                           example: null
 *                         createdOn:
 *                           type: string
 *                           format: date-time
 *                           example: 2024-06-16T21:16:11.000Z
 *                         participants:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                                 example: 1
 *                               name:
 *                                 type: string
 *                                 example: Juan Pérez
 *                               email:
 *                                 type: string
 *                                 example: juan.perez@gmail.com
 *                               image:
 *                                 type: string
 *                                 example: https://picsum.photos/id/237/200
 *                               status:
 *                                 type: string
 *                                 example: Joined
 *                     concept:
 *                       type: string
 *                       example: Cena en La Trattoria da Luigi
 *                     amount:
 *                       type: number
 *                       format: float
 *                       example: 300
 *                     paidBy:
 *                       type: integer
 *                       example: 1
 *                     createdOn:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-06-16T21:45:45.000Z
 *                     expenseDate:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-06-16T12:00:00.000Z
 *                     maxDate:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-07-05T12:00:00.000Z
 *                     image:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *                     expenseStatus:
 *                       type: string
 *                       example: Reported
 *                     participants:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           idParticipant:
 *                             type: integer
 *                             example: 1
 *                           participantName:
 *                             type: string
 *                             example: Juan Pérez
 *                           participantImage:
 *                             type: string
 *                             example: https://picsum.photos/id/237/200
 *                           percentage:
 *                             type: number
 *                             format: float
 *                             example: 0.14285714285714285
 *                           amount:
 *                             type: number
 *                             format: float
 *                             example: 42.857142857142854
 *                           expenseStatus:
 *                             type: string
 *                             example: Paid
 *             example:
 *               success: true
 *               message: Expense retrieved successfully
 *               data:
 *                 id: 1
 *                 group:
 *                   id: 4
 *                   name: Amantes de la administración
 *                   description: Para todos los que les gusta administrar todo lo que está vivo y lo que no está realmente vivo.
 *                   createdBy: 7
 *                   image: null
 *                   createdOn: 2024-06-16T21:16:11.000Z
 *                   participants:
 *                     - id: 1
 *                       name: Juan Pérez
 *                       email: juan.perez@gmail.com
 *                       image: https://picsum.photos/id/237/200
 *                       status: Joined
 *                     - id: 2
 *                       name: María López
 *                       email: maria.lopez@example.com
 *                       image: https://picsum.photos/seed/picsum/200
 *                       status: Joined
 *                     - id: 3
 *                       name: Carlos García
 *                       email: carlos.garcia@yahoo.com
 *                       image: null
 *                       status: Joined
 *                     - id: 4
 *                       name: Ana Fernández
 *                       email: ana.fernandez@example.com
 *                       image: null
 *                       status: Joined
 *                     - id: 5
 *                       name: Luis Martínez
 *                       email: luis.martinez@gmail.com
 *                       image: null
 *                       status: Joined
 *                     - id: 6
 *                       name: Marina Garcia
 *                       email: marina.garcia@gmail.com
 *                       image: null
 *                       status: Joined
 *                     - id: 7
 *                       name: Admin
 *                       email: admin@gmail.com
 *                       image: https://picsum.photos/id/8/200
 *                       status: Joined
 *                 concept: Cena en La Trattoria da Luigi
 *                 amount: 300
 *                 paidBy: 1
 *                 createdOn: 2024-06-16T21:45:45.000Z
 *                 expenseDate: 2024-06-16T12:00:00.000Z
 *                 maxDate: 2024-07-05T12:00:00.000Z
 *                 image: null
 *                 expenseStatus: Reported
 *                 participants:
 *                   - idParticipant: 1
 *                     participantName: Juan Pérez
 *                     participantImage: ""
 *                     percentage: 0.14285714285714285
 *                     amount: 42.857142857142854
 *                     expenseStatus: Paid
 *                   - idParticipant: 2
 *                     participantName: María López
 *                     participantImage: ""
 *                     percentage: 0.14285714285714285
 *                     amount: 42.857142857142854
 *                     expenseStatus: Reported
 *                   - idParticipant: 3
 *                     participantName: Carlos García
 *                     participantImage: ""
 *                     percentage: 0.14285714285714285
 *                     amount: 42.857142857142854
 *                     expenseStatus: Reported
 *                   - idParticipant: 4
 *                     participantName: Ana Fernández
 *                     participantImage: ""
 *                     percentage: 0.14285714285714285
 *                     amount: 42.857142857142854
 *                     expenseStatus: Reported
 *                   - idParticipant: 5
 *                     participantName: Luis Martínez
 *                     participantImage: ""
 *                     percentage: 0.14285714285714285
 *                     amount: 42.857142857142854
 *                     expenseStatus: Reported
 *                   - idParticipant: 6
 *                     participantName: Marina Garcia
 *                     participantImage: ""
 *                     percentage: 0.14285714285714285
 *                     amount: 42.857142857142854
 *                     expenseStatus: Reported
 *                   - idParticipant: 7
 *                     participantName: Admin
 *                     participantImage: ""
 *                     percentage: 0.14285714285714285
 *                     amount: 42.857142857142854
 *                     expenseStatus: Reported
 *       404:
 *         description: Expense or group not found.
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
 *                   example: Expense not found
 *                 data:
 *                   type: array
 *                   example: []
 *             examples:
 *               expense-not-found:
 *                 value:
 *                   success: false
 *                   message: Expense not found
 *                   data: []
 *               group-not-found:
 *                 value:
 *                   success: false
 *                   message: Group not found
 *                   data: []
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
 *                   example: An error occurred while processing your request.
 *                 data:
 *                   type: null
 *                   example: null
 *             example:
 *               success: false
 *               message: An error occurred while processing your request
 *               data: null
 */
router.get('/:expenses_id', expensesController.getExpenseById);
/**
 * @swagger
 * /api/expenses/users/{users_id}:
 *   get:
 *     summary: Get All Expenses by User ID
 *     tags: [Expenses]
 *     parameters:
 *       - in: path
 *         name: users_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: Access token for authorization
 *     responses:
 *       200:
 *         description: Expenses retrieved successfully.
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
 *                   example: Expenses retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       group_id:
 *                         type: integer
 *                         example: 4
 *                       concept:
 *                         type: string
 *                         example: Cena en La Trattoria da Luigi
 *                       amount:
 *                         type: string
 *                         example: "300.00"
 *                       paidBy:
 *                         type: integer
 *                         example: 1
 *                       createdBy:
 *                         type: string
 *                         format: date-time
 *                         example: 2024-06-16T21:45:45.000Z
 *                       expenseDate:
 *                         type: string
 *                         format: date-time
 *                         example: 2024-06-16T12:00:00.000Z
 *                       maxDate:
 *                         type: string
 *                         format: date-time
 *                         example: 2024-07-05T12:00:00.000Z
 *                       image:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       myAmount:
 *                         type: string
 *                         example: "42.857142857142854"
 *                       myStatus:
 *                         type: string
 *                         example: Reported
 *                       group:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 4
 *                           name:
 *                             type: string
 *                             example: Amantes de la administración
 *                           description:
 *                             type: string
 *                             example: Para todos los que les gusta administrar todo lo que está vivo y lo que no está realmente vivo.
 *                           createdBy:
 *                             type: integer
 *                             example: 7
 *                           image:
 *                             type: string
 *                             nullable: true
 *                             example: null
 *                           createdOn:
 *                             type: string
 *                             format: date-time
 *                             example: 2024-06-16T21:16:11.000Z
 *                           participants:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 id:
 *                                   type: integer
 *                                   example: 1
 *                                 name:
 *                                   type: string
 *                                   example: Juan Pérez
 *                                 email:
 *                                   type: string
 *                                   example: juan.perez@gmail.com
 *                                 image:
 *                                   type: string
 *                                   nullable: true
 *                                   example: null
 *                                 status:
 *                                   type: string
 *                                   example: Joined
 *                       expenseStatus:
 *                         type: string
 *                         example: Reported
 *             example:
 *               success: true
 *               message: Expenses retrieved successfully
 *               data:
 *                 - id: 1
 *                   group_id: 4
 *                   concept: Cena en La Trattoria da Luigi
 *                   amount: "300.00"
 *                   paidBy: 1
 *                   createdBy: 2024-06-16T21:45:45.000Z
 *                   expenseDate: 2024-06-16T12:00:00.000Z
 *                   maxDate: 2024-07-05T12:00:00.000Z
 *                   image: null
 *                   myAmount: "42.857142857142854"
 *                   myStatus: Reported
 *                   group:
 *                     id: 4
 *                     name: Amantes de la administración
 *                     description: Para todos los que les gusta administrar todo lo que está vivo y lo que no está realmente vivo.
 *                     createdBy: 7
 *                     image: null
 *                     createdOn: 2024-06-16T21:16:11.000Z
 *                     participants:
 *                       - id: 1
 *                         name: Juan Pérez
 *                         email: juan.perez@gmail.com
 *                         image: null
 *                         status: Joined
 *                       - id: 2
 *                         name: María López
 *                         email: maria.lopez@example.com
 *                         image: null
 *                         status: Joined
 *                       - id: 3
 *                         name: Carlos García
 *                         email: carlos.garcia@yahoo.com
 *                         image: null
 *                         status: Joined
 *                       - id: 4
 *                         name: Ana Fernández
 *                         email: ana.fernandez@example.com
 *                         image: null
 *                         status: Joined
 *                       - id: 5
 *                         name: Luis Martínez
 *                         email: luis.martinez@gmail.com
 *                         image: null
 *                         status: Joined
 *                       - id: 6
 *                         name: Marina Garcia
 *                         email: marina.garcia@gmail.com
 *                         image: null
 *                         status: Joined
 *                       - id: 7
 *                         name: admin
 *                         email: admin@gmail.com
 *                         image: null
 *                         status: Joined
 *                   expenseStatus: Reported
 *                 - id: 2
 *                   group_id: 4
 *                   concept: Taller de Excel
 *                   amount: "70.00"
 *                   paidBy: 7
 *                   createdBy: 2024-06-16T21:48:30.000Z
 *                   expenseDate: 2024-06-01T17:30:00.000Z
 *                   maxDate: 2024-07-01T12:00:00.000Z
 *                   image: null
 *                   myAmount: "10"
 *                   myStatus: Paid
 *                   group:
 *                   expenseStatus: Reported
 *                 - id: 3
 *                   group_id: 2
 *                   concept: Taller de Cocina
 *                   amount: "300.00"
 *                   paidBy: 2
 *                   createdBy: 2024-06-21T19:33:01.000Z
 *                   expenseDate: 2024-06-21T08:00:00.000Z
 *                   maxDate: 2024-07-01T12:00:00.000Z
 *                   image: null
 *                   myAmount: "300"
 *                   myStatus: Reported
 *                   group:
 *                     id: 2
 *                     name: Grupo de María
 *                     description: Grupo creado por María López
 *                     createdBy: 2
 *                     image: null
 *                     createdOn: 2024-06-16T20:57:43.000Z
 *                     participants:
 *                       - id: 7
 *                         name: admin
 *                         email: admin@gmail.com
 *                         image: null
 *                         status: Joined
 *                   expenseStatus: Reported
 *       404:
 *         description: No expenses found for this user.
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
 *                   example: No expenses found for this user
 *                 data:
 *                   type: array
 *                   example: []
 *             example:
 *               success: false
 *               message: No expenses found for this user
 *               data: []
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
 *                   example: An error occurred while processing your request.
 *                 data:
 *                   type: null
 *                   example: null
 *             example:
 *               success: false
 *               message: An error occurred while processing your request
 *               data: null
 */
router.get('/users/:users_id', expensesController.getExpensesByUserID);
/**
 * @swagger
 * /api/expenses/group/{groups_id}:
 *   get:
 *     summary: Get All Expenses by Group ID
 *     tags: [Expenses]
 *     parameters:
 *       - in: path
 *         name: groups_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the group
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: Access token for authorization
 *     responses:
 *       200:
 *         description: Expenses retrieved successfully.
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
 *                   example: Expenses retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 3
 *                       group_id:
 *                         type: integer
 *                         example: 2
 *                       concept:
 *                         type: string
 *                         example: Taller de Cocina
 *                       amount:
 *                         type: string
 *                         example: "300.00"
 *                       paidBy:
 *                         type: integer
 *                         example: 2
 *                       createdBy:
 *                         type: string
 *                         format: date-time
 *                         example: 2024-06-21T19:33:01.000Z
 *                       expenseDate:
 *                         type: string
 *                         format: date-time
 *                         example: 2024-06-21T08:00:00.000Z
 *                       maxDate:
 *                         type: string
 *                         format: date-time
 *                         example: 2024-07-01T12:00:00.000Z
 *                       image:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       myAmount:
 *                         type: string
 *                         example: "300"
 *                       myStatus:
 *                         type: string
 *                         example: Reported
 *                       group:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 2
 *                           name:
 *                             type: string
 *                             example: Grupo de María
 *                           description:
 *                             type: string
 *                             example: Grupo creado por María López
 *                           createdBy:
 *                             type: integer
 *                             example: 2
 *                           image:
 *                             type: string
 *                             nullable: true
 *                             example: null
 *                           createdOn:
 *                             type: string
 *                             format: date-time
 *                             example: 2024-06-16T20:57:43.000Z
 *                           participants:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 id:
 *                                   type: integer
 *                                   example: 7
 *                                 name:
 *                                   type: string
 *                                   example: admin
 *                                 email:
 *                                   type: string
 *                                   example: admin@gmail.com
 *                                 image:
 *                                   type: string
 *                                   nullable: true
 *                                   example: null
 *                                 status:
 *                                   type: string
 *                                   example: Joined
 *                       expenseStatus:
 *                         type: string
 *                         example: Reported
 *             example:
 *               success: true
 *               message: Expenses retrieved successfully
 *               data:
 *                 - id: 3
 *                   group_id: 2
 *                   concept: Taller de Cocina
 *                   amount: "300.00"
 *                   paidBy: 2
 *                   createdBy: 2024-06-21T19:33:01.000Z
 *                   expenseDate: 2024-06-21T08:00:00.000Z
 *                   maxDate: 2024-07-01T12:00:00.000Z
 *                   image: null
 *                   myAmount: "300"
 *                   myStatus: Reported
 *                   group:
 *                     id: 2
 *                     name: Grupo de María
 *                     description: Grupo creado por María López
 *                     createdBy: 2
 *                     image: null
 *                     createdOn: 2024-06-16T20:57:43.000Z
 *                     participants:
 *                       - id: 7
 *                         name: admin
 *                         email: admin@gmail.com
 *                         image: null
 *                         status: Joined
 *                   expenseStatus: Reported
 *       404:
 *         description: No expenses found for this group.
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
 *                   example: No expenses found for this group
 *                 data:
 *                   type: array
 *                   example: []
 *             example:
 *               success: false
 *               message: No expenses found for this group
 *               data: []
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
 *                   example: An error occurred while processing your request.
 *                 data:
 *                   type: null
 *                   example: null
 *             example:
 *               success: false
 *               message: An error occurred while processing your request
 *               data: null
 */
router.get('/group/:groups_id', expensesController.getAllExpensesByGroup);




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
 *                 example: 2
 *                 description: The ID of the group
 *               concept:
 *                 type: string
 *                 example: Un taller de salsa
 *                 description: The concept of the expense
 *               amount:
 *                 type: number
 *                 format: float
 *                 example: 120
 *                 description: The amount of the expense
 *               expenseDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-06-22 10:00:00"
 *                 description: The date of the expense
 *               maxDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-07-22 14:00:00"
 *                 description: The deadline to settle the expense
 *               image:
 *                 type: string
 *                 format: uri
 *                 nullable: true
 *                 example: null
 *                 description: The URL of the expense image
 *               paidBy:
 *                 type: integer
 *                 example: 2
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
 *                       example: 8
 *             example:
 *               success: true
 *               message: Expense created and distributed successfully
 *               data:
 *                 id: 8
 *       500:
 *         description: Internal server error
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
/**
 * @swagger
 * /api/expenses/update/{expenses_id}:
 *   put:
 *     summary: Update an expense
 *     tags: [Expenses]
 *     parameters:
 *       - in: path
 *         name: expenses_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the expense to update
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
 *                 type: string
 *                 example: "2"
 *               concept:
 *                 type: string
 *                 example: "Cambio de concepto"
 *               amount:
 *                 type: string
 *                 example: "100"
 *               expenseDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-06-21 19:00"
 *               maxDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-06-30 19:00"
 *               image:
 *                 type: string
 *                 example: "/tickets/051.jpg"
 *               paidBy:
 *                 type: string
 *                 example: "4"
 *     responses:
 *       200:
 *         description: Expense updated successfully without changing balances
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
 *                   example: "Expense updated successfully without changing balances"
 *                 data:
 *                   type: null
 *                   example: null
 *       400:
 *         description: Update not allowed if the cost or payer is changed
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
 *                   example: "Update not allowed: cost or payer changed"
 *                 data:
 *                   type: null
 *                   example: null
 *       404:
 *         description: Expense not found
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
 *                 data:
 *                   type: array
 *                   example: []
 *       500:
 *         description: Failed to update expense due to an internal server error
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
 *                   example: "Failed to update expense"
 *                 data:
 *                   type: null
 *                   example: null
 */
router.put('/update/:expenses_id', checkAdmin, expensesController.updateExpense);

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