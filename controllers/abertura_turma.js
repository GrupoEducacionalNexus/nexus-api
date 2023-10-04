const Auth = require('../models/auth');
const AberturaTurma = require('../models/abertura_turma');
const permissoes = require('../helpers/permissoes');

module.exports = app => {
    app.post('/abertura_turma', (req, res) => {
        const abertura_turma = req.body;
        console.log(abertura_turma);
        AberturaTurma.adiciona(abertura_turma, res);
    });

    app.get('/abertura_turma', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.convenios)) {
            const dataAtual = req.query.dataAtual; 
            const cnpj = req.query.cnpj;
            const nome_fantasia = req.query.nome_fantasia;
            const data_solicitacao = req.query.data_solicitacao;
            AberturaTurma.lista({dataAtual, cnpj, nome_fantasia, data_solicitacao}, res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });
 
}     