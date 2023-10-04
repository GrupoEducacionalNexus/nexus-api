const Auth = require('../models/auth');
const Solicitacao = require('../models/solicitacoes');

module.exports = app => {
    app.post('/solicitacao', Auth.verificaJWT, (req, res) => {
        const idSolicitante = req.userId;
        const solicitacao = req.body;
        
        Solicitacao.adiciona({ ...solicitacao, idSolicitante, permissao: req.permissao }, res);
    });

    app.put('/solicitacao/:id', Auth.verificaJWT, (req, res) => {
        const id_solicitacao = req.params.id;
        const solicitacao = req.body;
        console.log(id_solicitacao, solicitacao);
        Solicitacao.altera(id_solicitacao, {...solicitacao, id_usuario: req.userId, id_permissao: req.id_permissao}, res);
    });  

    app.get('/solicitacao', Auth.verificaJWT, (req, res) => {  
        Solicitacao.lista(res);
    }); 
}      