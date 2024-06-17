# gg_app
Proyecto final - App Web para Compartir Gastos con amigos
BACKEND

### Instrucciones de Instalación y Ejecución
1. Clonar el repositorio.
2. Crear o copiar el archivo .env.
3. Instalar dependencias:
`npm install`
4. Actualizar dependencias:
`npm update`

5. Configuración de Variables de Entorno

### Paso 1: Crear el archivo `.env`

1. En el directorio raíz de tu proyecto (donde se encuentra `package.json`), crea un nuevo archivo llamado `.env`.

2. Añade la configuración de conexión a la base de datos y el secreto JWT en el archivo `.env`.

**Ejemplo de archivo `.env`:**

```json
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_PORT=3306
DB_NAME=ggapp
PORT=3000
JWT_SECRET=your_generated_secret_key
```
Reemplaza yourpassword y otros valores de marcador de posición con tu configuración de base de datos real.

6. Iniciar la aplicación:
`npm start`
# o
`npm run dev`

### Troubleshooting:
### Si no funciona:
1. Eliminar `node_modules/`
2. Eliminar `package-lock.json`
3. Eliminar `package.json`
4. Reiniciar el proyecto:
`npm init -y`
`npm install bcryptjs cors dotenv express express-validator jsonwebtoken mysql2 nodemon dayjs swagger-jsdoc swagger-ui-express --save`
`npm start`
5. Para iniciar con npm run dev:

En el archivo `package.json`, asegurate de tener los scripts configurados así:
```json
"scripts": {
    //...//
  "start": "node index.js",
  "dev": "nodemon index.js"
}
```


### Como ñadir `.env` a `.gitignore`

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
### * 
Si desea ignorar un archivo que ya está registrado, debe eliminar el seguimiento del archivo antes de agregar una regla para ignorarlo. 
Desde tu terminal:

`git rm --cached FILENAME`

