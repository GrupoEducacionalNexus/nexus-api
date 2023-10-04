const Membro = require('../models/membros');
const Auth = require('../models/auth');
const permissoes = require('../helpers/permissoes');

module.exports = app => {
    app.post('/membros', (req, res) => {
        const membro = req.body;
        Membro.adiciona(membro, res);
    });

    app.get('/membros/:id/eventos', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.secretaria) || 
        req.id_permissao.includes(permissoes.eventos)) {
            const id_usuario = req.userId;
           
            Membro.listaEventos(id_usuario, res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });

    app.get('/membros/:id/anexos', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.secretaria)
            || req.id_permissao.includes(permissoes.eventos) || req.id_permissao.includes(permissoes.grupo_trabalho)) {
            const id_usuario = req.params.id;
            const id_grupoTrabalho = parseInt(req.query.id_grupoTrabalho);
            Membro.listaAnexos(id_usuario, id_grupoTrabalho, res);
            return; 
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });

    app.get('/membros/validacao', (req, res) => {
        const codigo = req.query.codigo;
        Membro.verificarCodigoValidacaoDoCertificado(codigo, res);
    });


}       