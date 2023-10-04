const Auth = require('../models/auth');
const Resposta = require('../models/respostas');

module.exports = app => {
    app.post('/respostas', (req, res) => {
        Resposta.adiciona(req.body, res);
    });  
}      