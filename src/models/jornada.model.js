const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const JornadaSchema = Schema({
    numeroJornada: String,
    idLiga:{type: Schema.Types.ObjectId, ref: 'Ligas'},
    UsuarioCreador: { type: Schema.Types.ObjectId, ref: 'Usuarios'}
})

module.exports = mongoose.model('Jornadas', JornadaSchema)