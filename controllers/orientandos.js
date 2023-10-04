const Orientando = require('../models/orientandos');
const Auth = require('../models/auth');
const permissoes = require('../helpers/permissoes');

module.exports = app => {
    app.post('/orientandos', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.secretaria) ||
        req.id_permissao.includes(permissoes.orientadores) || req.id_permissao.includes(permissoes.coordenador)) {
            const id_coordenador = parseInt(req.userId);
            const orientando = req.body;
            Orientando.adiciona({ ...orientando, id_coordenador }, res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });

    app.put('/orientandos/:id', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.secretaria)
            || req.id_permissao.includes(permissoes.coordenador) || req.id_permissao.includes(permissoes.orientadores)
            || req.id_permissao.includes(permissoes.orientandos)) {
            const id_orientando = parseInt(req.params.id);
            const valores = req.body;
            
            Orientando.altera(id_orientando, valores, req.id_permissao, res);
            return;
        }  
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });

    app.get('/orientandos', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.secretaria)
            || req.id_permissao.includes(permissoes.diretor)) {
            const id_areaConcentracao = req.query.id_areaConcentracao;
            Orientando.lista(id_areaConcentracao, res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });

    app.get('/orientandos/:id', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.secretaria)
            || req.id_permissao.includes(permissoes.diretor) || req.id_permissao.includes(permissoes.orientandos)) {
            const id_orientando = req.userId;
            Orientando.busca(id_orientando, res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });

    app.get('/orientandos/:id/bancas', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.secretaria)
            || req.id_permissao.includes(permissoes.orientandos)) {
            const id_orientando = req.userId;
            const id_tipoBanca = req.query.tipo_banca;
            Orientando.listaDeBancas(id_orientando, id_tipoBanca, res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });

    app.get('/orientandos/:id/orientacao', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.secretaria)
            || req.id_permissao.includes(permissoes.diretor) || req.id_permissao.includes(permissoes.coordenador) || 
            req.id_permissao.includes(permissoes.orientadores) 
            || req.id_permissao.includes(permissoes.orientandos)) {

            if (req.id_permissao.includes(permissoes.diretor) || req.id_permissao.includes(permissoes.coordenador) || 
            req.id_permissao.includes(permissoes.orientadores)) {
                Orientando.listaDeOrientacoes(req.params.id, res);
                return
            }
            Orientando.listaDeOrientacoes(req.userId, res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });

    app.get('/orientandos/:id/solicitacao', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.secretaria)
            || req.id_permissao.includes(permissoes.orientandos)) {
            const id_orientando = req.userId;
            Orientando.listaDeSolicitacoes(id_orientando, res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });
}

