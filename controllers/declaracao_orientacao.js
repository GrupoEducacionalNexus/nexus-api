const Auth = require('../models/auth');
const DeclaracaoOrientacao = require('../models/declaracao_orientacao');
const permissoes = require('../helpers/permissoes');

module.exports = app => {
    app.post('/declaracao_orientacao', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.secretaria) || 
        req.id_permissao.includes(permissoes.orientadores)) {
            const id_usuario = req.userId;
            const declaracao_orientacao = req.body;  
            DeclaracaoOrientacao.adiciona({...declaracao_orientacao, id_usuario}, res); 
            return;
        } 
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });
}      