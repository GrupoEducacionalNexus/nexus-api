const Auth = require('../models/auth');
const Certificado = require('../models/certificados');
const permissoes = require('../helpers/permissoes');

module.exports = app => {
    app.post('/certificados', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.secretaria) || 
        req.id_permissao.includes(permissoes.orientadores)) {
            const certificado = req.body; 
            console.log(certificado);
            Certificado.adiciona(certificado, res); 
            return;
        } 
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });

    app.put('/certificados/:id', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.secretaria) || 
        req.id_permissao.includes(permissoes.orientadores)) {
            const id = req.params.id;
            const valores = req.body;
            Certificado.altera(id, valores, res); 
            return;
        } 
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });

    app.get('/certificados', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.secretaria)) {
            Certificado.lista(res);
            return; 
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });

    app.get('/certificados/:codigo_validacao', (req, res) => {
        const codigo_validacao = req.params.codigo_validacao;
        Certificado.busca(codigo_validacao, res);
    });
}      