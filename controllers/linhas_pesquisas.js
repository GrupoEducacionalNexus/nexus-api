const LinhasPesquisas = require('../models/linhas_pesquisas');
const Auth = require('../models/auth');
const permissoes = require('../helpers/permissoes');

module.exports = app => {
    app.get('/linhas_pesquisas', (req, res) => {
        const area_concentracao = parseInt(req.query.area_concentracao);
        LinhasPesquisas.lista(area_concentracao, res);
    });

}