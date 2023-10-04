const Auth = require('../models/auth');
const ChecklistCredenciamento = require('../models/checklist_credenciamento');
const permissoes = require('../helpers/permissoes');

module.exports = app => {

    app.post('/checklist_credenciamento', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) ||
            req.id_permissao.includes(permissoes.convenios)) {
            console.log(req.body);
            ChecklistCredenciamento.adiciona(req.body, res);
            return
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });

    app.put('/checklist_credenciamento/:id', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) ||
            req.id_permissao.includes(permissoes.convenios)) {
            console.log(req.params.id);
            ChecklistCredenciamento.altera(req.params.id, req.body, res);
            return
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });


    app.get('/checklist_credenciamento', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.convenios)
            || req.id_permissao.includes(permissoes.processoCredenciamento)) {
            ChecklistCredenciamento.lista(res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });

    app.get('/checklist_credenciamento/:id/documento_credenciamento', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.convenios)
            || req.id_permissao.includes(permissoes.processoCredenciamento)) {

            const id_checklist_credenciamento = req.params.id;
            const id_credenciamento = req.query.id_credenciamento;

            ChecklistCredenciamento.anexosDoChecklistCredenciamento(id_checklist_credenciamento, id_credenciamento, res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });

    app.get('/checklist_credenciamento/:id/instrucoes', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.convenios)
            || req.id_permissao.includes(permissoes.processoCredenciamento)) {
            const id_checklist_credenciamento = req.params.id;
          
            ChecklistCredenciamento.listaDeInstrucoes(id_checklist_credenciamento, res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });
}     