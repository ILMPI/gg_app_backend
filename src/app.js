// Creación y configuración de la APP de Express
const express = require('express');
const cors = require('cors');
const routes = require('./routes/api');

const app = express();
app.use(express.json());
app.use(cors());

// Config db
require('./config/db');

// Configuración de rutas
app.use('/api', routes);

// Middleware error
app.use((err, req, res, next) => {
    if (!res.headersSent) {
        let statusCode = 500;
        let message = 'Internal Server Error';
        let errorDetails = null;

        if (err.name === 'ValidationError') {
            statusCode = 400;
            message = 'Validation Error';
            errorDetails = err.errors;
        } else if (err.name === 'UnauthorizedError') {
            statusCode = 401;
            message = 'Unauthorized';
        } else {
            errorDetails = err.message;
        }

        res.status(statusCode).json({
            success: false,
            message: message,
            data: {
                error: errorDetails
            }
        });
    } else {
        next(err);
    }
});
// // Middleware error
// app.use((err, req, res, next) => {
//     res.json({ error: err.message });
// });


module.exports = app;
