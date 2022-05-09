const express = require('express');
const jornadaController = require('../controllers/jornada.controller')
const md_autenticacion = require('../middlewares/autenticacion')
const verificarRol = require('../middlewares/rol')

const api = express.Router();

api.post('/agregarJornadas', md_autenticacion.Auth, jornadaController.crearJornada)

module.exports = api;