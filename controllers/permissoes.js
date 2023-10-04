const Auth  = require('../models/auth');
const Permissao = require('../models/permissoes');
module.exports = app => {
    app.get('/permissoes', (req, res) => {
        Permissao.lista(res);
    });

    app.post('/permissoes/:id/usuarios', Auth.verificaJWT, (req, res) => {
        const id_permissao = parseInt(req.params.id);
        const usuario = req.body;
        Permissao.adicionaPermissaoUsuario(id_permissao, usuario, res); 
    });
}