const Auth = require('../models/auth');
const Orientacao = require('../models/orientacao');
const permissoes = require('../helpers/permissoes');

module.exports = app => {
    app.post('/orientacao', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.secretaria) ||
            req.id_permissao.includes(permissoes.orientadores)) {
            const id_orientador = req.userId;
            const orientacao = req.body;
            console.log(id_orientador, orientacao);
            Orientacao.adiciona({ ...orientacao, id_orientador }, res);
            return
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });

    app.put('/orientacao/:id', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.secretaria) ||
            req.id_permissao.includes(permissoes.orientadores)) {
            const id_orientacao = parseInt(req.params.id);
            const valores = req.body;
            console.log(id_orientacao, valores);

            Orientacao.altera(id_orientacao, valores, res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });


    app.get('/orientacao/:id/anexos', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.secretaria) ||
            req.id_permissao.includes(permissoes.orientadores) || req.id_permissao.includes(permissoes.coordenador)
            || req.id_permissao.includes(permissoes.diretor) || req.id_permissao.includes(permissoes.orientandos)) {
            const id_orientacao = req.params.id;
            console.log(id_orientacao);

            Orientacao.listaAnexos(id_orientacao, res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });

    });

    app.get('/orientacao', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.secretaria) ||
            req.id_permissao.includes(permissoes.orientadores) || req.id_permissao.includes(permissoes.coordenador)
            || req.id_permissao.includes(permissoes.diretor)) {
            const id_areaConcentracao = req.query.id_areaConcentracao;
            console.log("Teste");
            Orientacao.lista(id_areaConcentracao, res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });

    });




}     