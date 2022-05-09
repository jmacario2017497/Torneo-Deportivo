const Liga = require('../models/liga.model')
const Equipo = require('../models/equipo.model')

function agregarLiga(req, res) {
    var parametros = req.body;
    var ligaModel = new Liga();

    if (parametros.nombreLiga) {
        Liga.findOne({ nombreLiga: { $regex: parametros.nombreLiga, $options: 'i' } }, (err, ligaEncontrada) => {
            if (err) return res.status(500).send({ mensaje: "Error en la peticion" });

            if (ligaEncontrada) {
                return res.status(500).send({ mensaje: "esta liga ya se encuentra registrada" })
            } else {
                ligaModel.nombreLiga = parametros.nombreLiga;
                ligaModel.usuarioCreador = req.user.sub;

                ligaModel.save((err, ligaAgregada) => {
                    if (err) return res.status(500).send({ mensaje: 'error en la peticion' })
                    if (!ligaAgregada) return res.status(500).send({ mensaje: 'no se pudo agregar la liga de manera correcta' })

                    return res.status(200).send({ liga: ligaAgregada })
                })
            }

        })
    } else {
        return res.status(500).send({ mensaje: 'debe de llenar todos los campos' })

    }


}

function editarLiga(req, res) {
    var idLi = req.params.idLiga
    var parametros = req.body;

    if (req.user.rol !== "Administrador") {
        Liga.findById(idLi, (err, ligaEncontrada) => {
            if (err) return res.status(500).send({ mensaje: 'error en la peticion' })
            if (ligaEncontrada) {
                if (ligaEncontrada.usuarioCreador != req.user.sub) {
                    return res.status(500).send({ mensaje: 'no puede editar ligas que no sean suyas' })
                } else {
                    if (parametros.usuarioCreador) {
                        return res.status(500).send({ mensaje: 'no puede cambiar el codigo de creador' })
                    } else {

                        Liga.findByIdAndUpdate(idLi, parametros, { new: true }, (err, ligaActualizado) => {
                            if (err) return res.status(500).send({ mensaje: 'error en la peticion' })
                            if (!ligaActualizado) return res.status(500).send({ mensaje: 'error al editar la liga' })
                            return res.status(200).send({ Liga: ligaActualizado })
                        })

                    }


                }
            } else {
                return res.status(500).send({ mensaje: 'esta liga no existe' })
            }
        })

    } else {
        Liga.findByIdAndUpdate(idLi, parametros, { new: true }, (err, ligaActualizado) => {
            if (err) return res.status(500).send({ mensaje: 'error en la peticion' })
            if (!ligaActualizado) return res.status(500).send({ mensaje: 'error al editar la liga' })
            return res.status(200).send({ Liga: ligaActualizado })
        })

    }

}

function eliminarLiga(req, res) {
    var idLi = req.params.idLiga;

    if (req.user.rol !== "Administrador") {
        Liga.findById(idLi, (err, ligaEncontrada) => {
            if (err) return res.status(500).send({ mensaje: 'error en la peticion' })
            if (ligaEncontrada) {
                if (ligaEncontrada.usuarioCreador != req.user.sub) {
                    return res.status(500).send({ mensaje: 'no puede eliminar ligas que no sean suyas' })
                } else {
                    Liga.findByIdAndDelete(idLi, (err, ligaEliminada) => {
                        if (err) return res.status(500).send({ mensaje: 'error en la peticion' })
                        if (!ligaEliminada) return res.status(500).send({ mensaje: 'error al eliminar la liga' })
                        return res.status(200).send({ Liga: ligaEliminada })
                    })
                }
            } else {
                return res.status(500).send({ mensaje: 'esta liga no existe' })
            }
        })

    } else {

        Liga.findByIdAndDelete(idLi, (err, ligaEliminada) => {
            if (err) return res.status(500).send({ mensaje: 'error en la peticion' })
            if (!ligaEliminada) return res.status(500).send({ mensaje: 'error al eliminar la liga' })
            return res.status(200).send({ Liga: ligaEliminada })
        })

    }
}

function buscarLigaId (req, res) {
    var idLi = req.params.idLiga;

    if(req.user.rol !== "Administrador"){
        Liga.findById(idLi, (err, ligaEncontrada) => {
            if (err) return res.status(500).send({ mensaje: 'error en la peticion' })
            if (ligaEncontrada) {
                if (ligaEncontrada.usuarioCreador != req.user.sub) {
                    return res.status(500).send({ mensaje: 'no puede visualizar ligas que no sean suyas' })
                } else {
                    Equipo.find({idLiga: idLi},(err, equiposEncontrados)=>{
                        if(err) return res.status(500).send({ mensaje: 'error en la peticion' })
                        if(!equiposEncontrados) return res.status(500).send({ mensaje: 'no se encontraron equipos en esta liga'})

                        return res.status(200).send({ Liga: ligaEncontrada, equipos: equiposEncontrados})
                    }).sort({
                        puntos: -1
                    })
                    
                }
            } else {
                return res.status(500).send({ mensaje: 'esta liga no existe' })
            }
        })


    }else{
        Liga.findById(idLi, (err, ligaEncontrada)=> {
            if(err) return res.status(500).send({ mensaje: 'error en la peticion'})
            if(!ligaEncontrada) return res.status(500).send({ mensaje: 'no existe esta ligas' })
            Equipo.find({idLiga: idLi},(err, equiposEncontrados)=>{
                if(err) return res.status(500).send({ mensaje: 'error en la peticion' })
                if(!equiposEncontrados) return res.status(500).send({ mensaje: 'no se encontraron equipos en esta liga'})

                return res.status(200).send({ Liga: ligaEncontrada, equipos: equiposEncontrados})
            }).sort({
                puntos: -1
            })
        })

    }
}

function buscarLiga (req, res) {

    if(req.user.rol !== "Administrador"){
        Liga.find({usuarioCreador: req.user.sub},(err, ligasEncontrada) => {
            if (err) return res.status(500).send({ mensaje: 'error en la peticion' })
            if(!ligasEncontrada) return res.status(500).send({ mensaje: 'no existe ninguna liga '})

            
            return res.status(200).send({ligas: ligasEncontrada})
        })


    }else{
        Liga.find((err, ligasEncontrada)=> {
            if(err) return res.status(500).send({ mensaje: 'error en la peticion'})
            if(!ligasEncontrada) return res.status(500).send({ mensaje: 'no existe esta ligas' })
            return res.status(200).send({Ligas: ligasEncontrada})
        })

    }

}


module.exports = {
    agregarLiga,
    editarLiga,
    eliminarLiga,
    buscarLigaId,
    buscarLiga
}