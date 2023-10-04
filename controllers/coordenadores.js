const Coordenador = require('../models/coordenadores');
const Auth = require('../models/auth');
const permissoes = require('../helpers/permissoes');

module.exports = app => {

    app.get('/coordenadores/:id', Auth.verificaJWT, (req, res) => {
        const id_coordenador = req.userId;
        console.log(id_coordenador);
        Coordenador.busca(id_coordenador, res);
    });

    app.get('/coordenadores/:id/orientandos', Auth.verificaJWT, (req, res) => {
        const id_coordenador = req.userId;
        Coordenador.listaDeOrientandos(id_coordenador, res); 
    });

    app.get('/coordenadores', (req, res) => {
        Coordenador.lista(res);
    });

    
}

