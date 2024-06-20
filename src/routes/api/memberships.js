const express = require('express');
const router = express.Router();
const membershipsController = require('../../controllers/memberships.controller');
const checkAdmin = require('../../middleware/checkAdmin');


router.get('/', membershipsController.getAllMembership);

/**
 * @swagger
 * /api/membership/group/{groups_id}:
 *   get:
 *     summary: Get All Memberships of a Group
 *     tags: [Memberships]
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
 *         description: A JSON array of membership objects.
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
 *                   example: Operation successful
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       users_id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: Juan Pérez
 *                       email:
 *                         type: string
 *                         example: juan.perez@gmail.com
 *                       image:
 *                         type: string
 *                         nullable: true
 *                         example: https://picsum.photos/id/237/200
 *             example:
 *               success: true
 *               message: Operation successful
 *               data: [
 *                 {
 *                   users_id: 1,
 *                   name: "Juan Pérez",
 *                   email: "juan.perez@gmail.com",
 *                   image: "https://picsum.photos/id/237/200"
 *                 },
 *                 {
 *                   users_id: 2,
 *                   name: "María López",
 *                   email: "maria.lopez@example.com",
 *                   image: "https://picsum.photos/seed/picsum/200"
 *                 },
 *                 {
 *                   users_id: 3,
 *                   name: "Carlos García",
 *                   email: "carlos.garcia@yahoo.com",
 *                   image: null
 *                 },
 *                 {
 *                   users_id: 4,
 *                   name: "Ana Fernández",
 *                   email: "ana.fernandez@example.com",
 *                   image: null
 *                 },
 *                 {
 *                   users_id: 5,
 *                   name: "Luis Martínez",
 *                   email: "luis.martinez@gmail.com",
 *                   image: null
 *                 },
 *                 {
 *                   users_id: 6,
 *                   name: "Marina Garcia",
 *                   email: "marina.garcia@gmail.com",
 *                   image: null
 *                 },
 *                 {
 *                   users_id: 7,
 *                   name: "admin",
 *                   email: "admin@gmail.com",
 *                   image: "https://picsum.photos/id/8/200"
 *                 },
 *                 {
 *                   users_id: 8,
 *                   name: "Alex Brown",
 *                   email: "al_brown@gmail.com",
 *                   image: null
 *                 },
 *                 {
 *                   users_id: 9,
 *                   name: "Vanessa Brown",
 *                   email: "van_brown@gmail.com",
 *                   image: null
 *                 },
 *                 {
 *                   users_id: 10,
 *                   name: "Vanessa Brown",
 *                   email: "vanda_brown@gmail.com",
 *                   image: null
 *                 }
 *               ]
 *       404:
 *         description: Group not found.
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
 *                   example: This group does not exist!
 *                 data:
 *                   type: null
 *                   example: null
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
 */
router.get('/group/:groups_id', membershipsController.getAllMembershipByGroup);
//router.post('/', membershipsController.addMemberToGroup);
router.put('/:users_id/:groups_id', membershipsController.updateMembership);
router.delete('/:users_id/:groups_id', checkAdmin, membershipsController.deleteMembership);

module.exports = router;
