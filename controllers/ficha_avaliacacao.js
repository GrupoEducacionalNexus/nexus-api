const Auth = require('../models/auth');
const FichaAvaliacao = require('../models/ficha_avaliacao');
const permissoes = require('../helpers/permissoes');

module.exports = app => {
    app.post('/ficha_avaliacao', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.secretaria) || 
        req.id_permissao.includes(permissoes.orientadores)) {
            const ficha_avaliacao = req.body;
            console.log(ficha_avaliacao);
            FichaAvaliacao.adiciona(ficha_avaliacao, res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });

    app.put('/ficha_avaliacao/:id', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.secretaria) || 
        req.id_permissao.includes(permissoes.orientadores)) {
            const id_fichaAvaliacao = req.params.id;
            const valores = req.body;
            FichaAvaliacao.altera(id_fichaAvaliacao, valores, res); 
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });
}     