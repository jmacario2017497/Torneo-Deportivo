exports.administrador = function (req, res, next) {
    if(req.user.rol !== "Administrador") return res.status(400).send({mensaje: "no tiene los permisos para realizar esta accion"})
    next();
}

exports.usuario = function (req, res, next) {
    if(req.user.rol !== "Usuario") return res.status(400).send({mensaje: "no puede realizar esta accion"})
    next();
}