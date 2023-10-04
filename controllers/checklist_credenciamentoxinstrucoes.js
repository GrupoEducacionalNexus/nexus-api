const Auth = require('../models/auth');
const ChecklistCredenciamentoXInstrucoes = require('../models/checklist_credenciamentoxinstrucoes');
const permissoes = require('../helpers/permissoes');

module.exports = app => {

    app.post('/checklist_credenciamentoxinstrucoes', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) ||
            req.id_permissao.includes(permissoes.convenios)) {
                ChecklistCredenciamentoXInstrucoes.adiciona(req.body, res);
            return
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });

    app.delete('/checklist_credenciamentoxinstrucoes/:id', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) ||
            req.id_permissao.includes(permissoes.convenios)) {
            
            ChecklistCredenciamentoXInstrucoes.deleta(req.params.id, res);
            return
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });
}     