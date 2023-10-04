const Aluno = require('../models/alunos');
const Auth = require('../models/auth');
const permissoes = require('../helpers/permissoes');

module.exports = app => {
    app.post('/alunos', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.secretaria) || 
            req.permissao === permissoes.professor) {
            const dados = req.body;
            
            Aluno.adiciona(dados, req.id_permissao, res);
            return;  
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });

    app.put('/alunos/:id', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.secretaria)
        || req.id_permissao.includes(permissoes.professor)) {
            const id = parseInt(req.params.id);
            const valores = req.body; 
            Aluno.altera(id, valores, req.id_permissao, res);
            return
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });

    app.post('/alunos/:id/pendencias', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.secretaria)) {
            const pendencias = req.body;
            Aluno.adicionarPendencia(pendencias, res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });

    app.get('/alunos/:id/pendencias', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.secretaria)) {
            const idAluno = req.query.idAluno;
            Aluno.listaPendencias(idAluno, res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });

    app.post('/alunos/:id/provas', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.polo)) {
            const dados = req.body;
            const id_polo = req.userId;
            console.log(dados);
            Aluno.vincularProva({ id_polo, ...dados }, res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });

    app.get('/alunos/:id/provas', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.polo)) {
            const idAluno = req.query.idAluno;
            console.log(idAluno);
            Aluno.listaProvas(idAluno, res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });

    });

    app.put('/alunos/:id/ckecklist', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.secretaria)) {
            console.log(req.body);
            const arrayIdsAlunos = req.body.arrayIdsAlunos;
            const checkeds = req.body.checkeds;
            const desmarcarTodosOsItensMarcados = req.body.desmarcarTodosOsItensMarcados;
            Aluno.alteralistaChecklistAlunos(arrayIdsAlunos, checkeds, desmarcarTodosOsItensMarcados, res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });

    app.get('/alunos/:id/temas', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.alunos)) {
            const idAluno = req.userId;
            const mesAtual = req.query.mesAtual;
            Aluno.listaDeTemas(idAluno, mesAtual, res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });

    app.get('/alunos/:id/redacoes', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.alunos)) {
            const idAluno = req.query.id_aluno;
            const idTema = req.query.id_tema;
            Aluno.listaDeRedacoes(idAluno, idTema, res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });
}      