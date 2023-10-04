const Auth = require('../models/auth');
const Comentario = require('../models/comentarios');
const permissoes = require('../helpers/permissoes');


module.exports = app => {
    app.post('/comentarios', Auth.verificaJWT, (req, res) => {
        const id_usuario = req.userId;
        const id_setor = req.id_setor;
        Comentario.adiciona({ ...req.body, id_usuario, nome_usuario: req.nome, id_setor }, res);
    });
}      