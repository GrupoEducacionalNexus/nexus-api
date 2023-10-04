const Auth = require('../models/auth');
const Evento = require('../models/eventos');
const permissoes = require('../helpers/permissoes');

module.exports = app => {
    app.post('/eventos', Auth.verificaJWT, (req, res) => {
        const evento = req.body;
        Evento.adiciona(evento, res);
    });

    app.get('/eventos', (req, res) => {
        Evento.lista(res);
    });

    app.get('/eventos/:id/membros', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.secretaria)) {
            const idEvento = req.query.idEvento;
            Evento.listaMembros(idEvento, res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });

    app.get('/eventos/:id/grupos_trabalho', (req, res) => {
        const idEvento = req.params.id;
        Evento.listaDeGruposDeTrabalho(idEvento, res);
    });

    app.get('/eventos/:id/lider_gt', (req, res) => {
        const idEvento = req.params.id;
        Evento.listaDeLideresDosGruposDeTrabalhos(idEvento, res);
    });

    app.delete('/eventos/:id', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.secretaria)) {
            const id_evento = req.body.id_evento;
            Evento.deleta(id_evento, res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });
}     