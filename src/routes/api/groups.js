const express = require('express');
const router = express.Router();
const groups = require('../../controllers/groups.controller');
const checkAdmin = require('../../middleware/checkAdmin');
const { checkIfAlreadyMember, checkIfRecentlyInvited } = require('../../middleware/invitationToGroup.middleware');
const { inviteRateLimiter } = require('../../middleware/inviteRateLimiter.middleware');
const { validateUserArray } = require('../../middleware/validateUserArray.middleware');

/**
 * @swagger
 * /api/groups:
 *   post:
 *     summary: Create a new group
 *     tags: [Groups]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: Access token for authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Super Group"
 *               description:
 *                 type: string
 *                 example: "Description"
 *               image:
 *                 type: string
 *                 format: url
 *                 example: "https://picsum.photos/id/26/200/200"
 *             required:
 *               - name
 *               - description
 *     responses:
 *       201:
 *         description: Group created successfully
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
 *                   example: "Group created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 14
 *             example:
 *               success: true
 *               message: "Group created successfully"
 *               data:
 *                 id: 14
 *       400:
 *         description: Bad Request
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
 *                   example: "All fields are required: title, description"
 *                 data:
 *                   type: object
 *                   nullable: true
 *             examples:
 *               missing-fields:
 *                 value:
 *                   success: false
 *                   message: "All fields are required: title, description"
 *                   data: null
 *               duplicate-group:
 *                 value:
 *                   success: false
 *                   message: "A group with this name already exists for this user"
 *                   data: null
 *       500:
 *         description: Internal Server Error
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
 *                   example: "Internal Server Error"
 *                 data:
 *                   type: object
 *                   nullable: true
 *             example:
 *               success: false
 *               message: "Internal Server Error"
 *               data: null
 */
router.post('/', groups.createGroup);
/**
 * @swagger
 * /api/groups:
 *   get:
 *     summary: Get all groups
 *     tags: [Groups]
 *     responses:
 *       200:
 *         description: Groups retrieved successfully
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
 *                       description:
 *                         type: string
 *                       createdBy:
 *                         type: integer
 *                       image:
 *                         type: string
 *                         nullable: true
 *                       createdOn:
 *                         type: string
 *                         format: date-time
 *                       participants:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                             name:
 *                               type: string
 *                             email:
 *                               type: string
 *                             image:
 *                               type: string
 *                               nullable: true
 *                             status:
 *                               type: string
 *             example:
 *               success: true
 *               message: "Groups retrieved successfully"
 *               data: [
 *                 {
 *                   "id": 1,
 *                   "name": "Grupo de Juan",
 *                   "description": "Grupo creado por Juan Pérez",
 *                   "createdBy": 1,
 *                   "image": null,
 *                   "createdOn": "2024-06-16T20:54:59.000Z",
 *                   "participants": [
 *                     {
 *                       "id": 7,
 *                       "name": "admin",
 *                       "email": "admin@gmail.com",
 *                       "image": "https://picsum.photos/id/8/200",
 *                       "status": "Joined"
 *                     }
 *                   ]
 *                 },
 *                 {
 *                   "id": 2,
 *                   "name": "Grupo de María",
 *                   "description": "Grupo creado por María López",
 *                   "createdBy": 2,
 *                   "image": null,
 *                   "createdOn": "2024-06-16T20:57:43.000Z",
 *                   "participants": [
 *                     {
 *                       "id": 7,
 *                       "name": "admin",
 *                       "email": "admin@gmail.com",
 *                       "image": "https://picsum.photos/id/8/200",
 *                       "status": "Joined"
 *                     }
 *                   ]
 *                 }
 *               ]
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
 *             example:
 *               success: false
 *               message: "Internal Server Error"
 *               data: {
 *                 error: "Error message details here"
 *               }
 */
router.get('/', groups.getGroups);
/**
 * @swagger
 * /api/groups/{id}:
 *   get:
 *     summary: Get group by ID
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: id
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
 *         description: Group retrieved successfully
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
 *                     description:
 *                       type: string
 *                     createdBy:
 *                       type: integer
 *                     image:
 *                       type: string
 *                       nullable: true
 *                     createdOn:
 *                       type: string
 *                       format: date-time
 *                     participants:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                           email:
 *                             type: string
 *                           image:
 *                             type: string
 *                             nullable: true
 *                           status:
 *                             type: string
 *             example:
 *               success: true
 *               message: "Group retrieved successfully"
 *               data: {
 *                 "id": 10,
 *                 "name": "Amantes de la administración",
 *                 "description": "Para todos los que les gusta administrar todo lo que está vivo y lo que no está realmente vivo.",
 *                 "createdBy": 1,
 *                 "image": "https://picsum.photos/id/26/200/200",
 *                 "createdOn": "2024-06-17T00:49:25.000Z",
 *                 "participants": [
 *                   {
 *                     "id": 1,
 *                     "name": "Juan Pérez",
 *                     "email": "juan.perez@gmail.com",
 *                     "image": "https://picsum.photos/id/237/200",
 *                     "status": "Joined"
 *                   },
 *                   {
 *                     "id": 2,
 *                     "name": "María López",
 *                     "email": "maria.lopez@example.com",
 *                     "image": "https://picsum.photos/seed/picsum/200",
 *                     "status": "Joined"
 *                   }
 *                 ]
 *               }
 *       404:
 *         description: Group not found
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
 *               message: "Group not found"
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
 *             example:
 *               success: false
 *               message: "Internal Server Error"
 *               data: {
 *                 error: "Error message details here"
 *               }
 */
router.get('/:id', groups.getGroupById);
/**
 * @swagger
 * /api/groups/creator/{creator_id}:
 *   get:
 *     summary: Get groups by creator ID
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: creator_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The creator ID
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: The JWT token for authentication
 *     responses:
 *       200:
 *         description: Groups retrieved successfully
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
 *                       description:
 *                         type: string
 *                       createdBy:
 *                         type: integer
 *                       image:
 *                         type: string
 *                         nullable: true
 *                       createdOn:
 *                         type: string
 *                         format: date-time
 *                       participants:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                             name:
 *                               type: string
 *                             email:
 *                               type: string
 *                             image:
 *                               type: string
 *                               nullable: true
 *                             status:
 *                               type: string
 *             example:
 *               success: true
 *               message: "Groups retrieved successfully"
 *               data: [
 *                 {
 *                   "id": 4,
 *                   "name": "Amantes de la administración",
 *                   "description": "Para todos los que les gusta administrar todo lo que está vivo y lo que no está realmente vivo.",
 *                   "createdBy": 7,
 *                   "image": null,
 *                   "createdOn": "2024-06-16T21:16:11.000Z",
 *                   "participants": [
 *                     {
 *                       "id": 1,
 *                       "name": "Juan Pérez",
 *                       "email": "juan.perez@gmail.com",
 *                       "image": "https://picsum.photos/id/237/200",
 *                       "status": "Joined"
 *                     },
 *                     {
 *                       "id": 2,
 *                       "name": "María López",
 *                       "email": "maria.lopez@example.com",
 *                       "image": "https://picsum.photos/seed/picsum/200",
 *                       "status": "Joined"
 *                     },
 *                     {
 *                       "id": 3,
 *                       "name": "Carlos García",
 *                       "email": "carlos.garcia@yahoo.com",
 *                       "image": null,
 *                       "status": "Joined"
 *                     },
 *                     {
 *                       "id": 4,
 *                       "name": "Ana Fernández",
 *                       "email": "ana.fernandez@example.com",
 *                       "image": null,
 *                       "status": "Joined"
 *                     },
 *                     {
 *                       "id": 5,
 *                       "name": "Luis Martínez",
 *                       "email": "luis.martinez@gmail.com",
 *                       "image": null,
 *                       "status": "Joined"
 *                     },
 *                     {
 *                       "id": 6,
 *                       "name": "Marina Garcia",
 *                       "email": "marina.garcia@gmail.com",
 *                       "image": null,
 *                       "status": "Joined"
 *                     },
 *                     {
 *                       "id": 7,
 *                       "name": "admin",
 *                       "email": "admin@gmail.com",
 *                       "image": "https://picsum.photos/id/8/200",
 *                       "status": "Joined"
 *                     },
 *                     {
 *                       "id": 9,
 *                       "name": "Vanessa Brown",
 *                       "email": "van_brown@gmail.com",
 *                       "image": null,
 *                       "status": "Invited"
 *                     },
 *                     {
 *                       "id": 10,
 *                       "name": "Vanessa Brown",
 *                       "email": "vanda_brown@gmail.com",
 *                       "image": null,
 *                       "status": "Invited"
 *                     }
 *                   ]
 *                 }
 *               ]
 *       404:
 *         description: No groups found for this creator or creator not found
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
 *               NoGroupsFound:
 *                 value:
 *                   success: false
 *                   message: "No groups found for this creator"
 *                   data: null
 *               CreatorNotFound:
 *                 value:
 *                   success: false
 *                   message: "Creator not found"
 *                   data: null
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
 *             example:
 *               success: false
 *               message: "Internal Server Error"
 *               data: {
 *                 error: "Error message details here"
 *               }
 */
router.get('/creator/:creator_id', groups.getGroupsByCreatorId);

/**
 * @swagger
 * /api/groups/user/{userId}:
 *   get:
 *     summary: Get groups by user ID
 *     tags: [Groups]
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
 *         description: Groups retrieved successfully
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
 *                       description:
 *                         type: string
 *                       createdBy:
 *                         type: integer
 *                       image:
 *                         type: string
 *                         nullable: true
 *                       createdOn:
 *                         type: string
 *                         format: date-time
 *                       participants:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                             name:
 *                               type: string
 *                             email:
 *                               type: string
 *                             image:
 *                               type: string
 *                               nullable: true
 *                             status:
 *                               type: string
 *             example:
 *               success: true
 *               message: "Groups retrieved successfully"
 *               data: [
 *                 {
 *                   "id": 1,
 *                   "name": "Grupo de Juan",
 *                   "description": "Grupo creado por Juan Pérez",
 *                   "createdBy": 1,
 *                   "image": null,
 *                   "createdOn": "2024-06-16T20:54:59.000Z",
 *                   "participants": [
 *                     {
 *                       "id": 7,
 *                       "name": "admin",
 *                       "email": "admin@gmail.com",
 *                       "image": "https://picsum.photos/id/8/200",
 *                       "status": "Joined"
 *                     }
 *                   ]
 *                 },
 *                 {
 *                   "id": 2,
 *                   "name": "Grupo de María",
 *                   "description": "Grupo creado por María López",
 *                   "createdBy": 2,
 *                   "image": null,
 *                   "createdOn": "2024-06-16T20:57:43.000Z",
 *                   "participants": [
 *                     {
 *                       "id": 7,
 *                       "name": "admin",
 *                       "email": "admin@gmail.com",
 *                       "image": "https://picsum.photos/id/8/200",
 *                       "status": "Joined"
 *                     }
 *                   ]
 *                 }
 *               ]
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
router.get('/user/:userId', groups.getAllGroupsByUserId);
/**
 * @swagger
 * /api/groups/{id}:
 *   put:
 *     summary: Update group details
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the group to update
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: Access token for authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "New Group Name"
 *               image:
 *                 type: string
 *                 format: url
 *                 example: "https://picsum.photos/id/26/200/200"
 *     responses:
 *       200:
 *         description: Group updated successfully
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
 *                   example: "Group updated successfully"
 *                 data:
 *                   type: object
 *                   nullable: true
 *             example:
 *               success: true
 *               message: "Group updated successfully"
 *               data: null
 *       400:
 *         description: Invalid request
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
 *                   example: "Invalid request data"
 *                 data:
 *                   type: object
 *                   nullable: true
 *             example:
 *               success: false
 *               message: "Invalid request data"
 *               data: null
 *       401:
 *         description: Unauthorized
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
 *                   example: "You are not the admin of this group"
 *                 data:
 *                   type: object
 *                   nullable: true
 *             example:
 *               success: false
 *               message: "You are not the admin of this group"
 *               data: null
 *       404:
 *         description: Group not found
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
 *                   example: "Group not found"
 *                 data:
 *                   type: object
 *                   nullable: true
 *             example:
 *               success: false
 *               message: "Group not found"
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
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Failed to verify admin status"
 *                 data:
 *                   type: object
 *                   nullable: true
 *             example:
 *               success: false
 *               message: "Failed to verify admin status"
 *               data: null
 */
router.put('/:id', checkAdmin, groups.updateGroup);
/**
 * @swagger
 * /api/groups/{id}:
 *   delete:
 *     summary: Delete group
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: id
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
 *         description: Group archived successfully
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
 *               message: "Group archived successfully"
 *               data: null
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
 *               message: "Group ID is required"
 *               data: null
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
 *               message: "You are not the admin of this group"
 *               data: null
 *       404:
 *         description: Group not found
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
 *               message: "Group not found"
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
 *               message: "Failed to verify admin status"
 *               data: null
 */
router.delete('/:id', checkAdmin, groups.deleteGroup);
/**
 * @swagger
 * /api/groups/{groupId}/state:
 *   get:
 *     summary: Get group state by group ID
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: groupId
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
 *         description: Group state retrieved successfully
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
 *                     status:
 *                       type: string
 *                     changed_on:
 *                       type: string
 *                       format: date-time
 *                     groups_id:
 *                       type: integer
 *             example:
 *               success: true
 *               message: "Group state retrieved successfully"
 *               data: 
 *                 id: 1
 *                 status: "Active"
 *                 changed_on: "2024-06-17T01:40:50.000Z"
 *                 groups_id: 18
 *       404:
 *         description: Group not found or state not found
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
 *               GroupNotFound:
 *                 value:
 *                   success: false
 *                   message: "Group not found"
 *                   data: null
 *               StateNotFound:
 *                 value:
 *                   success: false
 *                   message: "State not found for the given group ID"
 *                   data: null
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
 *             example:
 *               success: false
 *               message: "Internal Server Error"
 *               data: null
 */
router.get('/:groupId/state', groups.getGroupStateByGroupId);
/**
 * @swagger
 * /api/groups/{id}/activate:
 *   post:
 *     summary: Activate a group
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: id
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
 *         description: Group activated successfully
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
 *               message: "Group activated successfully"
 *               data: null
 *       400:
 *         description: Group is already active
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
 *                     activated_on:
 *                       type: string
 *                       format: date-time
 *             example:
 *               success: false
 *               message: "Group is already active"
 *               data:
 *                 activated_on: "2024-06-17T01:40:50.000Z"
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
 *               message: "You are not the admin of this group"
 *               data: null
 *       404:
 *         description: Group not found
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
 *               message: "Group not found"
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
 *               message: "Failed to verify admin status"
 *               data: null
 */
router.post('/:id/activate', checkAdmin, groups.activateGroup);
/**
 * @swagger
 * /api/groups/{id}/invite:
 *   post:
 *     summary: Invite users to a group
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: id
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               participants:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: "john.doe@gmail.com"
 *                     id:
 *                       type: integer
 *                       example: 10
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *               users:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: "john.doe@gmail.com"
 *                     id:
 *                       type: integer
 *                       example: 10
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *             required:
 *               - participants
 *             example:
 *               participants: [
 *                 {
 *                   id: 1,
 *                   name: "John D",
 *                   email: "johnd@gmail.com"
 *                 },
 *                 {
 *                   email: "janes@gmail.com"
 *                 },
 *                 {
 *                   id: 3,
 *                   name: "Emily Davis",
 *                   email: "emily1dadavis@yahoo.com"
 *                 }
 *               ]
 *     responses:
 *       200:
 *         description: Batch invitation process completed
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
 *                       email:
 *                         type: string
 *                       success:
 *                         type: boolean
 *                       message:
 *                         type: string
 *                       error:
 *                         type: string
 *                         nullable: true
 *             examples:
 *               partial-success:
 *                 value:
 *                   success: true
 *                   message: "Batch invitation process completed"
 *                   data: [
 *                     {
 *                       email: "johnd@gmail.com",
 *                       success: true,
 *                       message: "Invitation sent to the email"
 *                     },
 *                     {
 *                       email: "janes@gmail.com",
 *                       success: true,
 *                       message: "Invitation sent to the email"
 *                     },
 *                     {
 *                       email: "emily1dadavis@yahoo.com",
 *                       success: true,
 *                       message: "Invitation sent to the email"
 *                     }
 *                   ]
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
 *             examples:
 *               invalid-format:
 *                 value:
 *                   success: false
 *                   message: "Invalid input format: expected an array of participants or users"
 *                   data: null
 *               limit-exceeded:
 *                 value:
 *                   success: false
 *                   message: "Cannot invite more than 10 users at a time"
 *                   data: null
 *               already-member:
 *                 value:
 *                   success: false
 *                   message: "The user is already a member of the group"
 *                   data: null
 *               recently-invited:
 *                 value:
 *                   success: false
 *                   message: "An invitation has already been sent to this email for this group in the last 24 hours"
 *                   data: null
 *       429:
 *         description: Too Many Requests
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
 *               message: "Too many requests, please try again later"
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
 *             examples:
 *               error:
 *                 value:
 *                   success: false
 *                   message: "Internal Server Error"
 *                   data: {
 *                     error: "Error message details here"
 *                   }
 */
router.post('/:id/invite', inviteRateLimiter, validateUserArray, checkAdmin, checkIfRecentlyInvited, checkIfAlreadyMember,groups.inviteUserToGroup);


module.exports = router;
