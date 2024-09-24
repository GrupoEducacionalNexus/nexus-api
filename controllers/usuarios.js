// nexus-api/controllers/usuarios.js
const Usuario = require('../models/usuarios');
const Auth = require('../models/auth');
const permissoes = require('../helpers/permissoes');

module.exports = (app) => {

    const verificarPermissoes = (
        req,
        permissoesPermitidas,
        res,
        callback
    ) => {
        const temPermissao = permissoesPermitidas.some(permissao =>
            req.id_permissao.includes(permissao)
        );
        if (temPermissao) {
            callback();
        } else {
            res.status(400).send({
                auth: false,
                permissoes: false,
                message: 'Você não tem permissão para acessar essa página.'
            });
        }
    };

    app.post('/usuarios', (req, res) => {
        const usuario = req.body;
        Usuario.adiciona(usuario, res);
    });

    app.put('/usuarios/:id', Auth.verificaJWT, (req, res) => {
        const id = parseInt(req.params.id);
        const valores = req.body;
        Usuario.altera(id, valores, res);
    });

    app.get('/usuarios/:id', Auth.verificaJWT, (req, res) => {
        verificarPermissoes(
            req, [
            permissoes.admin,
            permissoes.secretaria,
            permissoes.orientadores,
            permissoes.eventos,
            permissoes.orientandos,
            permissoes.coordenador,
            permissoes.diretor,
            permissoes.grupo_trabalho,
            permissoes.chamados,
            permissoes.convenios,
            permissoes.professor,
            permissoes.alunos
        ],
            res, () => {
                const id = req.userId;
                Usuario.busca(id, res);
            });
    });

    app.get('/usuarios', Auth.verificaJWT, (req, res) => {
        verificarPermissoes(
            req,
            [
                permissoes.admin,
                permissoes.secretaria
            ],
            res, () => {
                Usuario.lista(res);
            });
    });

    app.get('/usuarios/:id/permissoes', Auth.verificaJWT, (req, res) => {
        const id = req.userId;
        Usuario.listaDePermissoes(id, res);
    });

    app.get('/usuarios/:id/notificacoes', Auth.verificaJWT, (req, res) => {
        const id = req.userId;
        Usuario.listaDeNotificacoes(id, res);
    });

    app.get('/usuarios/:id/credenciamento', Auth.verificaJWT, (req, res) => {
        const id = req.userId;
        Usuario.buscaSolicitacaoDeCredenciamento(id, res);
    });
}