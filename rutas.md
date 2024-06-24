Format of the answers 
"{
  "success": true,
  "message": "",
  "data": {
    "id": 1,
    "name": "Name Surname",
    "email": "noname@gmail.com",
    "image_url": "/images/user.png",
    "state": "Active"
  }
}"

#API auth/users

    GET /api/auth/users Authorization : TOKEN Devuelve los usuarios

    GET /api/auth/users/:users_id Authorization : TOKEN Devuelve el usuario con id: users_id

#API GROUPS

    GET /api/groups Devuelve los grupos de la aplicacion

    GET /api/groups/:groups_id Devuelve el grupo con id: groups_id

    GET /api/groups/creator/:users_id Devuelve los grupos creados por el usuario con id: users_id

    GET /api/groups/users/:users_id Devuelve los grupos donde participa el usuario con id: user_id

    POST /api/groups Crea un nuevo grupo BODY: {creator_id, title, description, image_url}

#API EXPENSES

    GET /api/expenses/group/:groups_id Devuelve los gastos de un grupo con id: groups_id

    GET api/expenses/users/:users_id Devuelve los gastos de un usuario con id_ users_id

    POST /api/expenses Crea un nuevo gasto. Se asigna la parte correspondiente en expenses_asignaments a cada miembro del grupo, y se actualizan sus balances BODY: {groups_id, concept", amount, date, max_date, image_url, payer_user_id}

    PUT /api/expenses/expeses_id Actualiza los nuevos datos pasados, no se pueden actualizar el grupo, el monto del gasto, y el pagador, para ello, se avisara al usuario de borrar el gasto a cambiar e introducir el nuevo. BODY: {groups_id, concept, amount, date, max_date, image_url, payer_user_id}

    DELETE /api/expenses/expenses_id Borra el gasto con id: expenses_id. Se borran las asignaciones correspondientes a cada miembro del grupo y se recalculan y actualizan los balances

#API MEMBERSHIP

    GET /api/membership Devuelve todos los miembros

    GET /api/membership/group/:groups_id Devuelve todos los miembros de un grupo

    POST /api/membership Añade un miembro a un grupo BODY: {users_id, groups_id, status, balance}

    PUT /api/membership/users_id/groups_id Cambia el estado a Joined del miembro users_id del grupo groups_id

    DELETE /api/membership/users_id/groups_id Borra el miembro users_id del grupo groups_id. Solo se puede borrar si su balance es cero, no le debe a ningun miembro, ni ningun miembro le debe a él

#API NOTIFICATIONS

    GET /api/notifications Devuelve todas las notificaciones

    GET /api/notifications/:users_id Devuelve todas las notificaciones de un usuario

    GET /api/notifications/:users_id/groups_id Devuelve todas las notificaciones de un usuario users_id en un grupo groups_id

    POST /api/notifications Crea una notificacion BODY: { users_id, status, date, title, description, group_id, expense_id}

    PUT /api/notifications/:id Update de la notificacion :id. BODY: { users_id, status, date, title, description, group_id, expense_id}

    PUT /api/notifications/changestatus/:users_id/:groups_id Pone todas las notificaciones de un usuario users_id en un grupo groups_id con el status 'Read'

    PUT /api/notifications/changestatus/:id Pone la notificacion id con el status 'Read'

    DELETE /api/notifications/:id Borra la notificacion :id
   
    DELETE /api/notifications/users_id/groups_id Borra las notificaciones del usuario users_id que tenga del grupo groups_id.



