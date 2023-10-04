const moment = require('moment');
const conexao = require('../infraestrutura/conexao');

class Cheklist {
    alteraItemDoChecklist(id, valores, res) {
        const { checked, value } = valores;
        const sql = `UPDATE checklist SET ? WHERE checklist.id_usuario = ?`;
        conexao.query(sql, [ checked !== '' ? { [checked]: value } : 
           {observacao: valores.observacao}, id], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, msg: "Atualizado com sucesso." });
            }
        });
    }

    alteraitensDoChecklist(arrayIdsAlunos, checkeds, desmarcarTodosOsItensMarcados, res) {
        let string = ``;

        desmarcarTodosOsItensMarcados === 1 ? checkeds.map((item) => { string += `${item} = '0',`; }) : checkeds.map((item) => { string += `${item} = '1',`; });

        console.log(string.substring(0, string.length - 1))

        const sql = `UPDATE checklist SET ${string.substring(0, string.length - 1)} WHERE checklist.id_usuario IN (?)`;
        conexao.query(sql, [arrayIdsAlunos], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro })
            } else {
                res.status(200).json({ status: 200, msg: "Atualizado com sucesso." });
            }
        });
    }

    alteraDataDiario(arrayIdsAlunos, data_diario, res) {
        const sql = `UPDATE checklist SET data_diario = ? WHERE checklist.id_usuario IN (?)`;
        conexao.query(sql, [data_diario, arrayIdsAlunos], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro })
            } else {
                res.status(200).json({ status: 200, msg: "Atualizado com sucesso." });
            }
        });
    }

    adicionarPendencia(pendencias, res) {
        //console.log(pendencias.arrayIdsAlunosPendentes.length);  
        //console.log(pendencias.arrayIdsAlunosPendentes);
        //Verificar se a pendência, já foi registrada para o aluno.
        let sql = `SELECT * FROM alunosxpendencias WHERE alunosxpendencias.id_aluno IN (?)`;
        conexao.query(sql, [pendencias.arrayIdsAlunosPendentes], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                if (resultados.length > 0) {
                    //console.log(resultados)
                    res.status(400).json({ msg: "As pendências, já foram registradas para os alunos.", status: 400 });
                } else {
                    let dataHoraCriacao = moment().format('YYYY-MM-DD hh:mm:ss');
                    pendencias.arrayAlunosPendencias.map(item => {
                        item.push(dataHoraCriacao);
                    });

                    //Cadastro de pendências dos alunos
                    sql = `INSERT INTO alunosxpendencias (id_aluno, id_pendencia, dataHoraCriacao) VALUES ?`;
                    conexao.query(sql, [pendencias.arrayAlunosPendencias], (erro, resultados) => {
                        if (erro) {
                            res.status(400).json(erro);
                        } else {
                            res.status(201).json({ status: 200, msg: "Pendência cadastrada com sucesso!" });
                        }
                    });
                }
            }
        });

    }

    listaPendencias(id_aluno, res) {
        const sql = `SELECT alunos.id as id_aluno, alunos.nome as nome_aluno, pendencias.id as id_pendencia, pendencias.nome as pendencia, date_format(alunosxpendencias.dataHoraCriacao, '%d/%m/%Y') as dataHoraCriacao,
        alunosxpendencias.status FROM alunosxpendencias 
        INNER JOIN alunos ON alunosxpendencias.id_aluno = alunos.id
        INNER JOIN pendencias ON pendencias.id = alunosxpendencias.id_pendencia
        WHERE alunosxpendencias.id_aluno = ?`;

        conexao.query(sql, [id_aluno], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, resultados });
                //console.log(resultados);
            }
        });
    }

}

module.exports = new Cheklist;