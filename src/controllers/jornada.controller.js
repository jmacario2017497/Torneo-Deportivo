const Jornada = require('../models/jornada.model')
const Equipo = require('../models/equipo.model');
const Liga = require('../models/liga.model')
const Usuario = require('../models/usuario.model')

function crearJornada(req, res) {
    var parametros = req.body;
    var jornadaModel = new Jornada();
    var jornadasMaximas;

    if (req.user.rol !== "Administrador") {
        Equipo.find({idLiga: parametros.idLiga}, (err, equiposEncontrados) => {
            console.log('cantidad de equipos '+ equiposEncontrados.length)
            if (err) return res.status(500).send({ mensasje: 'error en la peticion' })
            if (equiposEncontrados) {
                if (equiposEncontrados.length%2 == 0) {
                    console.log('cantidad de equipos encontrados '+equiposEncontrados.length)
                    jornadasMaximas = equiposEncontrados.length-1
                } else {
                    console.log('cantidad de equipos encontrados'+equiposEncontrados.length)
                    jornadasMaximas = equiposEncontrados.length;
                }

                Liga.findOne({_id: parametros.idLiga, usuarioCreador: req.user.sub }, (err, ligaEncontrada) => {
                    if (err) return res.status(500).send({ mensasje: 'error en la peticion' });
                    if (ligaEncontrada) {
                        Jornada.find({idLiga: ligaEncontrada._id},(err, jornadasEncontradas) => {
                            if (err) return res.status(500).send({ mensaje: 'error en la peticion' })
                            if (jornadasEncontradas.length >= jornadasMaximas) {
                                console.log('jornadas encontradas' + jornadasEncontradas.length);
                                return res.status(500).send({ mensaje: 'en esta liga solo puede haber ' + jornadasMaximas + ' jornadas maximas' })
                            } else {
                                if(parametros.numeroJornada){
                                    jornadaModel.numeroJornada = parametros.numeroJornada;
                                    jornadaModel.idLiga = parametros.idLiga;
                                    jornadaModel.UsuarioCreador = req.user.sub;

                                    jornadaModel.save((err, jornadaCreada)=>{
                                        if(err) return res.status(500).send({mensaje: 'error en la peticion'})
                                        if(!jornadaCreada) return res.status(500).send({mensaje: 'errro al intentar crear la jornada'})

                                        return res.status(200).send({jornada: jornadaCreada})
                                    })
                                }else{
                                    return res.status(500).send({ mensaje: 'debe de llenar todo los campos'})
                                }
                            }
                        })

                    } else {
                        return res.status(500).send({ mensaje: 'usted no es propietario de esta liga' })
                    }
                })





            } else {
                return res.status(500).send({ mensaje: 'no existen equipos en esta liga' })
            }
        })

    } else {
        return res.status(500).send({ mensaje: 'usted no  puede agregar jornadas'})
    }
}

module.exports ={
    crearJornada
}