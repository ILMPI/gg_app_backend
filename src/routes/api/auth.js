const express = require('express');
const router = express.Router();
const authController = require('../../controllers/auth.controller');
const refreshToken = require('../../middleware/refreshToken');

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               email: "alex@gmail.com"
 *               password: "password"
 *     responses:
 *       200:
 *         description: User logged in successfully
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
 *                     accessToken:
 *                       type: string
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         name:
 *                           type: string
 *                         email:
 *                           type: string
 *                         image_url:
 *                           type: string
 *                           nullable: true
 *                         state:
 *                           type: string
 *             example: 
 *               {
 *                 "success": true,
 *                 "message": "Login successful",
 *                 "data": {
 *                   "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiaWF0IjoxNzE4NTgyMzE1LCJleHAiOjE3MTg2Njg3MTV9.aRXg6T1peIVK_yhF1FkfJxX36cgX8VwqPZaF1q9M-ic",
 *                   "user": {
 *                     "id": 8,
 *                     "name": "Alex",
 *                     "email": "alex@gmail.com",
 *                     "image_url": null,
 *                     "state": "Active"
 *                   }
 *                 }
 *               }
 *       401:
 *         description: Invalid email or password
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
 *               {
 *                 "success": false,
 *                 "message": "Invalid email or password",
 *                 "data": null
 *               }
 */
router.post('/login', authController.login);


/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *             example:
 *               password: "password"
 *               name: "Alex"
 *               email: "alex@gmail.com"
 *     responses:
 *       200:
 *         description: User registered successfully
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
 *               {
 *                 "success": true,
 *                 "message": "User registered successfully",
 *                 "data": {
 *                   "id": 8,
 *                   "name": "Alex",
 *                   "email": "alex@gmail.com"
 *                 }
 *               }
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
 *                   properties:
 *                     error:
 *                       type: string
 *             example: 
 *               {
 *                 "success": false,
 *                 "message": "Internal Server Error",
 *                 "data": {
 *                   "error": "Duplicate entry 'alex@gmail.com' for key 'users.email_UNIQUE'"
 *                 }
 *               }
 */
router.post('/register', authController.register);



//refreshtoken
router.post('/refresh-token', refreshToken);
module.exports = router;

