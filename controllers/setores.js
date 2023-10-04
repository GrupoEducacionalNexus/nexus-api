const Setores = require('../models/setores');
const Auth = require('../models/auth');
const permissoes = require('../helpers/permissoes');

module.exports = app => {
    app.get('/setores', Auth.verificaJWT, (req, res) => {
        const id_setor = req.id_setor;
        Setores.lista(id_setor, res);
    });

    app.get('/setores/:id/chamados', Auth.verificaJWT, (req, res) => {
        const id_setor = req.params.id;
        const id_usuario = req.userId;
        const tipo = Number(req.query.tipo);
        const filtro = req.query;
        Setores.listaDeChamados(id_setor, id_usuario, tipo, filtro, req.id_permissao, res);
    });

    app.get('/setores/:id/tipos_chamados', Auth.verificaJWT, (req, res) => {
        const id = req.params.id;
        Setores.listaDeTiposDeChamados(id, res);
    });

    app.get('/setores/:id/usuarios', Auth.verificaJWT, (req, res) => {
        const id = req.params.id;
        Setores.listaDeUsuarios(id, res);
    });
} 