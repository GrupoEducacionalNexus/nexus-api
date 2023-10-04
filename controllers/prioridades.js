const Prioridade = require('../models/prioridades');
const Auth = require('../models/auth');
const permissoes = require('../helpers/permissoes');

module.exports = app => {
    app.get('/prioridades', (req, res) => {
        Prioridade.lista(res);
    });
}