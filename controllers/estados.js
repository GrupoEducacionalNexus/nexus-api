const Estado = require('../models/estados');
const Auth = require('../models/auth');
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

    app.get('/estados', (req, res) => {
        Estado.lista(res);
    });

    app.get('/estados/:id/credenciamento', Auth.verificaJWT, (req, res) => {
        verificarPermissoes(req, [permissoes.admin, permissoes.convenios], res, () => {
            const idEstado = req.params.id;
            Estado.listaDeCredenciamento(idEstado, res);
        });
    });

    app.get('/estados/:id/checklist_credenciamento', Auth.verificaJWT, (req, res) => {
        verificarPermissoes(req, [permissoes.admin, permissoes.convenios, permissoes.processoCredenciamento], res, () => {
            const idEstado = req.params.id;
            Estado.listaDeChecklistDoCredenciamento(idEstado, res);
        });

    });

};
