const Curso = require('../models/cursos');
const Auth = require('../models/auth');
const permissoes = require('../helpers/permissoes');

module.exports = app => {
    app.get('/cursos', Auth.verificaJWT, (req, res) => {
        console.log(req.id_permissao);
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.polos) || 
        req.id_permissao.includes(permissoes.orientadores) || req.id_permissao.includes(permissoes.coordenador)) {
            Curso.lista(res); 
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });

}