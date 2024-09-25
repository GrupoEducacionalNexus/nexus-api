const Auth = require('../models/auth');
const Banca = require('../models/bancas');
const permissoes = require('../helpers/permissoes');

module.exports = app => {
    app.post('/bancas', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || 
        req.id_permissao.includes(permissoes.secretaria) || req.id_permissao.includes(permissoes.orientadores)) {
            const id_orientador = req.userId;
            const orientador = req.nome;
            const banca = req.body;
            Banca.adiciona({ ...banca, id_orientador, orientador }, res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });

    app.put('/bancas/:id', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.secretaria)
        || req.id_permissao.includes(permissoes.orientadores)) {
            const id_banca = parseInt(req.params.id);
            const valores = req.body;
            Banca.altera(id_banca, valores, req.id_permissao, res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });

    app.delete('/bancas/:id', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.secretaria) || 
        req.id_permissao.includes(permissoes.orientadores)) {
            const banca = req.body;
            Banca.deleta(banca, res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });

    app.get('/bancas/:id/declaracoes', Auth.verificaJWT, (req, res) => {
        const id_banca = req.params.id;
        Banca.listaDeDeclaracoes(id_banca, res);
    });

    app.get('/bancas/:id/membros', Auth.verificaJWT, (req, res) => {
        const id_banca = req.params.id;
        Banca.listaDeMembrosDaBanca(id_banca, res);
    });

    app.get('/bancas', Auth.verificaJWT, (req, res) => {
        if (
            req.id_permissao.includes(permissoes.admin) || 
            req.id_permissao.includes(permissoes.secretaria) ||
            req.id_permissao.includes(permissoes.orientadores) || 
            req.id_permissao.includes(permissoes.coordenador) || 
            req.id_permissao.includes(permissoes.diretor)) {
            const id_tipoBanca = req.query.tipo_banca;
            const id_areaConcentracao = req.query.id_areaConcentracao;
            Banca.lista(id_tipoBanca, id_areaConcentracao, res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });
}     