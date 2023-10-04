const AlunoXPendencia = require('../models/alunoxpendencia');
const Auth = require('../models/auth');
const permissoes = require('../helpers/permissoes');

module.exports = app => {
    app.put('/alunoxpendencia/:id', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.secretaria)) {
            const id = parseInt(req.params.id);
            const valores = req.body;
            AlunoXPendencia.altera(id, valores, res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });



}      