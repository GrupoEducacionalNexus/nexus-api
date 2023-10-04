const MembroExterno = require('../models/membro_externo');
const Auth = require('../models/auth');
const permissoes = require('../helpers/permissoes');

module.exports = app => {
    app.post('/membro_externo', Auth.verificaJWT, (req, res) => {
        const membro_externo = req.body;
        MembroExterno.adiciona(membro_externo, res);
    });

    app.get('/membro_externo', (req, res) => {
        MembroExterno.lista(res);
    });

    app.put('/membro_externo/:id', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.secretaria) || 
        req.id_permissao.includes(permissoes.coordenador)) {
            const id = parseInt(req.params.id);
            const valores = req.body;
            console.log(id, valores);
            MembroExterno.altera(id, valores, res);
            //Documento.altera(id, valores, res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });
}

