const Auth  = require('../models/auth');
const Pergunta = require('../models/perguntas');

module.exports = app => {
    app.get('/perguntas', (req, res) => {
        Pergunta.lista(res);
    });
}