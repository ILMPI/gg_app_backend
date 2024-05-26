// Creación y configuración de la APP de Express
const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Configuración de rutas

app.use('/api', require('./routes/api'));

// Middleware error
app.use ((err, req, res, next)=>{
    res.status(500).json({error: err.message});
})

module.exports = app;