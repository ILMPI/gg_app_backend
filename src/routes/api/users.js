const express = require('express');
const router = express.Router();
const userController = require('../../controllers/users.controller');

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Users retrieved successfully
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
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *                       image_url:
 *                         type: string
 *                         nullable: true
 *                       state:
 *                         type: string
 *             example:
 *               success: true
 *               message: "Users retrieved successfully"
 *               data: [
 *                 {
 *                   "id": 1,
 *                   "name": "Juan Pérez",
 *                   "email": "juan.perez@gmail.com",
 *                   "image_url": null,
 *                   "state": "Active"
 *                 },
 *                 {
 *                   "id": 2,
 *                   "name": "María López",
 *                   "email": "maria.lopez@example.com",
 *                   "image_url": null,
 *                   "state": "Active"
 *                 },
 *                 {
 *                   "id": 3,
 *                   "name": "Carlos García",
 *                   "email": "carlos.garcia@yahoo.com",
 *                   "image_url": null,
 *                   "state": "Active"
 *                 },
 *                 {
 *                   "id": 4,
 *                   "name": "Ana Fernández",
 *                   "email": "ana.fernandez@example.com",
 *                   "image_url": null,
 *                   "state": "Active"
 *                 },
 *                 {
 *                   "id": 5,
 *                   "name": "Luis Martínez",
 *                   "email": "luis.martinez@gmail.com",
 *                   "image_url": null,
 *                   "state": "Active"
 *                 },
 *                 {
 *                   "id": 6,
 *                   "name": "Marina Garcia",
 *                   "email": "marina.garcia@gmail.com",
 *                   "image_url": null,
 *                   "state": "Active"
 *                 },
 *                 {
 *                   "id": 7,
 *                   "name": "admin",
 *                   "email": "admin@gmail.com",
 *                   "image_url": null,
 *                   "state": "Active"
 *                 },
 *                 {
 *                   "id": 8,
 *                   "name": "Alex",
 *                   "email": "alex@gmail.com",
 *                   "image_url": null,
 *                   "state": "Active"
 *                 }
 *               ]
 */
router.get('/', userController.getAllUsers);
/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User retrieved successfully
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
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     image_url:
 *                       type: string
 *                       nullable: true
 *                     state:
 *                       type: string
 *             example:
 *               success: true
 *               message: "User retrieved successfully"
 *               data:
 *                 id: 8
 *                 name: "Alex"
 *                 email: "alex@gmail.com"
 *                 image_url: null
 *                 state: "Active"
 *       404:
 *         description: User not found
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
 *               message: "User not found"
 *               data: null
 */
router.get('/:id', userController.getUserById);
/**
 * @swagger
 * /api/users/email/{email}:
 *   get:
 *     summary: Search user by email
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: The user's email
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: The JWT token for authentication
 *     responses:
 *       200:
 *         description: User retrieved successfully
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
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *             example:
 *               success: true
 *               message: "User retrieved successfully"
 *               data: 
 *                 id: 7
 *                 name: "admin"
 *                 email: "admin@gmail.com"
 *       404:
 *         description: User not found
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
 *               message: "User not found"
 *               data: null
 */
router.get('/email/:email', userController.searchUserByEmail);
/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *             example:
 *               name: "Alexander"
 *     responses:
 *       200:
 *         description: Profile updated successfully
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
 *                     name:
 *                       type: string
 *                     image_url:
 *                       type: string
 *                       nullable: true
 *                     state:
 *                       type: string
 *             example:
 *               success: true
 *               message: "Profile updated successfully"
 *               data:
 *                 name: "Alexander"
 *                 image_url: null
 *                 state: "Active"
 *       403:
 *         description: Forbidden
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
 *               message: "Forbidden: You can only update your own profile"
 *               data: null
 */
router.put('/:id', userController.updateUserById);

/**
 * @swagger
 * /api/users/{userId}/common-groups:
 *   get:
 *     summary: Get users with common groups
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: The JWT token for authentication
 *     responses:
 *       200:
 *         description: Users with common groups retrieved successfully
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
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *             example:
 *               success: true
 *               message: "Users with common groups retrieved successfully"
 *               data: [
 *                 {
 *                   "id": 1,
 *                   "name": "Juan Pérez",
 *                   "email": "juan.perez@gmail.com"
 *                 },
 *                 {
 *                   "id": 2,
 *                   "name": "María López",
 *                   "email": "maria.lopez@example.com"
 *                 },
 *                 {
 *                   "id": 3,
 *                   "name": "Carlos García",
 *                   "email": "carlos.garcia@yahoo.com"
 *                 },
 *                 {
 *                   "id": 4,
 *                   "name": "Ana Fernández",
 *                   "email": "ana.fernandez@example.com"
 *                 },
 *                 {
 *                   "id": 5,
 *                   "name": "Luis Martínez",
 *                   "email": "luis.martinez@gmail.com"
 *                 },
 *                 {
 *                   "id": 6,
 *                   "name": "Marina Garcia",
 *                   "email": "marina.garcia@gmail.com"
 *                 }
 *               ]
 *       403:
 *         description: Forbidden
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
 *               message: "Forbidden: You can only retrieve the list of users with common groups for your own profile"
 *               data: null
 *       404:
 *         description: User not found
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
 *               message: "User not found"
 *               data: null
 *       500:
 *         description: Internal server error
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
 *             examples:
 *               error:
 *                 value:
 *                   success: false
 *                   message: "Internal Server Error"
 *                   data: {
 *                     error: "Error message details here"
 *                   }
 */
router.get('/:userId/common-groups', userController.getUsersWithCommonGroups);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: The JWT token for authentication
 *     responses:
 *       200:
 *         description: User deleted successfully
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
 *               success: true
 *               message: "User deleted successfully"
 *               data: null
 *       403:
 *         description: Forbidden - You can only delete your own profile
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
 *               message: "Forbidden: You can only delete your own profile"
 *               data: null
 */
router.delete('/:id', userController.deleteUserById);

// router.get('/', userController.getAllUsers);
// router.get('/:id', userController.getUserById);
// router.get('/email/:email', userController.searchUserByEmail);
// router.put('/:id', userController.updateUserById);
// router.delete('/:id', userController.deleteUserById);

module.exports = router;
