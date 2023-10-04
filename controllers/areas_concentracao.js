const AreaConcentracao = require('../models/areas_concentracao');
const Auth = require('../models/auth');
const permissoes = require('../helpers/permissoes');

module.exports = app => {
    app.get('/areas_concentracao', (req, res) => {
        AreaConcentracao.lista(res);
    });
}