// controllers/credenciamento.js
const Credenciamento = require('../models/credenciamento'); 
const permissoes = require('../helpers/permissoes');

module.exports = (app) => {

    // Rota para criar solicitação de credenciamento (não protegida)
    app.post('/credenciamento', (req, res) => {
        const credenciamento = req.body;
        Credenciamento.adiciona(credenciamento, res);
    });

    // Rota para atualizar solicitação de credenciamento (protegida)
    app.put('/credenciamento/:id', (req, res) => {
        // Implementar autenticação e verificação de permissões se necessário
        const id = parseInt(req.params.id, 10);
        const valores = req.body;
        Credenciamento.altera(id, valores, res);
    });

    // Rota para obter anexos de credenciamento (protegida)
    app.get('/credenciamento/:id/documento_credenciamento', (req, res) => {
        // Implementar autenticação e verificação de permissões se necessário
        const id_credenciamento = req.params.id;
        Credenciamento.anexosDoCredenciamento(id_credenciamento, res);
    });

};
