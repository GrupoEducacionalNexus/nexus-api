const Auth = require('../models/auth');
const Ata = require('../models/ata');
const permissoes = require('../helpers/permissoes');

module.exports = app => {
    app.post('/ata', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.secretaria) || 
        req.id_permissao.includes(permissoes.orientadores)) {
            const ata = req.body;
            Ata.adiciona(ata, res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });


    app.put('/ata/:id', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.secretaria) || 
        req.id_permissao.includes(permissoes.orientadores)) {
            const id = req.params.id;
            const valores = req.body;
            Ata.altera(id, valores, res);  
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });
}     