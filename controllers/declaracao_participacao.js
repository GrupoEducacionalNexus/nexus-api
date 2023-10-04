const Auth = require('../models/auth');
const DeclaracaoParticipacao = require('../models/declaracao_participacao');
const permissoes = require('../helpers/permissoes');
const enviarEmail = require('../services/send-email');

module.exports = app => {
    app.post('/declaracao_participacao', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.secretaria) || 
        req.id_permissao.includes(permissoes.orientadores)) {
            const id_orientador = req.userId;
            const declaracao_participacao = req.body; 
            console.log(declaracao_participacao);
            
            DeclaracaoParticipacao.adiciona({...declaracao_participacao, id_orientador}, res); 
            return;
        } 
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });
}      