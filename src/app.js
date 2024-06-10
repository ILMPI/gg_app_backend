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
    res.status(500).json({ error: err.message });
});

module.exports = app;
