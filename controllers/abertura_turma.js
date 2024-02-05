const Auth = require('../models/auth');
const AberturaTurma = require('../models/abertura_turma');
const permissoes = require('../helpers/permissoes');

module.exports = app => {
    app.post('/abertura_turma', (req, res) => {
        const abertura_turma = req.body;
        console.log(abertura_turma);
        AberturaTurma.adiciona(abertura_turma, res);
    });

    app.get('/abertura_turma', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.convenios)) {
            const {dataAtual, cnpj, nome_fantasia, data_solicitacao, estado} = req.query;
            console.log(req.query);
            
            AberturaTurma.lista({dataAtual, cnpj, nome_fantasia, data_solicitacao, estado}, res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });

    app.get('/abertura_turma/quantidade_solicitacoes', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.convenios)) {
            AberturaTurma.quantidadeDeSolicitacoesPorEstado(res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });

    app.get('/abertura_turma/percentual_solicitacoes', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.convenios)) {
            AberturaTurma.percentualDoStatusDasSolicitacoes(res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });

    app.get('/abertura_turma/quantidade_solicitacoes_instituicoes', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.convenios)) {
            console.log(req.query.estado);
            AberturaTurma.quantidadeDeSolicitacoesDasInstituicoesPorEstado(req.query.estado, res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });

    app.get('/abertura_turma/solicitacao_mensal', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.convenios)) {
        
            AberturaTurma.solicitacoesMensal(parseInt(req.query.ano), res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });

    app.put('/abertura_turma/:id', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.convenios)) {
            const id = req.params.id;
            const valores = req.body;
            console.log(id, valores); 
           
            AberturaTurma.altera(id, valores, res); 
            return;
        } 
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });
 
}     