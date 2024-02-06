const Instituicao = require('../models/instituicoes');
const Auth = require('../models/auth');
const permissoes = require('../helpers/permissoes');

module.exports = app => {

    app.get('/instituicoes', (req, res) => {
        const cnpj = req.query.cnpj;
        Instituicao.lista(cnpj, res);
    });

}