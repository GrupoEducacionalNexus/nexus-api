const Prova = require('../models/provas');
const Auth = require('../models/auth');
const permissoes = require('../helpers/permissoes');

module.exports = app => {

    app.get('/provas/:id', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.polos)) {
            const id = parseInt(req.params.id);
            console.log(id);
            Prova.buscaPorId(id, res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });

}