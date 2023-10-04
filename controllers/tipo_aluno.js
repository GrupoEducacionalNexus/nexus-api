const TipoAluno = require('../models/tipo_aluno');
const Auth = require('../models/auth');
const permissoes = require('../helpers/permissoes');

module.exports = app => {

    app.get('/tipo_aluno/:id/alunos', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.professor)) {
            const id_tipo = req.params.id;
            TipoAluno.listaDeAlunos(id_tipo, res); 
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });

}