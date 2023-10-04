const Checklist = require('../models/checklist');
const Auth = require('../models/auth');
const permissoes = require('../helpers/permissoes');

module.exports = app => {

    app.put('/checklist/:id', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.secretaria)) {
            const id = parseInt(req.params.id);
            const valores = req.body;
            const arrayIdsAlunos = valores.arrayIdsAlunos;
          
            if (arrayIdsAlunos.length === 0) { 
                Checklist.alteraItemDoChecklist(id, valores, res); 
                return;
            } 
            
            const checkeds = valores.checkeds;
            const desmarcarTodosOsItensMarcados = valores.desmarcarTodosOsItensMarcados;
            Checklist.alteraitensDoChecklist(arrayIdsAlunos, checkeds, desmarcarTodosOsItensMarcados, res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });

    app.put('/checklist/:id/dataDiario', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.secretaria)) {
            const arrayIdsAlunos = req.body.arrayIdsAlunos;
            const data_diario = req.body.data_diario;
            Checklist.alteraDataDiario(arrayIdsAlunos, data_diario, res);
            return;
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
            console.log(idAluno)
            Aluno.listaPendencias(idAluno, res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });

    app.post('/alunos/:id/provas', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.polos)) {
            const dados = req.body;
            const id_polo = req.userId;
            console.log(dados);
            Aluno.vincularProva({ id_polo, ...dados }, res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });

    app.get('/alunos/:id/provas', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.polos)) {
            const idAluno = req.query.idAluno;
            console.log(idAluno);
            Aluno.listaProvas(idAluno, res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });

    });

    app.put('/alunos/:id/dataDiario', Auth.verificaJWT, (req, res) => {
        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.secretaria)) {
            const arrayIdsAlunos = req.body.arrayIdsAlunos;
            const data_diario = req.body.data_diario;
            Aluno.alteraDataDiario(arrayIdsAlunos, data_diario, res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });


    app.put('/alunos/:id', Auth.verificaJWT, (req, res) => {
        const id = parseInt(req.params.id);
        const valores = req.body;
        console.log(id, valores);

        if (req.id_permissao.includes(permissoes.admin) || req.id_permissao.includes(permissoes.secretaria)) {
            Aluno.alteraAlunoCertificacao(id, valores, res);
            return;
        } else if (rreq.id_permissao.includes(permissoes.polos)) {
            Aluno.alteraAlunoPolo(id, valores, res);
            return;
        }
        res.status(400).send({ auth: false, permissoes: false, message: 'Você não tem permissão para acessar essa página.' });
    });



}      