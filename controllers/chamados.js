const Auth = require('../models/auth');
const Chamado = require('../models/chamados');


module.exports = app => {
    app.post('/chamados', Auth.verificaJWT, (req, res) => {
        const idSolicitante = req.userId;
        const idSetorSolicitante = req.id_setor;
        const chamado = req.body;
        Chamado.adiciona({ ...chamado, idSolicitante, idSetorSolicitante}, res);
    });

    app.put('/chamados/:id', Auth.verificaJWT, (req, res) => {
        const id_chamado = req.params.id;
        const chamado = req.body;
        console.log(chamado);
      
        Chamado.altera(id_chamado, { ...chamado, id_usuario: req.userId}, req, res);
    });
    
    app.get('/chamados/:id', Auth.verificaJWT, (req, res) => { 
        const idChamado = req.params.id;
        Chamado.busca(idChamado, res);
    });

    app.get('/chamados/:id/anexos', Auth.verificaJWT, (req, res) => {
        const idChamado = req.params.id;
        Chamado.listaDeAnexos(idChamado, res);
    });

    app.get('/chamados/:id/setores', Auth.verificaJWT, (req, res) => {
        const idChamado = req.params.id;
        Chamado.listaDeSetores(idChamado, res);
    });

    app.get('/chamados/:id/comentarios', Auth.verificaJWT, (req, res) => {
        const idChamado = req.params.id;
        Chamado.listaDeComentarios(idChamado, res);
    });

    app.get('/chamados/:id/solicitante', Auth.verificaJWT, (req, res) => {
        const idChamado = req.params.id;
        const idSolicitante = req.query.idSolicitante;
        Chamado.informacoesDoSolicitante(idSolicitante, idChamado, res);
    });

}     