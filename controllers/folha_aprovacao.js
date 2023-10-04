const Auth = require('../models/auth');
const FolhaAprovacao = require('../models/folha_aprovacao');
const permissoes = require('../helpers/permissoes');

module.exports = app => {
    app.post('/folha_aprovacao', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.secretaria) || 
        req.id_permissao.includes(permissoes.orientadores)) {
            const folha_aprovacao = req.body;   
            FolhaAprovacao.adiciona(folha_aprovacao, res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });


    app.put('/folha_aprovacao/:id', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.secretaria) || 
        req.id_permissao.includes(permissoes.orientadores)) {
            const id = req.params.id;
            const valores = req.body; 
            FolhaAprovacao.altera(id, valores, res);  
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });
}     