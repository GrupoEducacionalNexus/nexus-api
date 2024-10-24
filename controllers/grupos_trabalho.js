const Auth  = require('../models/auth');
const GrupoTrabalho = require('../models/grupos_trabalho');
const permissoes = require('../helpers/permissoes');

module.exports = app => {
    app.get('/grupos_trabalho/:id/membros', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.grupo_trabalho)) {
            const id_gt = req.params.id;
            const submissao = parseInt(req.query.submissao);
            
            if(submissao) { 
                GrupoTrabalho.listaDeMembrosComSubmissaoNoGt(id_gt, res);
                return;
            }
            GrupoTrabalho.listaDeMembrosSemSubmissaoNoGt(id_gt, res);
            
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    }); 
}