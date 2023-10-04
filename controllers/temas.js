const Auth = require('../models/auth');
const Tema = require('../models/temas');
const permissoes = require('../helpers/permissoes');

module.exports = app => {
    app.post('/temas', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.professor)) {
            const tema = req.body;
            Tema.adiciona(tema, res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });


    app.put('/temas/:id', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.professor)) {
            const id = req.params.id;
            const valores = req.body; 
            Tema.altera(id, valores, res);  
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });

    app.get('/temas', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.professor)) {
            Tema.lista(res);  
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });
}     