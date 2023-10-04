const Ciclo = require('../models/ciclos');
const Auth = require('../models/auth');
const permissoes = require('../helpers/permissoes');
 
module.exports = app => {
    app.post('/ciclos', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.secretaria)) {
            const id_usuario = req.userId;
            const ciclo = { ...req.body, id_usuario };
            Ciclo.adiciona(ciclo, res);
            return;
        } 
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    }); 
   
    app.get('/ciclos', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.secretaria)) {
            Ciclo.listaCiclos(res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });

    app.get('/ciclos/:id/alunos', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.secretaria)) {
            const idCiclo = req.query.idCiclo;
            const paginacao = req.query.paginacao;
            const nome = req.query.nome;
            const instituicao = req.query.instituicao;
            const data_diario = req.query.data_diario;
            Ciclo.listaAlunos(idCiclo, paginacao, nome, instituicao, data_diario, res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });

    app.get('/ciclos/:id/pendencias', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.secretaria)) {
            const idCiclo = req.query.idCiclo;
            const pesqInstituicao = req.query.pesqInstituicao;
            const pesqNomeAluno = req.query.pesqNomeAluno;
            Ciclo.listaPendencias(idCiclo, pesqNomeAluno, pesqInstituicao, res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });

    app.get('/ciclos/:id/pendenciasPorUnidade', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.secretaria)) {
            const idCiclo = req.query.idCiclo;
            Ciclo.listaPendenciasPorUnidade(idCiclo, res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });

    app.delete('/ciclos/:id/', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.secretaria)) {
            const idCiclo = req.body.idCiclo;
            Ciclo.deleta(idCiclo, res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });
}