const Documento = require('../models/documentos');
const Auth = require('../models/auth');
const permissoes = require('../helpers/permissoes');

module.exports = app => {
    app.post('/documentos', (req, res) => {
        const arquivo = req.file;
        const idAreaConcentracao = parseInt(req.body.idAreaConcentracao);
       
        // fileUpload(arquivo, `enber/teses e dissertacoes/${idAreaConcentracao === 1 ? "educacao" : "teologia"}`, ).then(result => Documento.adiciona({
        //     ...req.body,
        //     url: result.Location
        // }, res));
    });
 
    app.get('/documentos', (req, res) => {
        Documento.lista(res);
    });

    app.put('/documentos/:id', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.secretaria)) {
            const id = parseInt(req.params.id);
            const valores = req.body;
            console.log(id, valores);
            Documento.altera(id, valores, res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });
}

