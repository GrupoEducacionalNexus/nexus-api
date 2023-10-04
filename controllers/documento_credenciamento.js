const Auth = require('../models/auth');
const DocumentoCredenciamento = require('../models/documento_credenciamento'); 
const permissoes = require('../helpers/permissoes');

module.exports = app => { 

    app.post('/documento_credenciamento', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.convenios)
            || req.id_permissao.includes(permissoes.processoCredenciamento)) {
                DocumentoCredenciamento.adiciona(req.body, res); 
                return
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });
    
    app.put('/documento_credenciamento/:id', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.convenios)) {
            const id = parseInt(req.params.id);
            const valores = req.body;
            console.log(valores);
            DocumentoCredenciamento.altera(id, valores, res);
            return
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });

}      