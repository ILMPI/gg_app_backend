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
 *                       status:
 *                         type: string
 *                         example: Joined
 *                       balance:
 *                         type: string
 *                         example: "223"
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
 *                   status: "Joined",
 *                   balance: "223",
 *                   image: "https://picsum.photos/id/237/200"
 *                 },
 *                 {
 *                   users_id: 2,
 *                   name: "María López",
 *                   email: "maria.lopez@example.com",
 *                   status: "Joined",
 *                   balance: "-53",
 *                   image: "https://picsum.photos/seed/picsum/200"
 *                 },
 *                 {
 *                   users_id: 3,
 *                   name: "Carlos García",
 *                   email: "carlos.garcia@yahoo.com",
 *                   status: "Joined",
 *                   balance: "-53",
 *                   image: null
 *                 },
 *                 {
 *                   users_id: 4,
 *                   name: "Ana Fernández",
 *                   email: "ana.fernandez@example.com",
 *                   status: "Joined",
 *                   balance: "-53",
 *                   image: null
 *                 },
 *                 {
 *                   users_id: 5,
 *                   name: "Luis Martínez",
 *                   email: "luis.martinez@gmail.com",
 *                   status: "Joined",
 *                   balance: "-53",
 *                   image: null
 *                 },
 *                 {
 *                   users_id: 6,
 *                   name: "Marina Garcia",
 *                   email: "marina.garcia@gmail.com",
 *                   status: "Joined",
 *                   balance: "-53",
 *                   image: null
 *                 },
 *                 {
 *                   users_id: 7,
 *                   name: "admin",
 *                   email: "admin@gmail.com",
 *                   status: "Joined",
 *                   balance: "17",
 *                   image: "https://picsum.photos/id/8/200"
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
/**
 * @swagger
 * /api/membership/{users_id}/{groups_id}:
 *   put:
 *     summary: Update membership status to Joined
 *     tags: [Memberships]
 *     parameters:
 *       - in: path
 *         name: users_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user
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
 *         description: Membership status updated successfully.
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
 *                   example: Membership status updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     affectedRows:
 *                       type: integer
 *                       example: 1
 *             example:
 *               success: true
 *               message: Membership status updated successfully
 *               data:
 *                 affectedRows: 1
 *       400:
 *         description: Bad request.
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
 *                   example: You can only update your own membership status
 *                 data:
 *                   type: null
 *                   example: null
 *             examples:
 *               update-own-status:
 *                 value:
 *                   success: false
 *                   message: You can only update your own membership status
 *                   data: null
 *               not-invited:
 *                 value:
 *                   success: false
 *                   message: You are not invited to this group
 *                   data: null
 *               already-joined:
 *                 value:
 *                   success: false
 *                   message: You already joined this group
 *                   data: null
 *               not-member:
 *                 value:
 *                   success: false
 *                   message: You are not a member of this group
 *                   data: null
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
 *                   example: An error occurred while processing your request
 *                 data:
 *                   type: null
 *                   example: null
 *             example:
 *               success: false
 *               message: An error occurred while processing your request
 *               data: null
 */
router.put('/:users_id/:groups_id', membershipsController.updateMembership);

/**
 * @swagger
 * /api/membership/{users_id}/{groups_id}:
 *   delete:
 *     summary: Delete a membership
 *     tags: [Memberships]
 *     parameters:
 *       - in: path
 *         name: users_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user
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
 *         description: Member deleted successfully.
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
 *                   example: Member deleted successfully
 *                 data:
 *                   type: null
 *                   example: null
 *             example:
 *               success: true
 *               message: Member deleted successfully
 *               data: null
 *       400:
 *         description: Bad request.
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
 *                   example: Group ID is required
 *                 data:
 *                   type: null
 *                   example: null
 *             example:
 *               success: false
 *               message: Group ID is required
 *               data: null
 *       404:
 *         description: User or group not found.
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
 *                   example: User does not exist or is not a member of the group
 *                 data:
 *                   type: null
 *                   example: null
 *             examples:
 *               user-not-found:
 *                 value:
 *                   success: false
 *                   message: User does not exist
 *                   data: null
 *               not-member:
 *                 value:
 *                   success: false
 *                   message: User is not a member of the group
 *                   data: null
 *               group-not-found:
 *                 value:
 *                   success: false
 *                   message: Group not found
 *                   data: null
 *       403:
 *         description: Forbidden.
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
 *                   example: You are not the admin of this group
 *                 data:
 *                   type: null
 *                   example: null
 *             example:
 *               success: false
 *               message: You are not the admin of this group
 *               data: null
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
 *                   example: "Failed to delete member: User is the creator or the balance is not zero"
 *                 data:
 *                   type: null
 *                   example: null
 *             examples:
 *               delete-failed:
 *                 value:
 *                   success: false
 *                   message: "Failed to delete member: User is the creator or the balance is not zero"
 *                   data: null
 *               error:
 *                 value:
 *                   success: false
 *                   message: "An error occurred while processing your request"
 *                   data: null
 */
router.delete('/:users_id/:groups_id', checkAdmin, membershipsController.deleteMembership);

module.exports = router;
