const Usuario = require('../models/usuarios');
const Auth = require('../models/auth');
const permissoes = require('../helpers/permissoes');

module.exports = app => {

    app.post('/usuarios', (req, res) => {
        const usuario = req.body;
        Usuario.adiciona(usuario, (erro, resultados) => {
            if (erro) {
                console.error(erro);
                res.status(400).json({ status: 400, msg: "Erro ao cadastrar usuário!" });
                return
            }
            res.status(200).json({ status: 200, msg: "Usuário cadastrado com sucesso" });
        });
    });

    app.put('/usuarios/:id', Auth.verificaJWT, (req, res) => {
        const id = parseInt(req.params.id);
        const valores = req.body;
        Usuario.altera(id, valores, res);
    });

    app.get('/usuarios/:id', Auth.verificaJWT, (req, res) => {
        const id = req.userId;
        Usuario.buscaPorId(id, (erro, resultados) => {
            if (erro) {
                console.error(erro);
                res.status(400).json(erro);
                return
            }
            res.status(200).json({ status: 200, resultados });
        });
    });

    app.get('/usuarios', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.secretaria)) {
            Usuario.lista(res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });

    app.get('/usuarios/:id/permissoes', Auth.verificaJWT, (req, res) => {
        const id = req.params.id;
        Usuario.listaDePermissoes(id, res);
    });

    app.get('/usuarios/:id/notificacoes', Auth.verificaJWT, (req, res) => {
        const id = req.userId;
        Usuario.listaDeNotificacoes(id, res);
    });

    app.get('/usuarios/:id/credenciamento', Auth.verificaJWT, (req, res) => {
        const id = req.params.id;
        Usuario.buscaSolicitacaoDeCredenciamento(id, res);
    });
}