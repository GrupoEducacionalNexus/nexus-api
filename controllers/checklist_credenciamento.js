const Auth = require('../models/auth');
const ChecklistCredenciamento = require('../models/checklist_credenciamento');
const permissoes = require('../helpers/permissoes');

module.exports = (app) => {

    const verificarPermissoes = (req, permissoesPermitidas, res, callback) => {
        const temPermissao = permissoesPermitidas.some(permissao => req.id_permissao.includes(permissao));
        if (temPermissao) {
            callback();
        } else {
            res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
        }
    };

    app.post('/checklist_credenciamento', Auth.verificaJWT, (req, res) => {
        verificarPermissoes(req, [permissoes.admin, permissoes.convenios], res, () => {
            ChecklistCredenciamento.adiciona(req.body, res);
        });
    });

    app.put('/checklist_credenciamento/:id', Auth.verificaJWT, (req, res) => {
        verificarPermissoes(req, [permissoes.admin, permissoes.convenios], res, () => {
            ChecklistCredenciamento.altera(req.params.id, req.body, res);
        });
    });

    app.get('/checklist_credenciamento', Auth.verificaJWT, (req, res) => {
        verificarPermissoes(req, [permissoes.admin, permissoes.convenios, permissoes.gestorInstituicao], res, () => {
            ChecklistCredenciamento.lista(res);
        });
    });

    app.get('/checklist_credenciamento/:id/documento_credenciamento', Auth.verificaJWT, (req, res) => {
        verificarPermissoes(req, [permissoes.admin, permissoes.convenios, permissoes.gestorInstituicao], res, () => {
            ChecklistCredenciamento.anexosDoChecklistCredenciamento(req.params.id, req.query.id_credenciamento, res);
        });
    });

    app.get('/checklist_credenciamento/:id/instrucoes', Auth.verificaJWT, (req, res) => {
        verificarPermissoes(req, [permissoes.admin, permissoes.convenios, permissoes.gestorInstituicao], res, () => {
            ChecklistCredenciamento.listaDeInstrucoes(req.params.id, res);
        });
    });
};
