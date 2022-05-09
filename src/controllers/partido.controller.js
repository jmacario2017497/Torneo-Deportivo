const Partido = require('../models/partido.model')
const Equipo = require('../models/equipo.model')
const Liga = require('../models/liga.model')
const Jornada = require('../models/jornada.model')

function crearPartido(req, res){
    var parametros = req.body;
    var partidoModel = new Partido();
    var partidosMaximos = 0;

    if(parametros.equipo1 && parametros.equipo2){
        Jornada.findById(parametros.Jornada,(err, jornadaEncontrada)=>{
            if(err) return res.status(500).send({ mensaje: 'error en la peticion de jornada' });
            if(!jornadaEncontrada) return res.status(500).send({mensaje: 'no se encontro la jornada' });

            Equipo.findById(parametros.equipo1, {usuario: jornadaEncontrada.UsuarioCreador}, (err, equipo1Encontrado) => {
                if(err) return res.status(500).send({mensaje: 'error en la peticion de equipos 1'})
                if(!equipo1Encontrado) return res.status(500).send({mensaje: 'no se encontro este equipo en esta liga'})

                Equipo.findById({_id: parametros.equipo2, usuario: jornadaEncontrada.UsuarioCreador},(err, equipo2Encontrado)=>{
                    if(err) return res.status(500).send({ mensaje: 'error en la peticion de equipo 2' })
                    if(!equipo2Encontrado) return res.status(500).send({ mensaje: 'no se encontro este equipo en esta liga'})
                    console.log('el equipo 2 es' + equipo2Encontrado)
                    Liga.findById(equipo2Encontrado.idLiga,(err, ligaEncontrada)=>{

                        if(err) return res.status(500).send({ mensaje: 'error en la peticion de liga' })
                        if(!ligaEncontrada) return res.status(500).send({mensaje: 'no se encontro esta liga'})

                        if(req.user.sub != ligaEncontrada.usuarioCreador) return res.status(500).send({ mensaje: 'no puede realizar esta accion porque no es propietario de esta liga'})

                        Equipo.find({idLiga: ligaEncontrada._id},(err, equiposEncontrados)=>{
                            if(err) return res.status(500).send({ mensaje: 'error en la peticion' })
                            if(!equiposEncontrados) return res.status(500).send({mensaje: 'la liga no tiene equipos todavía'})

                            if(equiposEncontrados.length%2==0){
                                partidosMaximos = equiposEncontrados.length/2
                            }else{
                                partidosMaximos = (equiposEncontrados.length-1)/2

                            }

                            Partido.findOne({equipo1: parametros.equipo1, Jornada: parametros.Jornada}, (err, partidosEncontrados1)=>{
                                if(err) return res.status(500).send({ mensaje: 'error en la peticion en la jornada 1 equipo 1' })
                                if(!partidosEncontrados1){
                                    Partido.findOne({equipo2: parametros.equipo2, Jornada: parametros.Jornada},(err, partidosEncontrados2)=>{
                                        if(err) return res.status(500).send({ mensaje: 'error en la peticion' })
                                        if(!partidosEncontrados2){
                                            partidoModel.equipo1 = parametros.equipo1;
                                            partidoModel.goles1 = 0;
                                            partidoModel.equipo2 = parametros.equipo2;
                                            partidoModel.goles2 = 0;
                                            partidoModel.Liga = jornadaEncontrada.idLiga;
                                            partidoModel.Jornada = parametros.Jornada;

                                            partidoModel.save((err, partidoCreado)=>{
                                                if(err) return res.status(500).send({ mensaje: 'error en la peticion'})
                                                if(!partidoCreado) return res.status(500).send({ mensaje: 'no se puedo agregar el partido'})

                                                return res.status(200).send({partido: partidoCreado})
                                            })
                                        }else{
                                            return res.status(500).send({ mensaje: 'el equipo 2 ya ha jugado en esta jornada'})
                                        }

                                    })

                                }else{
                                    return res.status(500).send({ mensaje: 'el equipo 1 ya ha jugado en esta jornada'})
                                }

                            })

                        })
                    })

                })
            })

        })

    }else{
        return res.status(500).send({mensaje: 'debe de llenar todos los campos necesarios'})
    }
}

function editarPartido(req, res) {
    var parametros = req.body;
    var idPa = req.params.idPartido;

    if(parametros.equipo1 && parametros.equipo2){
        return res.status(500).send({mensaje: 'los equipo no se pueden modificar'})
    }else{
        Partido.findById(idPa, (err, partidoEncontrado)=>{
            if(err) return res.status(500).send({ mensaje: 'error en la peticion' })
            if(!partidoEncontrado) return res.status(500).send({ mensaje: 'no se encontro el partido buscado'})

            Liga.findById({_id: partidoEncontrado.Liga}, (err, ligaEncontrada)=>{
                if(err) return res.status(500).send({ mensaje: 'error en la peticion' })

                if(!ligaEncontrada) return res.status(500).send({ mensaje: 'no se encontro la liga del partido'})

                if(ligaEncontrada.usuarioCreador != req.user.sub) return res.status(500).send({ mensaje: 'no le pertenece la liga'})

                Partido.findByIdAndUpdate({_id: idPa}, parametros, {new: true}, (err, partidoActualizado)=>{
                    if(err) return res.status(500).send({ mensaje: 'error en la peticion' })

                    if(!partidoActualizado) return res.status(500).send({mensaje: 'error al tratar de actulizar el partido'})

                    var puntosEquipo1;
                    var puntosEquipo2;

                    if(partidoActualizado.goles1 > partidoActualizado.goles2){
                        puntosEquipo1 = 2;
                        puntosEquipo2 = 0;
                    }else if(partidoActualizado.goles1 < partidoActualizado.goles2){
                        puntosEquipo1 = 0;
                        puntosEquipo2 = 2
                    }else{
                        puntosEquipo1 = 1;
                        puntosEquipo2 = 1;
                    }

                    editarEquipo(puntosEquipo1, partidoActualizado.goles1, partidoActualizado.goles2, partidoActualizado.equipo1);
                    editarEquipo(puntosEquipo2, partidoActualizado.goles2, partidoActualizado.goles1, partidoActualizado.equipo2)
                    return res.status(200).send({Partido: partidoActualizado })
                })
            })
        })
    }
}

function editarEquipo(pts, golesF, golesC, idEquipo){
    var DG;

    Equipo.findByIdAndUpdate({_id: idEquipo}, {$inc: {golesFavor: golesF, golesContra: golesC, partidosJugados: 1, puntos: pts }}, {new: true}, (err, equipoActualizado)=>{
        if(err) return res.status(500).send({ mensaje: 'error en la peticion' })

        DG = equipoActualizado.golesFavor - equipoActualizado.golesContra

        Equipo.findByIdAndUpdate({ _id: idEquipo }, { $inc: { diferenciaGoles: DG } },(err, equipoModificado)=>{
            if(err) return res.status(500).send({ mens: 'error en la peticion' })
            if(!equipoModificado) return res.status(500).send({ mensaje: 'error al tratar de actulizar por segunda vez el equipo'})
        })
    })
}

module.exports = {
    crearPartido,
    editarPartido
}