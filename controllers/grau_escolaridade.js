const Auth  = require('../models/auth');
const GrauEscolaridade = require('../models/grau_escolaridade');

module.exports = app => {
    app.get('/grau_escolaridade', (req, res) => {
        GrauEscolaridade.lista(res);
    });
}