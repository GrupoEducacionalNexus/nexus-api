const Auth = require('../models/auth');
const Anexo = require('../models/anexos');
const permissoes = require('../helpers/permissoes');

module.exports = app => {
    app.post('/anexos', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.secretaria)
            || req.id_permissao.includes(permissoes.eventos) || req.id_permissao.includes(permissoes.orientandos)) {
            const id_usuario = req.userId;
            const anexo = req.body;
            const id_permissao =  req.id_permissao;
            Anexo.adiciona({ id_usuario, id_permissao, ...anexo }, res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });
}      