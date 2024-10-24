const Auth  = require('../models/auth');
const Permissao = require('../models/permissoes');
module.exports = app => {
    app.get('/permissoes', (req, res) => {
        Permissao.lista(res);
    });

    app.post('/permissoes/:id/usuarios', Auth.verificaJWT, (req, res) => {
        const id_permissao = parseInt(req.params.id);
        const usuario = req.body;
        Permissao.adiciona({id_permissao, ...usuario}, (erro, resultdados) => {
            if (erro) {
                console.error(erro);
                res.status(400).json({status: 400, msg: "erro adicionar permissão"});
                return
            }
            res.status(200).json({ status: 200, msg: "Permissão adicionada com sucesso " });

        }); 
    });
}