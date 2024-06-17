const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

//Metadata info about our API
const options = {
    definition: {
        openapi: '3.0.0',
        info: { title: 'GGAPP API', version: '1.0.0' },
    },
    apis: [        
        'src/routes/api.js', 
        'src/routes/api/auth.js', 
        'src/routes/api/expenses.js', 
        'src/routes/api/groups.js', 
        'src/routes/api/memberships.js', 
        'src/routes/api/notifications.js', 
        'src/routes/api/users.js'
    ],
};

//Docs en JSON format
const swaggerSpec = swaggerJSDoc(options);

//Function to setup our docs
const swaggerDocs = ( app, port ) => {
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.get('/api/docs.json', (req,res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });

    console.log(`V.1 Docs are available at http://localhost:${port}/api/docs`)
};

module.exports = { swaggerDocs };