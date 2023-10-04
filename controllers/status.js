const Status = require('../models/status');
const Auth = require('../models/auth');
const permissoes = require('../helpers/permissoes');

module.exports = app => {

    app.get('/status', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.secretaria) 
            || req.id_permissao.includes(permissoes.orientadores) || req.id_permissao.includes(permissoes.chamados)) {
            Status.lista(res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });

}