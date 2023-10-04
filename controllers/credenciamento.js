const Auth = require('../models/auth');
const Credenciamento = require('../models/credenciamento'); 
const permissoes = require('../helpers/permissoes');

module.exports = app => {
    app.post('/credenciamento', (req, res) => {
        const credenciamento = req.body;
       
        Credenciamento.adiciona(credenciamento, res);
    });

    app.put('/credenciamento/:id', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.convenios)) {
            const id = parseInt(req.params.id);
            const valores = req.body;
            Credenciamento.altera(id, valores, res);
            return
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });

    app.get('/credenciamento/:id/documento_credenciamento', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.convenios)
            || req.id_permissao.includes(permissoes.processoCredenciamento)) {
            const id_credenciamento = req.params.id;
            Credenciamento.anexosDoCredenciamento(id_credenciamento, res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });
}     