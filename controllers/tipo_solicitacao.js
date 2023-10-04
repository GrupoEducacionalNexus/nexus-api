const Auth = require('../models/auth');
const TipoSolicitacao = require('../models/tipo_solicitacao');

module.exports = app => {
    app.get('/tipo_solicitacao', Auth.verificaJWT, (req, res) => {  
        TipoSolicitacao.lista(res);
    });
}     