const moment = require('moment');
const conexao = require('../infraestrutura/conexao');
const permissoes = require('../helpers/permissoes');

class Aluno {
    adiciona(dados, id_permissao, res) {
        
        let dataHoraCriacao = moment().format('YYYY-MM-DD hh:mm:ss');
        let sql = ``;
        let id_usuario = 0;
        const  tipoAluno  = dados.tipoAluno;
         
        if (tipoAluno === 1) {
            let valores = [];
            let array_id_alunoGXid_pendencia = [];
            let id_pendencias = [];
            let solicitacao = dados.alunos[0].solicitacao;

            if (dados.alunos.length > 1) {
                dados.alunos.map(item => {
                    valores.push([item.nome !== undefined ? item.nome : null, item.cpf !== undefined ? item.cpf : null, dataHoraCriacao]);
                });

                //Cadastro de alunos
                sql = `INSERT INTO usuarios (nome, cpf_cnpj, dataHoraCriacao) VALUES ?`;
                conexao.query(sql, [valores], (erro, resultados) => {
                    if (erro) {
                        res.status(400).json(erro);
                    } else {
                        let insertId = resultados.insertId - 1;
                        let ids_alunos = [];
                        for (let index = 0; index < resultados.affectedRows; index++) {
                            ids_alunos.push(insertId += 1);
                        }
                        console.log(ids_alunos);

                        console.log(resultados);

                        valores = [];

                        dados.alunos.map((item, index) => {
                            valores.push([
                                ids_alunos[index],
                                item.dataNascimento !== undefined ? moment(item.dataNascimento).utc().format('YYYY-MM-DD') : null,
                                item.rg !== undefined ? item.rg : null,
                                item.nacionalidade !== undefined ? item.nacionalidade : null,
                                item.naturalidade !== undefined ? item.naturalidade : null,
                                item.pai !== undefined ? item.pai : null,
                                item.mae !== undefined ? item.mae : null,
                                item.situacaoTurma !== undefined ? item.situacaoTurma : null,
                                item.turma !== undefined ? item.turma : null,
                                item.nomeInstituicao !== undefined ? item.nomeInstituicao : null,
                                dataHoraCriacao]);
                        });

                        //Cadastro de alunos da certificação
                        sql = `INSERT INTO alunos (id_usuario, dataNascimento, rg, nacionalidade, naturalidade, pai, mae, situacaoTurma, turma, nomeInstituicao, dataHoraCriacao) VALUES ?`;
                        conexao.query(sql, [valores], (erro, resultados) => {
                            if (erro) {
                                res.status(400).json(erro);
                            } else {
                                valores = [];
                                ids_alunos.map(item => {
                                    valores.push([
                                        item,
                                        dados.id_ciclo, 
                                        dataHoraCriacao
                                    ]);
                                })
                                console.log(valores);

                                sql = `INSERT INTO checklist (id_usuario, id_ciclo, dataHoraCriacao) VALUES ?`;
                                conexao.query(sql, [valores], (erro, resultados) => {
                                    if (erro) {
                                        res.status(400).json(erro);
                                    } else {
                                        console.log(resultados);

                                        if (dados.alunos.length > 1) {
                                            //Consulta de analise de pendências
                                            sql = `SELECT usuarios.id AS id_usuario, CONCAT_WS(",", IF(usuarios.cpf_cnpj = "", 4, NULL),
                                            IF(alunos.rg IS NULL, 3, NULL),
                                            IF(alunos.turma IS NULL, 6, NULL),
                                            IF(usuarios.nome = "", 1, NULL),
                                            IF(alunos.situacaoTurma != 'FINALIZADO', 9, NULL),
                                            IF(alunos.pai IS NULL &&
                                            alunos.mae IS NULL, 8, NULL),
                                            IF(alunos.nomeInstituicao IS NULL, 7, NULL),
                                            IF(alunos.naturalidade IS NULL, 5, NULL),
                                            IF(alunos.dataNascimento IS NULL, 2, NULL)) AS id_pendencia,
                                            (COUNT(IF(usuarios.cpf_cnpj = "", 1, NULL)) +
                                            COUNT(IF(alunos.rg IS NULL, 1, NULL)) +
                                            COUNT(IF(alunos.turma IS NULL, 1, NULL)) + 
                                            COUNT(IF(usuarios.nome = "", 1, NULL)) +
                                            COUNT(IF(alunos.situacaoTurma != 'FINALIZADO', 1, NULL)) +
                                            COUNT(IF(alunos.pai IS NULL &&
                                            alunos.mae IS NULL, 1, NULL)) +
                                            COUNT(IF(alunos.nomeInstituicao IS NULL, 1, NULL)) +
                                            COUNT(IF(alunos.naturalidade IS NULL, 1, NULL)) +
                                            COUNT(IF(alunos.dataNascimento IS NULL, 1, NULL))) 
                                              AS quant_pendencias
                                          FROM alunos
                                          INNER JOIN usuarios ON alunos.id_usuario = usuarios.id
                                          INNER JOIN checklist ON alunos.id_usuario = checklist.id_usuario
                                          WHERE checklist.id_ciclo = ? && CONCAT_WS(",", IF(usuarios.cpf_cnpj = "", 4, NULL),
                                            IF(alunos.rg IS NULL, 3, NULL),
                                            IF(alunos.turma IS NULL, 6, NULL),
                                            IF(usuarios.nome = "", 1, NULL),
                                            IF(alunos.situacaoTurma != 'FINALIZADO', 9, NULL),
                                            IF(alunos.pai IS NULL &&
                                            alunos.mae IS NULL, 8, NULL),
                                            IF(alunos.nomeInstituicao IS NULL, 7, NULL),
                                            IF(alunos.naturalidade IS NULL, 5, NULL),
                                            IF(alunos.dataNascimento IS NULL, 2, NULL)) <> "" && checklist.solicitacao IS NULL
                                          GROUP BY alunos.id ORDER BY usuarios.nome`;

                                            conexao.query(sql, [dados.id_ciclo], (erro, resultados) => {
                                                if (erro) {
                                                    res.status(400).json({ status: 400, msg: erro });
                                                } else {
                                                    //console.log(resultados);

                                                    array_id_alunoGXid_pendencia = [];
                                                    id_pendencias = [];
                                                    resultados.map(item => {
                                                        if (item.quant_pendencias > 1) {
                                                            //console.log(resultados[index].id_alunoG);
                                                            id_pendencias = item.id_pendencia.split(",");

                                                            id_pendencias.map(id => {
                                                                //console.log(resultados[index].id_alunoG, id);
                                                                array_id_alunoGXid_pendencia.push([item.id_usuario, parseInt(id), dataHoraCriacao]);
                                                            });
                                                        } else {
                                                            array_id_alunoGXid_pendencia.push([item.id_usuario, parseInt(item.id_pendencia), dataHoraCriacao]);
                                                        }
                                                    })
                                                    // for (let index = 0; index < resultados.length; index++) {
                                                    //     if (resultados[index].quant_pendencias > 1) {
                                                    //         //console.log(resultados[index].id_alunoG);
                                                    //         id_pendencias = resultados[index].id_pendencia.split(",");

                                                    //         id_pendencias.map(id => {
                                                    //             //console.log(resultados[index].id_alunoG, id);
                                                    //             array_id_alunoGXid_pendencia.push([resultados[index].id_alunoG, parseInt(id), dataHoraCriacao]);
                                                    //         });
                                                    //     } else {
                                                    //         array_id_alunoGXid_pendencia.push([resultados[index].id_alunoG, parseInt(resultados[index].id_pendencia), dataHoraCriacao]);
                                                    //     }
                                                    // }
                                                    console.log(array_id_alunoGXid_pendencia);

                                                    sql = `INSERT INTO alunosxpendencias (id_aluno, id_pendencia, dataHoraCriacao) VALUES ?`;
                                                    conexao.query(sql, [array_id_alunoGXid_pendencia], (erro, resultados) => {
                                                        if (erro) {
                                                            res.status(400).json(erro);
                                                        } else {
                                                            res.status(201).json({ status: 200, msg: "Lista de alunos cadastrada com sucesso!" });
                                                        }
                                                    });

                                                }
                                            });
                                        }
                                    }
                                });

                            }
                        });
                    }
                });
                return
            }
 
            sql = `INSERT INTO usuarios (nome, cpf_cnpj, dataHoraCriacao) VALUES ?`;

            conexao.query(sql, [[[dados.alunos[0].nome, dados.alunos[0].cpf, dataHoraCriacao]]], (erro, resultados) => {
                if (erro) {
                    res.status(400).json(erro);
                } else {
                    id_usuario = resultados.insertId;
                    sql = `INSERT INTO alunos (id_usuario, dataNascimento, rg, nacionalidade, naturalidade, pai, mae, situacaoTurma, turma, nomeInstituicao, dataHoraCriacao) VALUES ?`;

                    conexao.query(sql, [[[
                        id_usuario,
                        dados.alunos[0].dataNascimento,
                        dados.alunos[0].rg,
                        dados.alunos[0].nacionalidade,
                        dados.alunos[0].naturalidade,
                        dados.alunos[0].pai,
                        dados.alunos[0].mae,
                        dados.alunos[0].situacaoTurma,
                        dados.alunos[0].turma,
                        dados.alunos[0].nomeInstituicao,
                        dataHoraCriacao
                    ]]], (erro, resultados) => {
                        if (erro) {
                            res.status(400).json(erro);
                        } else {
                            sql = `INSERT INTO checklist (id_usuario, id_ciclo, solicitacao, dataHoraCriacao) VALUES ?`;

                            conexao.query(sql, [
                                [[
                                    id_usuario,
                                    dados.id_ciclo,
                                    solicitacao,
                                    dataHoraCriacao
                                ]]], (erro, resultados) => {
                                    if (erro) {
                                        res.status(400).json(erro);
                                    } else {
                                        console.log(resultados);
                                        res.status(200).json({ status: 200, msg: "Aluno cadastrado com sucesso!" });
                                    }
                                });
                        }
                    });
                }
            });
            return 
        }

        if (tipoAluno === 2) {
            const { nome, email, senha, id_plano } = dados;

            sql = `SELECT usuarios.id FROM usuarios WHERE usuarios.email = ?`;

            conexao.query(sql, [email], (erro, resultados) => {
                if (erro) {
                    res.status(400).json({ status: 400, msg: erro });
                } else {
                    if (resultados.length > 0) {
                        id_usuario = resultados[0].id;
                        const alunoDatado = { id_usuario, id_tipo: 2, dataHoraCriacao };
                        sql = `INSERT INTO alunos SET ?`;
                        conexao.query(sql, alunoDatado, (erro, resultados) => {
                            if (erro) {
                                res.status(400).json(erro);
                            } else {
                                let id_aluno = resultados.insertId;
                                const alunoXplanoDatado = { id_aluno, id_plano, dataHoraCriacao };
                                sql = `INSERT INTO alunosxplanos SET ?`;
                                conexao.query(sql, alunoXplanoDatado, (erro, resultados) => {
                                    if (erro) {
                                        res.status(400).json(erro);
                                    } else {
                                        res.status(200).json({ status: 200, msg: "Aluno cadastrado com sucesso!" });
                                    }
                                });
                            }
                        });
                    } else {
                        const usuarioDatado = { nome, email, senha, dataHoraCriacao };
                        sql = `INSERT INTO usuarios SET ?`;
                        conexao.query(sql, usuarioDatado, (erro, resultados) => {
                            if (erro) {
                                res.status(400).json(erro);
                            } else {
                                id_usuario = resultados.insertId;
                                const permisaoDatada = { id_usuario, id_permissao: 13, dataHoraCriacao };

                                //Apontamento de permissão de aluno para o usuário cadastrado
                                sql = `INSERT INTO usuariosxpermissoes SET ?`;
                                conexao.query(sql, permisaoDatada, (erro, resultados) => {
                                    if (erro) {
                                        res.status(400).json(erro);
                                    } else {
                                        const alunoDatado = { id_usuario, id_tipo: 2, dataHoraCriacao };
                                        //Cadastro de aluno de polo
                                        sql = `INSERT INTO alunos SET ?`;
                                        conexao.query(sql, alunoDatado, (erro, resultados) => {
                                            if (erro) {
                                                res.status(400).json(erro);
                                            } else {
                                                let id_aluno = resultados.insertId;
                                                const alunoXplanoDatado = { id_aluno, id_plano, dataHoraCriacao };
                                                sql = `INSERT INTO alunosxplanos SET ?`;
                                                conexao.query(sql, alunoXplanoDatado, (erro, resultados) => {
                                                    if (erro) {
                                                        res.status(400).json(erro);
                                                    } else {
                                                        res.status(200).json({ status: 200, msg: "Aluno cadastrado com sucesso!" });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                }
            });
            return
        }

        if (id_permissao.includes(permissoes.secretaria)) {
            
            return
        }

        if (id_permissao.includes(permissoes.professor)) {

            return
        }
    }

    altera(id, valores, id_permissao, res) {
        let sql = ``;
        if (id_permissao.includes(permissoes.secretaria)) {
            const { nome, cpf, dataNascimento, rg, nacionalidade, naturalidade,
                pai, mae, situacaoTurma, turma, nomeInstituicao, solicitacao } = valores;

            sql = `UPDATE usuarios SET ? WHERE usuarios.id = ?`;
            conexao.query(sql, [{ nome, cpf_cnpj: cpf }, id], (erro, resultados) => {
                if (erro) {
                    res.status(400).json({ status: 400, msg: erro })
                } else {
                    sql = `UPDATE alunos SET ? WHERE alunos.id_usuario = ?`;
                    conexao.query(sql, [{
                        dataNascimento, rg,
                        nacionalidade, naturalidade, pai,
                        mae, situacaoTurma, turma, nomeInstituicao
                    }, id], (erro, resultados) => {
                        if (erro) {
                            res.status(400).json({ status: 400, msg: erro })
                        } else {
                            if (solicitacao !== 0) {
                                console.log(solicitacao);
                                sql = `UPDATE checklist SET ? WHERE checklist.id_usuario = ?`;
                                conexao.query(sql, [{ solicitacao }, id], (erro, resultados) => {
                                    if (erro) {
                                        res.status(400).json({ status: 400, msg: erro });
                                    } else {
                                        res.status(200).json({ status: 200, msg: "Atualizado com sucesso." });
                                    }
                                });
                                return
                            }
                            res.status(200).json({ status: 200, msg: "Atualizado com sucesso." });
                        }
                    });
                }
            });
            return
        }

        if (id_permissao.includes(permissoes.professor)) {
            const { id_usuario, id_aluno, nome, email, senha, id_plano } = valores;

            sql = `UPDATE usuarios SET ? WHERE usuarios.id = ?`;
            conexao.query(sql, [{ nome, email, senha }, id_usuario], (erro, resultados) => {
                if (erro) {
                    res.status(400).json({ status: 400, msg: erro })
                } else {
                    sql = `UPDATE alunosxplanos SET ? WHERE alunosxplanos.id_aluno = ?`;
                    conexao.query(sql, [{ id_plano: parseInt(id_plano) }, id], (erro, resultados) => {
                        if (erro) {
                            res.status(400).json({ status: 400, msg: erro });
                        } else {
                            res.status(200).json({ status: 200, msg: "Atualizado com sucesso." });
                        }
                    });
                }
            });
            return
        }

    }

    // alteraChecklist(id, valores, res) {
    //     const { checked, value } = valores;

    //     let aluno = {};
    //     checked !== '' ? aluno = { [checked]: value } : aluno = { observacao: valores.observacao };

    //     const sql = `UPDATE alunos_certificacao SET ? WHERE alunos_certificacao.id = ?`;
    //     conexao.query(sql, [aluno, id], (erro, resultados) => {
    //         if (erro) {
    //             res.status(400).json({ status: 400, msg: erro });
    //         } else {
    //             res.status(200).json({ status: 200, msg: "Atualizado com sucesso." });
    //         }
    //     });
    // }

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

    listaDeTemas(id_aluno, mes_atual, res) {
        mes_atual = mes_atual !== "" ? `AND MONTH(temas.dataHoraCriacao) = ${mes_atual}` : "";
        const sql = `SELECT temas.id, temas.nome, temas.texto_base,
        DATE_FORMAT(temas.dataHoraCriacao, "%d-%m-%Y") AS dataCriacao, alunos.id AS id_aluno,
        usuarios.nome AS nomeDoAluno,
        redacoes.id AS id_redacao, COUNT(redacoes.corrigido) AS corrigido
        FROM temas 
        INNER JOIN temasxalunos ON temasxalunos.id_tema = temas.id
        LEFT JOIN redacoes ON redacoes.id_tema = temas.id
        INNER JOIN alunos ON temasxalunos.id_aluno = alunos.id
        INNER JOIN usuarios ON usuarios.id = alunos.id_usuario
        WHERE usuarios.id = ? ${mes_atual}
        GROUP BY temas.id ORDER BY temas.id DESC`;

        conexao.query(sql, [id_aluno], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, resultados });
                console.log(resultados);
            }
        });
    }

    listaDeRedacoes(id_aluno, id_tema, res) {
        const sql = `SELECT * FROM redacoes
        INNER JOIN alunos ON alunos.id = redacoes.id_aluno
        INNER JOIN usuarios ON usuarios.id = alunos.id_usuario
        WHERE alunos.id = ? AND redacoes.id_tema = ?`;

        conexao.query(sql, [id_aluno, id_tema], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, resultados });

            }
        });
    }

}

module.exports = new Aluno;