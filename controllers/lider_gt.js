const Auth  = require('../models/auth');
const LiderGt = require('../models/lider_gt');
const permissoes = require('../helpers/permissoes');

module.exports = app => {

    app.post('/lider_gt', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.secretaria)) {
            const lider_gt = req.body;
            console.log(lider_gt);
            LiderGt.adiciona(lider_gt, res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });

    app.get('/lider_gt/:id/grupo_trabalho', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.grupo_trabalho)) {
            const id_usuario = req.userId;
            LiderGt.listaGruposDeTrabalho(id_usuario, res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });


}