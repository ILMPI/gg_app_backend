const express = require('express');
const router = express.Router();
const { createGroup, getGroups, getGroupById, getGroupsByCreatorId, updateGroup, deleteGroup, getGroupStateByGroupId, activateGroup } = require('../../controllers/groups.controller');
const checkAdmin = require('../../middleware/checkAdmin');

/**
 * @swagger
 * /api/groups:
 *   post:
 *     summary: Create a new group
 *     tags: [Groups]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               image_url:
 *                 type: string
 *             example:
 *               title: "Group Name"
 *               description: "Description"
 *               image_url: "https://picsum.photos/id/26/200/200"
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
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *             example:
 *               success: true
 *               message: "Group created successfully"
 *               data:
 *                 id: 46
 *       400:
 *         description: Bad request
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
 *               missing-fields:
 *                 value:
 *                   success: false
 *                   message: "All fields are required: title, description"
 *               duplicate-group:
 *                 value:
 *                   success: false
 *                   message: "A group with this name already exists for this user"
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
 *             examples:
 *               error:
 *                 value:
 *                   success: false
 *                   message: "Internal Server Error"
 *                   data:
 *                     error: "Error message details here"
 */
router.post('/', createGroup);

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
 *                       creator_id:
 *                         type: integer
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       image_url:
 *                         type: string
 *                         nullable: true
 *                       created_on:
 *                         type: string
 *                         format: date-time
 *             example:
 *               success: true
 *               message: "Groups retrieved successfully"
 *               data: [
 *                 {
 *                   "id": 1,
 *                   "creator_id": 1,
 *                   "title": "Grupo de Juan",
 *                   "description": "Grupo creado por Juan Pérez",
 *                   "image_url": null,
 *                   "created_on": "2024-06-16T20:54:59.000Z"
 *                 },
 *                 {
 *                   "id": 2,
 *                   "creator_id": 2,
 *                   "title": "Grupo de María",
 *                   "description": "Grupo creado por María López",
 *                   "image_url": null,
 *                   "created_on": "2024-06-16T20:57:43.000Z"
 *                 },
 *                 {
 *                   "id": 3,
 *                   "creator_id": 5,
 *                   "title": "Grupo de Luis",
 *                   "description": "Grupo creado por Luis Martínez",
 *                   "image_url": null,
 *                   "created_on": "2024-06-16T21:10:01.000Z"
 *                 }
 *               ]
 */
router.get('/', getGroups);

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
 *                     creator_id:
 *                       type: integer
 *                     title:
 *                       type: string
 *                     description:
 *                       type: string
 *                     image_url:
 *                       type: string
 *                     created_on:
 *                       type: string
 *                       format: date-time
 *             example:
 *               success: true
 *               message: "Group retrieved successfully"
 *               data: 
 *                 id: 10
 *                 creator_id: 1
 *                 title: "Amantes de la administración"
 *                 description: "Para todos los que les gusta administrar todo lo que está vivo y lo que no está realmente vivo."
 *                 image_url: "https://picsum.photos/id/26/200/200"
 *                 created_on: "2024-06-17T00:49:25.000Z"
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
 */
router.get('/:id', getGroupById);

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
 *                       creator_id:
 *                         type: integer
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       image_url:
 *                         type: string
 *                         nullable: true
 *                       created_on:
 *                         type: string
 *                         format: date-time
 *             example:
 *               success: true
 *               message: "Groups retrieved successfully"
 *               data: [
 *                 {
 *                   id: 4,
 *                   creator_id: 7,
 *                   title: "Amantes de la administración",
 *                   description: "Para todos los que les gusta administrar todo lo que está vivo y lo que no está realmente vivo.",
 *                   image_url: null,
 *                   created_on: "2024-06-16T21:16:11.000Z"
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
 */
router.get('/creator/:creator_id', getGroupsByCreatorId);

/**
 * @swagger
 * /api/groups/{id}:
 *   put:
 *     summary: Update group
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
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               image_url:
 *                 type: string
 *             example:
 *               title: "Familia"
 *               description: "Grupo familiar"
 *               image_url: "https://example.com/image.jpg"
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
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   nullable: true
 *             example:
 *               success: true
 *               message: "Group updated successfully"
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
router.put('/:id', checkAdmin, updateGroup);

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
router.delete('/:id', checkAdmin, deleteGroup);


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
router.get('/:groupId/state', getGroupStateByGroupId);

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
router.post('/:id/activate', checkAdmin, activateGroup);



// router.post('/', createGroup);
//router.get('/',getGroups);
// router.get('/:id',getGroupById);
// router.get('/creator/:creator_id',getGroupsByCreatorId);
//router.put('/:id',checkAdmin, updateGroup);
//router.delete('/:id',checkAdmin, deleteGroup);
//router.get('/:groupId/state',getGroupStateByGroupId);
//router.post('/:id/activate',checkAdmin, activateGroup);

module.exports = router;
