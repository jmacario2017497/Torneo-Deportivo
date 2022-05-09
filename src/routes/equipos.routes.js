const express = require('express');
const equipoController = require('../controllers/equipo.controller')
const md_autenticacion = require('../middlewares/autenticacion')
const verificarRol = require('../middlewares/rol')

const api = express.Router();

api.post('/agregarEquipo', md_autenticacion.Auth, equipoController.agregarEquipo);
api.put('/editarEquipo/:idEquipo', md_autenticacion.Auth , equipoController.editarEquipo);
api.delete('/eliminarEquipo/:idEquipo', md_autenticacion.Auth, equipoController.elimnarEquipo)
api.get('/buscarEquipos', md_autenticacion.Auth, equipoController.buscarEquipos)
api.get('/buscarEquiposId/:idEquipo', md_autenticacion.Auth, equipoController.buscarEquiporId)
module.exports = api;