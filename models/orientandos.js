const moment = require('moment');
const conexao = require('../infraestrutura/conexao');
const permissoes = require('../helpers/permissoes');
const enviarEmail = require('../services/send-email');

class Orientando {

    adiciona(orientando, res) {
        const { nome, email, senha, id_curso, informacoes_adicionais, id_coordenador, id_orientador, fase_processo,
            dataHoraInicialFaseProcesso, dataHoraFinalFaseProcesso, dataHoraConclusao, id_linhaPesquisa
        } = orientando;
        let dataHoraCriacao = moment().format('YYYY-MM-DD HH:mm:ss');

        let sql = `SELECT * FROM usuarios WHERE email = ?`;
        conexao.query(sql, [email], (erro, resultados) => {
            if (erro) {
                res.status(400).json(erro);
            } else {
                if (resultados.length > 0) {
                    const id_usuario = resultados[0].id;
                    sql = `SELECT * FROM usuariosxpermissoes
                            WHERE usuariosxpermissoes.id_permissao = ? AND usuariosxpermissoes.id_usuario= ?`;

                    conexao.query(sql, [6, id_usuario], (erro, resultados) => {
                        if (erro) {
                            res.status(400).json({ status: 400, msg: erro });
                        } else {
                            if (resultados.length > 0) {
                                sql = `SELECT orientandos.id_usuario FROM orientandos WHERE orientandos.id_usuario = ?`;

                                conexao.query(sql, [id_usuario], (erro, resultados) => {
                                    if (erro) {
                                        res.status(400).json({ status: 400, msg: erro });
                                    } else {
                                        if (resultados.length > 0) {
                                            res.status(400).json({ msg: "Já existe um orientando cadastrado com esse nome.", status: 400 })
                                        } else {
                                            //Cadastro do orientandos
                                            sql = `INSERT INTO orientandos SET ?`;
                                            conexao.query(sql, {
                                                id_usuario, id_curso, id_coordenador,
                                                id_orientador, informacoes_adicionais, fase_processo,
                                                dataHoraInicialFaseProcesso, dataHoraFinalFaseProcesso,
                                                dataHoraConclusao, dataHoraCriacao, id_linhaPesquisa
                                            }, (erro, resultados) => {
                                                if (erro) {
                                                    res.status(400).json(erro);
                                                } else {
                                                    sql = `SELECT usuarios.id, usuarios.nome, usuarios.email, usuarios.cpf_cnpj, usuarios.senha
                                                                    FROM usuarios WHERE usuarios.id = ?`;
                                                    conexao.query(sql, [id_orientador], (erro, resultados) => {
                                                        if (erro) {
                                                            res.status(400).json({ status: 400, msg: erro });
                                                        } else {
                                                            res.status(200).json({ status: 200, msg: "Orientando cadastrado com sucesso" });
                                                            enviarEmail(`gestaoacademica@enberuniversity.com,renata@enberuniversity.com,${resultados[0].email.trim()}`, "Mensagem sobre registro de banca!",
                                                                `<b>O coordenador(a) ${resultados[0].nome} registrou um novo orientando(a) ${nome}, acesse o link <a href="https://www.gestorgruponexus.com.br/">https://www.gestorgruponexus.com.br/</a> para verificar!</b>`);
                                                        }
                                                    });

                                                }
                                            });
                                        }
                                    }
                                });
                            } else {
                                const permisaoDatada = { id_usuario, id_permissao: 6, dataHoraCriacao }

                                sql = `INSERT INTO usuariosxpermissoes SET ?`;
                                conexao.query(sql, permisaoDatada, (erro, resultados) => {
                                    if (erro) {
                                        res.status(400).json(erro);
                                    } else {
                                        sql = `SELECT orientandos.id_usuario FROM orientandos WHERE orientandos.id_usuario = ?`;

                                        conexao.query(sql, [id_usuario], (erro, resultados) => {
                                            if (erro) {
                                                res.status(400).json({ status: 400, msg: erro });
                                            } else {
                                                if (resultados.length > 0) {
                                                    res.status(400).json({ msg: "Já existe um orientando cadastrado com esse nome.", status: 400 })
                                                } else {
                                                    //Cadastro do orientandos
                                                    sql = `INSERT INTO orientandos SET ?`;
                                                    conexao.query(sql, {
                                                        id_usuario, id_curso, id_coordenador,
                                                        id_orientador, informacoes_adicionais, fase_processo,
                                                        dataHoraInicialFaseProcesso, dataHoraFinalFaseProcesso,
                                                        dataHoraConclusao, dataHoraCriacao, id_linhaPesquisa
                                                    }, (erro, resultados) => {
                                                        if (erro) {
                                                            res.status(400).json(erro);
                                                        } else {
                                                            sql = `SELECT usuarios.id, usuarios.nome, usuarios.email, usuarios.cpf_cnpj, usuarios.senha
                                                                            FROM usuarios WHERE usuarios.id = ?`;
                                                            conexao.query(sql, [id_orientador], (erro, resultados) => {
                                                                if (erro) {
                                                                    res.status(400).json({ status: 400, msg: erro });
                                                                } else {
                                                                    res.status(200).json({ status: 200, msg: "Orientando cadastrado com sucesso" });
                                                                    enviarEmail(`gestaoacademica@enberuniversity.com,renata@enberuniversity.com,${resultados[0].email}`, "Mensagem sobre registro de banca!",
                                                                        `<b>O coordenador(a) ${resultados[0].nome} registrou um novo orientando(a) ${nome}, acesse o link <a href="https://www.gestorgruponexus.com.br/">https://www.gestorgruponexus.com.br/</a> para verificar!</b>`);
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
                        }
                    });

                } else {
                    const usuarioDatado = { cpf_cnpj: 0, nome, email, senha, dataHoraCriacao };
                    sql = `INSERT INTO usuarios SET ?`;

                    conexao.query(sql, usuarioDatado, (erro, resultados) => {
                        if (erro) {
                            res.status(400).json(erro);
                        } else {
                            sql = `INSERT INTO usuariosxpermissoes SET ?`;
                            conexao.query(sql, { id_usuario: resultados.insertId, id_permissao: 6, dataHoraCriacao }, (erro, resultados) => {
                                if (erro) {
                                    res.status(400).json(erro);
                                } else {

                                    sql = `SELECT orientandos.id_usuario FROM orientandos WHERE orientandos.id_usuario = ?`;

                                    conexao.query(sql, [resultados.insertId], (erro, resultados) => {
                                        if (erro) {
                                            res.status(400).json({ status: 400, msg: erro });
                                        } else {
                                            if (resultados.length > 0) {
                                                res.status(400).json({ msg: "Já existe um orientando cadastrado com esse nome.", status: 400 })
                                            } else {
                                                //Cadastro do orientandos
                                                sql = `INSERT INTO orientandos SET ?`;
                                                conexao.query(sql, {
                                                    id_usuario: resultados.insertId, id_curso, id_coordenador,
                                                    id_orientador, informacoes_adicionais, fase_processo,
                                                    dataHoraInicialFaseProcesso, dataHoraFinalFaseProcesso,
                                                    dataHoraConclusao, dataHoraCriacao, id_linhaPesquisa
                                                }, (erro, resultados) => {
                                                    if (erro) {
                                                        res.status(400).json(erro);
                                                    } else {
                                                        sql = `SELECT usuarios.id, usuarios.nome, usuarios.email, usuarios.cpf_cnpj, usuarios.senha
                                                                    FROM usuarios WHERE usuarios.id = ?`;
                                                        conexao.query(sql, [id_orientador], (erro, resultados) => {
                                                            if (erro) {
                                                                res.status(400).json({ status: 400, msg: erro });
                                                            } else {
                                                                res.status(200).json({ status: 200, msg: "Orientando cadastrado com sucesso" });
                                                                enviarEmail(`angelligruponexus@gmail.com,gabrielbatistagruponexus@gmail.com,renata@enberuniversity.com,${resultados[0].email}`, "Mensagem sobre registro de banca!",
                                                                    `O coordenador ${resultados[0].nome} registrou um novo orientando ${nome}, assim que possível entre no sistema para verificar!`,
                                                                    `O coordenador ${resultados[0].nome} registrou um novo orientando ${nome}, assim que possível entre no sistema para verificar!`);
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
                }
            }
        });
    }

    altera(id_orientando, valores, id_permissao, res) {
        const { id_usuario, nome, email,
            senha, id_curso, informacoes_adicionais, fase_processo,
            dataHoraInicialFaseProcesso, dataHoraFinalFaseProcesso, dataHoraConclusao,
            id_linhaPesquisa, dt_confirmacaoTaxaQ,
            status_confirmacaoBancaQ, dt_confirmacaoTaxaD,
            status_confirmacaoBancaD, observacao, arquivoTeseOuDissertacao, id_orientador
        } = valores;
        let sql = ``;

        if (id_permissao.includes(permissoes.coordenador)) {
            sql = 'UPDATE usuarios SET ? WHERE id = ?';
            conexao.query(sql, [{ nome: nome.trim(), email: email.trim(), senha }, id_usuario], (erro, resultados) => {
                if (erro) {
                    res.status(400).json({ status: 400, msg: erro });
                } else {
                    sql = 'UPDATE orientandos SET ? WHERE id = ?';
                    conexao.query(sql, [
                        {
                            id_orientador, id_curso, informacoes_adicionais: informacoes_adicionais.trim(), fase_processo,
                            dataHoraInicialFaseProcesso, dataHoraFinalFaseProcesso,
                            dataHoraConclusao, id_linhaPesquisa
                        }, id_orientando], (erro, resultados) => {
                            if (erro) {
                                res.status(400).json({ status: 400, msg: erro });
                            } else {
                                res.status(200).json({ status: 200, msg: "Atualizado com sucesso." });
                                return
                            }
                        });
                }
            });
        }

        if (id_permissao.includes(permissoes.orientadores)) {
            sql = 'UPDATE usuarios SET ? WHERE id = ?';
            conexao.query(sql, [{ nome: nome.trim(), email: email.trim(), senha }, id_usuario], (erro, resultados) => {
                if (erro) {
                    res.status(400).json({ status: 400, msg: erro });
                } else {
                    sql = 'UPDATE orientandos SET ? WHERE id = ?';
                    conexao.query(sql, [
                        {
                            id_curso, informacoes_adicionais: informacoes_adicionais.trim(), fase_processo,
                            dataHoraInicialFaseProcesso, dataHoraFinalFaseProcesso,
                            dataHoraConclusao
                        }, id_orientando], (erro, resultados) => {
                            if (erro) {
                                res.status(400).json({ status: 400, msg: erro });
                            } else {
                                res.status(200).json({ status: 200, msg: "Atualizado com sucesso." });
                                return
                            }
                        });
                }
            });
        }

        if (id_permissao.includes(permissoes.secretaria)) {
            let coluna = ``;
           
            if (dt_confirmacaoTaxaQ) {
                coluna = `dt_confirmacaoTaxaQ='${dt_confirmacaoTaxaQ}'`;
            }

            if (status_confirmacaoBancaQ) {
                coluna = `status_confirmacaoBancaQ='${status_confirmacaoBancaQ}'`;
            }

            if (dt_confirmacaoTaxaD) {
                coluna = `dt_confirmacaoTaxaD='${dt_confirmacaoTaxaD}'`;
            }

            if (status_confirmacaoBancaD) {
                coluna = `status_confirmacaoBancaD='${status_confirmacaoBancaD}'`;
            }

            if (observacao) {
                coluna = `observacao='${observacao}'`;
            }
           
            sql = `UPDATE orientandos SET ${coluna} WHERE id = ?`;

            conexao.query(sql, [id_orientando], (erro, resultados) => {
                if (erro) {
                    res.status(400).json({ status: 400, msg: erro });
                } else {
                    res.status(200).json({ status: 200, msg: "Atualizado com sucesso." });
                   
                }
            });
            return 
        }

        if (id_permissao.includes(permissoes.orientandos)) {
            sql = `UPDATE orientandos SET ? WHERE id = ?`;

            conexao.query(sql, [{ arquivoTeseOuDissertacao }, id_orientando], (erro, resultados) => {
                if (erro) {
                    res.status(400).json({ status: 400, msg: erro });
                } else {
                    res.status(200).json({ status: 200, msg: "Atualizado com sucesso." });
                }
            });
            return
        }

    }

    lista(id_areaConcentracao = 0, res) {
        const sql = `SELECT orientandos.id, usuarios.id as id_usuario, usuarios.nome, usuarios.email, cursos.id as id_curso, cursos.nome as curso,
        tipo_banca.id AS id_tipoBanca, tipo_banca.nome AS fase_processo, orientandos.id_linhaPesquisa,
        DATE_FORMAT(orientandos.dataHoraInicialFaseProcesso, "%Y-%m-%d %H:%i:%s") AS dataHoraInicialFaseProcesso, 
        DATE_FORMAT(orientandos.dataHoraFinalFaseProcesso, "%Y-%m-%d %H:%i:%s") AS dataHoraFinalFaseProcesso, 
        DATE_FORMAT(orientandos.dataHoraConclusao, "%Y-%m-%d %H:%i:%s") AS dataHoraConclusao,
        DATE_FORMAT(orientandos.dataHoraInicialFaseProcesso, "%d-%m-%Y %H:%i:%s") AS dataHoraInicialFaseProcessoTb, 
        DATE_FORMAT(orientandos.dataHoraFinalFaseProcesso, "%d-%m-%Y %H:%i:%s") AS dataHoraFinalFaseProcessoTb, 
        DATE_FORMAT(orientandos.dataHoraConclusao, "%d-%m-%Y %H:%i:%s") AS dataHoraConclusaoTb,
        DATE_FORMAT(orientandos.dataHoraCriacao, "%d-%m-%Y %H:%i:%s") AS dataHoraCriacao,
        usuarios.senha, orientandos.informacoes_adicionais,
       	(SELECT usuarios.nome FROM usuarios WHERE usuarios.id = orientandos.id_orientador ) AS orientador,
        DATE_FORMAT(orientandos.dt_confirmacaoTaxaQ, "%Y-%m-%d %H:%i:%s") AS dt_confirmacaoTaxaQ,
        orientandos.status_confirmacaoBancaQ, 
        DATE_FORMAT(orientandos.dt_confirmacaoTaxaD, "%Y-%m-%d %H:%i:%s") AS dt_confirmacaoTaxaD,
        orientandos.status_confirmacaoBancaD, 
        orientandos.observacao, DATE_FORMAT(orientandos.dataHoraCriacao, "%d-%m-%Y %H:%i:%s") AS dtHCadOrientando
        FROM orientandos 
        INNER JOIN cursos ON orientandos.id_curso = cursos.id
        INNER JOIN usuarios ON orientandos.id_usuario = usuarios.id
        INNER JOIN tipo_banca ON orientandos.fase_processo = tipo_banca.id
        INNER JOIN linhas_pesquisas ON orientandos.id_linhaPesquisa = linhas_pesquisas.id
        WHERE linhas_pesquisas.id_areaConcentracao = ? OR linhas_pesquisas.id_areaConcentracao = 0
        ORDER BY orientandos.id DESC`;

        conexao.query(sql, [id_areaConcentracao], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, resultados, id_areaConcentracao: Number(id_areaConcentracao) });
            }
        });
    }

    listaDeBancas(id_orientando, id_tipoBanca, res) {
        const sql = `SELECT bancas.id, orientandos.id AS id_orientando, linhas_pesquisas.id_areaConcentracao, DATE_FORMAT(bancas.data_horaPrevista,'%d/%m/%Y ÀS %H:%i') AS data_horaPrevista,
        usuarios.nome AS orientando, usuarios.email AS email_orientando, cursos.nome AS curso, tipo_banca.id AS id_tipoBanca,
        tipo_banca.nome AS tipo_banca, bancas.status, 
		(SELECT usuarios.nome FROM usuarios WHERE usuarios.id = bancas.id_orientador) AS orientador,
		(SELECT usuarios.email FROM usuarios WHERE usuarios.id = bancas.id_orientador) AS email_orientador,
		orientandos.id_curso, 
		(SELECT tipo_banca.nome FROM tipo_banca WHERE tipo_banca.id = orientandos.fase_processo) 
		AS fase_processo,
		DATE_FORMAT(orientandos.dataHoraInicialFaseProcesso, "%d-%m-%Y %H:%i:%s") AS dataHoraInicialFaseProcessoTb, 
        DATE_FORMAT(orientandos.dataHoraFinalFaseProcesso, "%d-%m-%Y %H:%i:%s") AS dataHoraFinalFaseProcessoTb, 
        DATE_FORMAT(orientandos.dataHoraConclusao, "%d-%m-%Y %H:%i:%s") AS dataHoraConclusaoTb,
        ata.id AS id_ata, ata.titulo_teseOuDissertacao,
        ata.quant_pag, (SELECT status.nome FROM status WHERE status.id = ata.status) AS status_ata,
        DATE_FORMAT(orientandos.dt_confirmacaoTaxaQ, "%d-%m-%Y %H:%i:%s") AS dt_confirmacaoTaxaQ,
		IF(orientandos.status_confirmacaoBancaQ = 1, "AGUARDANDO", IF(orientandos.status_confirmacaoBancaQ = 7, "FINALIZADA", "CONFIRMADO")) AS status_confirmacaoBancaQ,
        DATE_FORMAT(orientandos.dt_confirmacaoTaxaD, "%d-%m-%Y %H:%i:%s") AS dt_confirmacaoTaxaD,
 		IF(orientandos.status_confirmacaoBancaD = 1, "AGUARDANDO", IF(orientandos.status_confirmacaoBancaD = 7, "FINALIZADA", "CONFIRMADO")) AS status_confirmacaoBancaD,
        orientandos.observacao, usuarios.cpf_cnpj,
        usuarios.rg, usuarios.dt_nascimento,
        usuarios.telefone, usuarios.cep, usuarios.estado, usuarios.cidade,
        usuarios.bairro, usuarios.logradouro, usuarios.numero, usuarios.naturalidade,
        usuarios.nacionalidade, usuarios.estado_civil,
        DATE_FORMAT(usuarios.dt_nascimento, "%Y-%m-%d") AS dt_nascimento
		FROM bancas
        LEFT JOIN orientandos ON bancas.id_orientando = orientandos.id
        INNER JOIN cursos ON cursos.id = orientandos.id_curso
        INNER JOIN tipo_banca ON tipo_banca.id = bancas.id_tipoBanca 
        INNER JOIN usuarios ON orientandos.id_usuario = usuarios.id
        INNER JOIN linhas_pesquisas ON bancas.id_linhaPesquisa = linhas_pesquisas.id
        LEFT JOIN ata ON ata.id_banca = bancas.id
        WHERE orientandos.id_usuario = ? AND bancas.id_tipoBanca = ? order by bancas.id desc`;

        conexao.query(sql, [id_orientando, id_tipoBanca], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, resultados, id_tipoBanca });
                console.log(resultados);
            }
        });
    }

    listaDeOrientacoes(id_orientando, res) {
        const sql = `SELECT orientacao.id, 
        (SELECT usuarios.email FROM usuarios 
            WHERE usuarios.id = orientacao.id_orientador) AS email_orientador,
            (SELECT usuarios.nome FROM usuarios 
            WHERE usuarios.id = orientacao.id_orientador) AS orientador, 
            usuarios.nome AS orientando, orientacao.link, 
                    orientacao.observacao, usuarios.email AS email_orientando,
                    DATE_FORMAT(orientacao.dataHoraPrevista, "%Y-%m-%d %H:%i:%s") AS dataHoraPrevista,
                    DATE_FORMAT(orientacao.dataHoraPrevista, "%d/%m/%Y às %H:%i") AS dataHoraPrevistaTb
                    FROM orientacao
                    INNER JOIN orientandos ON orientacao.id_orientando = orientandos.id
                    INNER JOIN usuarios ON orientandos.id_usuario = usuarios.id
                    WHERE orientandos.id_usuario = ? ORDER BY orientacao.id DESC`;

        conexao.query(sql, [id_orientando], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, resultados });
                console.log(resultados);
            }
        });
    }

    busca(id, res) {
        let sql = `SELECT orientandos.id_usuario, usuarios.nome, usuarios.email, usuarios.cpf_cnpj,
        usuarios.rg,  usuarios.dt_nascimento, usuarios.dt_nascimento,
        usuarios.telefone, usuarios.cep, usuarios.estado, usuarios.cidade,
        usuarios.bairro, usuarios.logradouro, usuarios.numero, usuarios.naturalidade,
        usuarios.nacionalidade, usuarios.estado_civil
        FROM orientandos
        INNER JOIN usuarios ON orientandos.id_usuario = usuarios.id
        WHERE orientandos.id_usuario = ?`;

        conexao.query(sql, [id], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, resultados });
            }
        });
    }

    listaDeSolicitacoes(id_orientando, res) {
        const sql = `SELECT solicitacoes.id, solicitacoes.link AS anexo, 
        solicitacoes.idTipo, tipo_solicitacao.nome AS tipo,
        DATE_FORMAT(solicitacoes.dataHoraCriacao, "%d/%m/%Y às %H:%i") AS dataHoraCriacao,
        status.nome AS status,
        usuarios.cpf_cnpj,
        usuarios.rg, usuarios.dt_nascimento,
        usuarios.telefone, usuarios.cep, usuarios.estado, usuarios.cidade,
        usuarios.bairro, usuarios.logradouro, usuarios.numero, usuarios.naturalidade,
        usuarios.nacionalidade, usuarios.estado_civil,
        DATE_FORMAT(usuarios.dt_nascimento, "%Y-%m-%d") AS dt_nascimento
        FROM solicitacoes
        INNER JOIN usuarios ON usuarios.id = solicitacoes.idSolicitante
        INNER JOIN tipo_solicitacao ON tipo_solicitacao.id = solicitacoes.idTipo
        INNER JOIN status ON solicitacoes.status = status.id
        WHERE solicitacoes.idSolicitante = ? ORDER BY solicitacoes.id DESC`;

        conexao.query(sql, [id_orientando], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, resultados });
            }
        });
    }
}

module.exports = new Orientando; 