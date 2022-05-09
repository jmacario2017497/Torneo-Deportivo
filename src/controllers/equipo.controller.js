const Equipo = require('../models/equipo.model');

function agregarEquipo(req, res) {
    var parametros = req.body;
    var equipoModel = new Equipo();

    if (req.user.rol !== "Administrador") {
        Equipo.find({ idLiga: parametros.idLiga }, (err, EquiposEncontrados) => {
            if (EquiposEncontrados.length >= 10) {
                return res.status(500).send({ mensaje: 'la liga esta llena' })
            } else {
                if (parametros.nombre) {
                    equipoModel.nombre = parametros.nombre
                    equipoModel.golesFavor = parametros.golesFavor;
                    equipoModel.golesContra = parametros.golesContra;
                    equipoModel.diferenciaGoles = parametros.diferenciaGoles;
                    equipoModel.partidosJugados = parametros.partidosJugados;
                    equipoModel.puntos = parametros.puntos;
                    equipoModel.idLiga = parametros.idLiga;
                    equipoModel.usuario = req.user.sub;

                    Equipo.findOne({ nombre: parametros.nombre, idLiga: parametros.idLiga }, (err, equipoEncontrado) => {
                        if (err) return res.status(500).send({ mensaje: 'error en la peticion' })
                        if (!equipoEncontrado) {
                            equipoModel.save((err, equipoAgregado) => {
                                if (err) return res.status(500).send({ mensaje: 'error en la petcion' })
                                if (!equipoAgregado) return res.status(500).send({ mensaje: 'error al intentar guardar el equipo' })

                                return res.status(200).send({ Equipo: equipoAgregado })
                            })

                        } else {
                            return res.status(500).send({ mensaje: 'este equipo ya existe en una misma liga' })
                        }
                    })

                } else {
                    return res.status(500).send({ mensaje: 'debe de llenar todos los campos necesarios' })

                }

            }

        })

    } else {
        Equipo.find({ idLiga: parametros.idLiga }, (err, EquiposEncontrados) => {
            if (EquiposEncontrados.length >= 10) {
                return res.status(500).send({ mensaje: 'la liga esta llena' })
            } else {
                if (parametros.nombre) {
                    equipoModel.nombre = parametros.nombre
                    equipoModel.golesFavor = parametros.golesFavor;
                    equipoModel.golesContra = parametros.golesContra;
                    equipoModel.diferenciaGoles = parametros.diferenciaGoles;
                    equipoModel.partidosJugados = parametros.partidosJugados;
                    equipoModel.puntos = parametros.puntos;
                    equipoModel.idLiga = parametros.idLiga;
                    equipoModel.usuario = parametros.usuario;

                    Equipo.findOne({ nombre: parametros.nombre, idLiga: parametros.idLiga }, (err, equipoEncontrado) => {
                        if (err) return res.status(500).send({ mensaje: 'error en la peticion' })
                        if (!equipoEncontrado) {
                            equipoModel.save((err, equipoAgregado) => {
                                if (err) return res.status(500).send({ mensaje: 'error en la petcion' })
                                if (!equipoAgregado) return res.status(500).send({ mensaje: 'error al intentar guardar el equipo' })

                                return res.status(200).send({ Equipo: equipoAgregado })
                            })

                        } else {
                            return res.status(500).send({ mensaje: 'este equipo ya existe en una misma liga' })
                        }
                    })

                } else {
                    return res.status(500).send({ mensaje: 'debe de llenar todos los campos necesarios' })

                }

            }

        })

    }

}

function editarEquipo(req, res) {
    var parametros = req.body;
    var idEq = req.params.idEquipo

    if (req.user.rol !== "Administrador") {
        Equipo.findOne({ _id: idEq, idLiga: parametros.idLiga }, (err, equipoEncontrado) => {
            if (err) return res.status(500).send({ mensaje: 'error en la peticion' })
            if (equipoEncontrado) {
                if (equipoEncontrado.usuario != req.user.sub) {
                    return res.status(500).send({ mensaje: 'no puede esditar equipos que no sean suyos' })
                } else {
                    if (parametros.usuario) {
                        return res.status(500).send({ mensaje: 'no puede editar el usuario asociado' })
                    } else {
                        Equipo.findByIdAndUpdate(idEq, parametros, { new: true }, (err, equipoModificado) => {
                            if (err) return res.status(500).send({ mensaje: 'error en la petcion' })
                            if (!equipoModificado) return res.status(500).send({ mensaje: 'no se encontro ningun equipo con este ID' })

                            return res.status(200).send({ equipo: equipoModificado })
                        })

                    }


                }

            } else {
                return res.status(500).send({ mensaje: 'no se encontro ningun equipo con este ID en esta liga' })
            }
        })

    } else {
        Equipo.findByIdAndUpdate(idEq, parametros, { new: true }, (err, equipoModificado) => {
            if (err) return res.status(500).send({ mensaje: 'error en la petcion' })
            if (!equipoModificado) return res.status(500).send({ mensaje: 'no se encontro ningun equipo con este ID' })

            return res.status(200).send({ equipo: equipoModificado })
        })
    }
}

function elimnarEquipo (req, res){
    var idEq = req.params.idEquipo;

    if(req.user.rol !== "Administrador"){
        Equipo.findOne({ _id: idEq}, (err, equipoEncontrado) => {
            if(err) return res.status(500).send({mensaje: 'error en la peticion'})
            if(!equipoEncontrado) return res.status(500).send({ mensaje: 'no se encontro ningun equipo con este ID'})
            if(equipoEncontrado.usuario != req.user.sub){
                return res.status(500).send({ mensaje: 'no puede eliminar equipos que no le pertenezcan'})
            }else{
                Equipo.findByIdAndDelete(idEq, (err, equipoEliminado)=>{
                    if(err) return res.status(500).send({ mensaje: 'error en la peticion'})
                    //if(!equipoEliminado) return res.status(500).send({ mensaje: 'no se encontro ningun equipo con este ID'})

                    return res.status(200).send({equipo: equipoEliminado})
                })
            }
        })

    }else{
        Equipo.findByIdAndDelete(idEq, (err, equipoEliminado)=>{
            if(err) return res.status(500).send({ mensaje: 'error en la peticion'})
            if(!equipoEliminado) return res.status(500).send({ mensaje: 'no se encontro ningun equipo con este ID'})

            return res.status(200).send({equipo: equipoEliminado})
        })

    }
}

function buscarEquipos(req, res){
    if(req.user.rol !== "Administrador"){
        Equipo.find({usuario: req.user.sub},(err, equiposEncontrados)=>{
            if(err) return res.status(500).send({ mensaje: 'error en la peticion'})
            if(!equiposEncontrados) return res.status(500).send({ mensaje: 'no posee ningun equipo'})

            return res.status(200).send({equipos: equiposEncontrados})
        })

    }else{
        Equipo.find((err, equiposEncontrados)=>{
            if(err) return res.status(500).send({ mensaje: 'error en la peticion'})
            if(!equiposEncontrados) return res.status(500).send({mensaje: 'no existe ningun equipo'})

            return res.status(200).send({equipos: equiposEncontrados})
        })

    }
}

function buscarEquiporId (req, res){
    var idEq = req.params.idEquipo
    var parametros = req.body;

    if(req.user.rol !== "Administrador"){
        Equipo.findOne({_id: idEq, idLiga: parametros.idLiga},(err, equipoEncontrado)=>{
            if(err) return res.status(500).send({ mensaje: 'error en la peticion'})
            //if(!equipoEncontrado) return res.status(500).send({ mensaje: 'no se encontro ningun equipo con ese ID en esta liga'})
             if(equipoEncontrado){
                if(equipoEncontrado.usuario != req.user.sub){
                    return res.status(500).send({ mensaje: 'no puede visualizar equipos que no le pertenezcan'})

                }else{
                    return res.status(200).send({ equipos: equipoEncontrado})

                }
             }else{
                return res.status(500).send({ mensaje: 'no se encontro ningun equipo con ese ID en esta liga'})
             }
        })

    }else{
        Equipo.findById(idEq, (err, equipoEncontrado)=>{
            if(err) return res.status(500).send({ mensaje: 'error en la peticion'})
            if(!equipoEncontrado) return res.status(500).send({ mensaje: 'no se encontro ningun equipo con este ID en ninguna liga'})

            return res.status(200).send({equipo: equipoEncontrado})
        })

    }
}

module.exports = {
    agregarEquipo,
    editarEquipo,
    elimnarEquipo,
    buscarEquipos,
    buscarEquiporId
}