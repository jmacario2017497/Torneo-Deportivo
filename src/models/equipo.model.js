const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const EquipoSchema = Schema({
    nombre: String,
    golesFavor: Number,
    golesContra: Number,
    diferenciaGoles: Number,
    partidosJugados: Number,
    puntos: Number,
    idLiga: { type: Schema.Types.ObjectId, ref: 'Ligas' },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuarios' }
})

module.exports = mongoose.model('Equipos', EquipoSchema)