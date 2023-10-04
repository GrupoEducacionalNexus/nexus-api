const Usuario = require('../models/usuarios');
const Auth = require('../models/auth');
const permissoes = require('../helpers/permissoes');

module.exports = app => {

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
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.secretaria) ||
        req.id_permissao.includes(permissoes.orientadores) || req.id_permissao.includes(permissoes.eventos) ||
        req.id_permissao.includes(permissoes.orientandos) || req.id_permissao.includes(permissoes.coordenador) ||
        req.id_permissao.includes(permissoes.diretor) || req.id_permissao.includes(permissoes.grupo_trabalho)
            || req.id_permissao.includes(permissoes.chamados) || req.id_permissao.includes(permissoes.convenios) || 
            req.id_permissao.includes(permissoes.professor) || req.id_permissao.includes(permissoes.alunos)) {
            const id = req.userId;
            Usuario.busca(id, res); 
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });

    app.get('/usuarios', Auth.verificaJWT,  (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.secretaria)) {
            Usuario.lista(res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });

    app.get('/usuarios/:id/permissoes', Auth.verificaJWT,  (req, res) => {
        const id = req.userId;
        Usuario.listaDePermissoes(id, res);
    });

    app.get('/usuarios/:id/notificacoes', Auth.verificaJWT,  (req, res) => {
        const id = req.userId;
        Usuario.listaDeNotificacoes(id, res);
    });

    app.get('/usuarios/:id/credenciamento', Auth.verificaJWT,  (req, res) => {
        const id = req.userId;
        Usuario.buscaSolicitacaoDeCredenciamento(id, res);
    });
}