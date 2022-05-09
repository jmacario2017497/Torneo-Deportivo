const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const PartidoSchema = Schema({
    equipo1: {type: Schema.Types.ObjectId, ref: 'Equipos'},
    goles1: Number,
    equipo2: { type: Schema.Types.ObjectId, ref: 'Equipos'},
    goles2: Number,
    Liga:{type: Schema.Types.ObjectId, ref: 'Ligas'},
    Jornada:{ type: Schema.Types.ObjectId, ref: 'Jornadas'}
});

module.exports = mongoose.model('Partidos', PartidoSchema)