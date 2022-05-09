const express = require('express');
const partidoController = require('../controllers/partido.controller')
const md_autenticacion = require('../middlewares/autenticacion')
const verificarRol = require('../middlewares/rol')

const api = express.Router();

api.post('/agregarPartido', [md_autenticacion.Auth, verificarRol.usuario], partidoController.crearPartido)
api.put('/editarPartido/:idPartido', [md_autenticacion.Auth, verificarRol.usuario], partidoController.editarPartido)

module.exports = api;