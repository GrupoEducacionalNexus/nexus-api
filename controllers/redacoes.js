const Auth = require('../models/auth');
const Redacao = require('../models/redacoes');
const permissoes = require('../helpers/permissoes');

module.exports = app => {
    app.post('/redacoes', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.alunos)) {
            const redacao = req.body;
            Redacao.adiciona(redacao, res);
            return; 
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });

    app.put('/redacoes/:id', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.professor)) {
            const id = req.params.id;
            const valores = req.body; 
            Redacao.altera(id, valores, res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });

    app.get('/redacoes', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.professor)) {
            Redacao.lista(res);  
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });
}     