const Auth = require('../models/auth');
const TipoChamado = require('../models/tipos_chamados');
const permissoes = require('../helpers/permissoes');

module.exports = app => {
    app.post('/tipos_chamados', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.chamados)) {
            const tipo_chamado = req.body;
            TipoChamado.adiciona(tipo_chamado, res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });

    app.put('/tipos_chamados/:id', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.secretaria) || 
        req.id_permissao.includes(permissoes.chamados) ||
        req.id_permissao.includes(permissoes.orientadores)) {
            const id = req.params.id;
            const valores = req.body;
            TipoChamado.altera(id, valores, res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });

    app.get('/tipos_chamados', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.chamados)) {
            TipoChamado.lista(res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });

    
}     