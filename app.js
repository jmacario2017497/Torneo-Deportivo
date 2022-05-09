const express = require('express');
const cors = require('cors');
var app = express();

const rutasUsuarios = require('./src/routes/usuario.routes')
const rutasLiga = require('./src/routes/liga.routes')
const rutasEquipo = require('./src/routes/equipos.routes')
const rutasJornada = require('./src/routes/jornada.routes')
const rutasPartido = require('./src/routes/partido.routes')

app.use(express.urlencoded({extended: false}))
app.use(express.json());
app.use(cors());

app.use('/api', rutasUsuarios, rutasLiga, rutasEquipo, rutasJornada, rutasPartido);

module.exports = app;