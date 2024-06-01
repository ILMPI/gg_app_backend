# gg_app
Proyecto final - App Web para Compartir Gastos con amigos
BACKEND

## Configuración de Variables de Entorno

### Paso 1: Crear el archivo `.env`

1. En el directorio raíz de tu proyecto (donde se encuentra `package.json`), crea un nuevo archivo llamado `.env`.

2. Añade la configuración de conexión a la base de datos en el archivo `.env`.

**Ejemplo de archivo `.env`:**

\`\`\`plaintext
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_PORT=3306
DB_NAME=mydb
\`\`\`

Reemplaza `yourpassword` y otros valores de marcador de posición con tu configuración de base de datos real.

### Paso 3: Añadir `.env` a `.gitignore`

Para asegurarte de que el archivo `.env` no se comparta en tu repositorio de Git (por razones de seguridad), añádelo a tu archivo `.gitignore`.

1. Si no tienes ya un archivo `.gitignore` en el directorio raíz de tu proyecto, crea uno.

2. Añade la entrada `.env` al archivo `.gitignore`.

**Ejemplo de archivo `.gitignore`:**

\`\`\`plaintext
# Ignorar archivo de variables de entorno
.env

# Módulos de Node
node_modules/

# Otros archivos que quieres ignorar
\`\`\`

**Estructura del Directorio Raíz del Proyecto:**

\`\`\`plaintext
mi-proyecto/
│
├── src/
│   └── config/
│       └── db.js
│
├── .env
├── .gitignore
├── package.json
└── ...
\`\`\`
"""

