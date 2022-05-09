const express = require('express');
const ligaController = require('../controllers/liga.controller')
const md_autenticacion = require('../middlewares/autenticacion')
const verificarRol = require('../middlewares/rol')


const api = express.Router();

api.post('/agregarLiga', md_autenticacion.Auth, ligaController.agregarLiga);
api.put('/editarLiga/:idLiga', md_autenticacion.Auth, ligaController.editarLiga)
api.delete('/eliminarLiga/:idLiga', md_autenticacion.Auth, ligaController.eliminarLiga)
api.get('/buscarLigaId/:idLiga', md_autenticacion.Auth, ligaController.buscarLigaId)
api.get('/buscarLigas', md_autenticacion.Auth, ligaController.buscarLiga)
module.exports = api;