const Orientador = require('../models/orientadores');
const Auth = require('../models/auth');
const permissoes = require('../helpers/permissoes');

module.exports = app => {
    app.get('/orientadores/:id', Auth.verificaJWT, (req, res) => {
        const id_orientador = req.userId;
        Orientador.busca(id_orientador, res); 
    });

    app.get('/orientadores/:id/orientandos', Auth.verificaJWT, (req, res) => {
        const id_orientador = req.params.id; 
        Orientador.listaDeOrientandos(id_orientador, req.query, res); 
    }); 

    app.get('/orientadores/:id/bancas', Auth.verificaJWT, (req, res) => {
        const id_orientador = req.userId;
        const id_tipoBanca = req.query.tipo_banca;
        console.log(id_orientador, id_tipoBanca);
      
        Orientador.listaDeBancas(id_orientador, id_tipoBanca, res);
    });

    app.get('/orientadores/:id/orientacao', Auth.verificaJWT, (req, res) => {
        const id_orientador = req.userId;
        Orientador.listaDeOrientacao(id_orientador, res);
    });  

    app.get('/orientadores', (req, res) => {
        const area_concentracao = req.query.area_concentracao;
        Orientador.lista(area_concentracao, res);
    });
} 

