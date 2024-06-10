# gg_app
Proyecto final - App Web para Compartir Gastos con amigos
BACKEND

## Configuración de Variables de Entorno

### Paso 1: Crear el archivo `.env`

1. En el directorio raíz de tu proyecto (donde se encuentra `package.json`), crea un nuevo archivo llamado `.env`.

2. Añade la configuración de conexión a la base de datos y el secreto JWT en el archivo `.env`.

**Ejemplo de archivo `.env`:**

```plaintext
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_PORT=3306
DB_NAME=ggapp
PORT=3000
JWT_SECRET=your_generated_secret_key
```
Reemplaza yourpassword, your_generated_secret_key y otros valores de marcador de posición con tu configuración de base de datos real.

### Paso 2. Generar el JWT_SECRET

Utilizando Node.js

Ejecuta el siguiente comando en tu terminal para generar una clave secreta:

`node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

### Paso 3: Añadir `.env` a `.gitignore`

Para asegurarte de que el archivo .env no se comparta en tu repositorio de Git (por razones de seguridad), añádelo a tu archivo .gitignore.

    Si no tienes ya un archivo `.gitignore` en el directorio raíz de tu proyecto, crea uno.

    Añade la entrada .env al archivo .gitignore.

Ejemplo de archivo .gitignore:

```plaintext
# Ignorar archivo de variables de entorno
.env

# Módulos de Node
node_modules/

# Otros archivos que quieres ignorar
peticiones.rest
```
### * Si desea ignorar un archivo que ya está registrado, debe eliminar el seguimiento del archivo antes de agregar una regla para ignorarlo. Desde tu terminal, rastrea el archivo.

`git rm --cached FILENAME`

```plaintext
API Endpoints:

    User Endpoints:
        Register: POST /api/auth/register
        Login: POST /api/auth/login
        Get All Users /api/auth/users
        Get User by ID: GET /api/users/:id
        Update User: PUT /api/users/:id
        Delete User: DELETE /api/users/:id
        Search User by Email: GET /api/users/search/:email

    Group Endpoints:
        Get All Groups: GET /api/groups
        Get Group by ID: GET /api/groups/:id
        Get Groups by Creator ID: GET /api/groups/creator/:creator_id
        Create Group: POST /api/groups

    Membership Endpoints:
        Get All Members of a Group: GET /api/membership/group/:group_id
        Add Member to Group: POST /api/membership
        Update Membership Status: PUT /api/membership/:user_id/:group_id
        Delete Membership: DELETE /api/membership/:user_id/:group_id

    Expense Endpoints:
        Get All Expenses for a Group: GET /api/expenses/group/:group_id
        Create Expense: POST /api/expenses
        Update Expense: PUT /api/expenses/:id
        Delete Expense: DELETE /api/expenses/:id

    Expense Assignment Endpoints:
        Get All Expense Assignments: GET /api/expense-assignments/expense/:expense_id
        Create Expense Assignment: POST /api/expense-assignments
        Update Expense Assignment: PUT /api/expense-assignments/:user_id/:expense_id
        Delete Expense Assignment: DELETE /api/expense-assignments/:user_id/:expense_id

    Invitation Endpoints:
        Get All Invitations: GET /api/invitations
        Create Invitation: POST /api/invitations
        Update Invitation: PUT /api/invitations/:id
        Delete Invitation: DELETE /api/invitations/:id

    Notification Endpoints:
        Get All Notifications for a User: GET /api/notifications/user/:user_id
        Create Notification: POST /api/notifications
        Update Notification: PUT /api/notifications/:id
        Delete Notification: DELETE /api/notifications/:id

I
