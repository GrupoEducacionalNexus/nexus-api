const moment = require('moment');
const conexao = require('../infraestrutura/conexao');

class Ciclo {
    adiciona(ciclo, res) {
        const { id_usuario, nome } = ciclo;
        let dataHoraCriacao = moment().format('YYYY-MM-DD hh:mm:ss');
        const cicloDatado = { nome, id_usuario, dataHoraCriacao };
        let sql = `SELECT * FROM ciclos WHERE nome = ?`;

        conexao.query(sql, [nome], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                if (resultados.length > 0) {
                    res.status(400).json({ msg: "Já existe um ciclo cadastrado com esse nome.", status: 400 })
                } else {
                    //Cadastro do ciclo
                    sql = `INSERT INTO ciclos SET ?`;
                    conexao.query(sql, cicloDatado, (erro, resultados) => {
                        if (erro) {
                            res.status(400).json(erro);
                        } else {
                            res.status(201).json({ status: 200, msg: "ciclo cadastrado com sucesso" });
                        }
                    });
                }
            }
        });
    }

    listaCiclos(res) { 
        const sql = `SELECT ciclos.id, ciclos.nome,
        date_format(ciclos.dataHoraCriacao, '%d/%m/%Y') as dataHoraCriacao
        FROM ciclos 
        ORDER BY ciclos.id DESC`;  

        conexao.query(sql, (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, resultados });
            }
        });
    }

    listaAlunos(id_ciclo, paginacao, nome, instituicao, data_diario, res) {
        let consulta_nome = nome !== "" ? `AND usuarios.nome LIKE '%${nome}%' ` : "";
        let consulta_instituicao = instituicao !== "" ? `AND alunos.nomeInstituicao LIKE '%${instituicao}%' ` : "";
        let consulta_dataDiario = data_diario !== "" ? `AND checklist.data_diario = '${data_diario}' ` : "";

        let sql = `SELECT *,checklist.data_diario, 
        DATE_FORMAT(alunos.dataNascimento, "%Y-%m-%d") AS dataNascimento,
        DATE_FORMAT(checklist.data_diario,'%d/%m/%Y') AS data_diario,
        ROUND((COUNT(IF(checklist.certificado_imp = 1, 1, NULL)) +
        COUNT(IF(checklist.declaracao_imp = 1, 1, NULL)) +
        COUNT(IF(checklist.carimbos = 1, 1, NULL)) +
        COUNT(IF(checklist.selo = 1, 1, NULL)) +
        COUNT(IF(checklist.assinaturas = 1, 1, NULL)) +
        COUNT(IF(checklist.listaImpresso = 1, 1, NULL)) +
        COUNT(IF(checklist.etiquetaImpresso = 1, 1, NULL))) / 7 * 100, 2) AS percentual_conclusao,

        (SELECT SUM(IF(checklist.certificado_imp = 1, 1, 0)) FROM checklist WHERE checklist.id_ciclo = ?) AS quant_certImp,
        (SELECT ROUND((SUM(IF(checklist.certificado_imp = 1, 1, 0)) / COUNT(checklist.id) * 100), 2) FROM checklist
        WHERE checklist.id_ciclo = ?) AS perc_certImp, 
              
        (SELECT SUM(IF(checklist.declaracao_imp = 1, 1, 0)) FROM checklist WHERE checklist.id_ciclo = ?) AS quant_decImp,
        (SELECT ROUND((SUM(IF(checklist.declaracao_imp = 1, 1, 0)) / COUNT(checklist.id) * 100), 2) FROM checklist
        WHERE checklist.id_ciclo = ?) AS perc_decImp,

        (SELECT SUM(IF(checklist.carimbos = 1, 1, 0)) FROM checklist WHERE checklist.id_ciclo = ?) AS quant_carimbos,
        (SELECT ROUND((SUM(IF(checklist.carimbos = 1, 1, 0)) / COUNT(checklist.id) * 100), 2) FROM checklist
        WHERE checklist.id_ciclo = ?) AS perc_carimbos,
        
        (SELECT SUM(IF(checklist.selo = 1, 1, 0)) FROM checklist WHERE checklist.id_ciclo = ?) AS quant_selos,
        (SELECT ROUND((SUM(IF(checklist.selo = 1, 1, 0)) / COUNT(checklist.id) * 100), 2) FROM checklist
        WHERE checklist.id_ciclo = ?) AS perc_selos,

        (SELECT SUM(IF(checklist.assinaturas = 1, 1, 0)) FROM checklist WHERE checklist.id_ciclo = ?) AS quant_assinaturas,
        (SELECT ROUND((SUM(IF(checklist.assinaturas = 1, 1, 0)) / COUNT(checklist.id) * 100), 2) FROM checklist
        WHERE checklist.id_ciclo = ?) AS perc_assinaturas,

        (SELECT SUM(IF(checklist.listaImpresso = 1, 1, 0)) FROM checklist WHERE checklist.id_ciclo = ?) AS quant_listaImpresso,
        (SELECT ROUND((SUM(IF(checklist.listaImpresso = 1, 1, 0)) / COUNT(checklist.id) * 100), 2) FROM checklist
        WHERE checklist.id_ciclo = ?) AS perc_listaImpresso,

        (SELECT SUM(IF(checklist.etiquetaImpresso = 1, 1, 0)) FROM checklist WHERE checklist.id_ciclo = ?) AS quant_etiquetaImpresso,
        (SELECT ROUND((SUM(IF(checklist.etiquetaImpresso = 1, 1, 0)) / COUNT(checklist.id) * 100), 2) FROM checklist
        WHERE checklist.id_ciclo = ?) AS perc_etiquetaImpresso

        FROM checklist 
        INNER JOIN usuarios ON usuarios.id = checklist.id_usuario
        LEFT JOIN alunos ON alunos.id_usuario = checklist.id_usuario
        WHERE checklist.id_ciclo = ? ${consulta_nome} ${consulta_instituicao} ${consulta_dataDiario} GROUP BY usuarios.id ORDER BY usuarios.nome`;

        conexao.query(sql, [id_ciclo, id_ciclo, id_ciclo, id_ciclo, id_ciclo, id_ciclo,
            id_ciclo, id_ciclo, id_ciclo, id_ciclo, id_ciclo, id_ciclo,
            id_ciclo, id_ciclo, id_ciclo
        ], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
                console.log(erro)
            } else {
                res.status(200).json({
                    status: 200, resultados,
                    quant_alunosCiclo: resultados.length,

                    quantidade_alunosCertImp: resultados.length > 0 ? resultados[0].quant_certImp : 0,
                    percentual_alunosCertImp: resultados.length > 0 ? resultados[0].perc_certImp : 0,

                    quant_decImp: resultados.length > 0 ? resultados[0].quant_decImp : 0,
                    perc_decImp: resultados.length > 0 ? resultados[0].perc_decImp : 0,

                    quant_carimbos: resultados.length > 0 ? resultados[0].quant_carimbos : 0,
                    perc_carimbos: resultados.length > 0 ? resultados[0].perc_carimbos : 0,

                    quant_selos: resultados.length > 0 ? resultados[0].quant_selos : 0,
                    perc_selos: resultados.length > 0 ? resultados[0].perc_selos : 0,

                    quant_assinaturas: resultados.length > 0 ? resultados[0].quant_assinaturas : 0,
                    perc_assinaturas: resultados.length > 0 ? resultados[0].perc_assinaturas : 0,

                    quant_listaImpresso: resultados.length > 0 ? resultados[0].quant_listaImpresso : 0,
                    perc_listaImpresso: resultados.length > 0 ? resultados[0].perc_listaImpresso : 0,

                    quant_etiquetaImpresso: resultados.length > 0 ? resultados[0].quant_etiquetaImpresso : 0,
                    perc_etiquetaImpresso: resultados.length > 0 ? resultados[0].perc_etiquetaImpresso : 0

                });
            }
        });

    }

    listaPendencias(id_ciclo, pesqNomeAluno, pesqInstituicao, res) {
        let sql = `SELECT checklist.id_usuario FROM checklist WHERE checklist.id_ciclo = ?`;

        let consulta_nome = pesqNomeAluno !== "" ? `AND usuarios.nome LIKE '%${pesqNomeAluno}%' ` : "";
        let consulta_instituicao = pesqInstituicao !== "" ? `AND alunos.nomeInstituicao LIKE '%${pesqInstituicao}%' ` : "";

        conexao.query(sql, [id_ciclo], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                if (resultados.length > 0) {
                    sql = `SELECT alunosxpendencias.id, alunos.id_usuario as id_aluno, usuarios.nome, GROUP_CONCAT(DISTINCT pendencias.nome) as pendencias, 
                    alunos.nomeInstituicao, alunosxpendencias.status,
                    date_format(alunosxpendencias.dataHoraCriacao, '%d/%m/%Y') as dataHoraCriacao
                    FROM alunosxpendencias 
                    INNER JOIN alunos ON alunosxpendencias.id_aluno = alunos.id_usuario
                    INNER JOIN usuarios ON usuarios.id = alunos.id_usuario
                    INNER JOIN pendencias ON pendencias.id = alunosxpendencias.id_pendencia
                    INNER JOIN checklist ON checklist.id_usuario = usuarios.id
                    WHERE checklist.id_ciclo = ? ${consulta_nome} ${consulta_instituicao} GROUP BY usuarios.id ORDER BY usuarios.nome`;

                    conexao.query(sql, [id_ciclo], (erro, resultados) => {
                        if (erro) {
                            res.status(400).json({ status: 400, msg: erro });
                        } else {
                            res.status(200).json({ status: 200, resultados });
                        }
                    });
                } else {
                    res.status(200).json({ status: 200, resultados: [] });
                }
            }
        });
    }

    listaPendenciasPorUnidade(id_ciclo, res) {
        let sql = `SELECT alunos.nomeInstituicao, 
		COUNT(DISTINCT alunosxpendencias.id_aluno) AS quant_pendRegistradas, 
		COUNT(IF(alunosxpendencias.status = 0, NULL, 1)) AS quant_pendResolvidas
        FROM alunosxpendencias
        INNER JOIN alunos ON alunos.id_usuario = alunosxpendencias.id_aluno
        INNER JOIN pendencias ON pendencias.id = alunosxpendencias.id_pendencia
        INNER JOIN checklist ON alunosxpendencias.id_aluno = checklist.id_usuario
        WHERE checklist.id_ciclo = ? GROUP BY alunos.nomeInstituicao 
        ORDER BY COUNT(DISTINCT alunos.id) desc`;

        conexao.query(sql, [id_ciclo], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, resultados });
            }
        });
    }

    deleta(id_ciclo, res) {
        let sql = `SELECT *, alunos.id AS id_aluno, alunos_certificacao.id AS id_alunoCertificacao, 
        DATE_FORMAT(alunos_certificacao.data_diario,'%d/%m/%Y') AS data_diario
        FROM alunos 
        INNER JOIN alunos_certificacao ON alunos.id = alunos_certificacao.id_alunoG
        WHERE alunos_certificacao.id_ciclo = ?`;
        conexao.query(sql, [id_ciclo], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                console.log(resultados);
                let arrayIdsAlunos = [];

                resultados.map(item => {
                    arrayIdsAlunos.push(item.id);

                });

                console.log(arrayIdsAlunos);

                sql = 'DELETE FROM ciclos WHERE id = ?';

                conexao.query(sql, [id_ciclo], (erro, resultados) => {
                    if (erro) {
                        res.status(400).json({ status: 400, msg: erro });
                    } else {
                        sql = 'DELETE FROM alunos WHERE alunos.id IN (?)';

                        conexao.query(sql, [arrayIdsAlunos], (erro, resultados) => {
                            if (erro) {
                                res.status(400).json({ status: 400, msg: erro });
                            } else {
                                console.log(resultados);
                                sql = 'DELETE FROM alunos_certificacao WHERE alunos_certificacao.id_alunoG IN (?)';

                                conexao.query(sql, [arrayIdsAlunos], (erro, resultados) => {
                                    if (erro) {
                                        res.status(400).json({ status: 400, msg: erro });
                                    } else {
                                        console.log(resultados);

                                        sql = 'DELETE FROM `alunosxpendencias` WHERE alunosxpendencias.id_aluno IN (?)';

                                        conexao.query(sql, [arrayIdsAlunos], (erro, resultados) => {
                                            if (erro) {
                                                res.status(400).json({ status: 400, msg: erro });
                                            } else {
                                                console.log(resultados);
                                                res.status(200).json({ status: 200, msg: "Ciclo excluido com sucesso!" });
                                            }
                                        });
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

module.exports = new Ciclo;