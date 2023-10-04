const Disciplina = require('../models/disciplinas');
const Auth = require('../models/auth');
const permissoes = require('../helpers/permissoes');

module.exports = app => {

    app.get('/disciplinas', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) ||req.id_permissao.includes(permissoes.polos)) {
            Disciplina.listaDisciplinas(res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });

}