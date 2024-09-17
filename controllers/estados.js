const Estado = require('../models/estados');
const Auth = require('../models/auth');
const permissoes = require('../helpers/permissoes');

module.exports = app => {

    app.get('/estados', (req, res) => {
        Estado.lista(res);
    });

    app.get('/estados/:id/credenciamento', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.convenios)) {
            const idEstado = req.params.id;
            Estado.listaDeCredenciamento(idEstado, res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });

    app.get('/estados/:id/checklist_credenciamento', Auth.verificaJWT, (req, res) => {
        if (
            req.id_permissao.includes(permissoes.admin) || 
            req.id_permissao.includes(permissoes.convenios) || 
            req.id_permissao.includes(permissoes.gestorInstituicao) // Certifique-se de que a permissão está incluída corretamente
        ) {
            const idEstado = req.params.id;
            Estado.listaDeChecklistDoCredenciamento(idEstado, res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });
    
 
}