const moment = require('moment');
const conexao = require('../infraestrutura/conexao');
const enviarEmail = require('../services/send-email');
const permissoes = require('../helpers/permissoes');
moment.locale('pt-br');

class Banca {

    adiciona(banca, res) {
        const { id_orientando, orientador, id_orientador, id_tipoBanca, id_linhaPesquisa, data_horaPrevista, titulo, title, resumo, palavra_chave,
            arraySelectedMembrosInternos, arraySelectedMembrosExternos
        } = banca;

        //Lista de membros externos
        const arrayBancasXmembroExterno = [];
        //Lista de membros internos
        const arrayBancasXmembroInterno = [];

        let sql = ``;
        const dataHoraCriacao = moment().format('YYYY-MM-DD HH:mm:ss');
        let orientando = ``;

        if (id_tipoBanca === 1) {
            sql = `SELECT usuarios.nome, orientandos.status_confirmacaoBancaQ FROM orientandos 
            INNER JOIN usuarios ON usuarios.id = orientandos.id_usuario
            WHERE orientandos.id = ? AND orientandos.status_confirmacaoBancaQ = ?`;

            conexao.query(sql, [id_orientando, 2], (erro, resultados) => {
                if (erro) {
                    res.status(400).json({ status: 400, msg: erro });
                } else {
                    //Verifica se a taxa de qualificação foi paga
                    if (resultados.length > 0) {
                        orientando = resultados[0].nome;
                        sql = `SELECT usuarios.nome AS orientando, cursos.nome AS curso, 
                        tipo_banca.nome AS tipo_banca FROM bancas
                        INNER JOIN orientandos ON bancas.id_orientando = orientandos.id
                        INNER JOIN cursos ON cursos.id = orientandos.id_curso
                        INNER JOIN tipo_banca ON tipo_banca.id = bancas.id_tipoBanca
                        INNER JOIN usuarios ON orientandos.id_usuario = usuarios.id
                        WHERE bancas.id_orientando = ? AND bancas.id_tipoBanca = ? OR 
                        bancas.data_horaPrevista = ?`;

                        conexao.query(sql, [id_orientando, id_tipoBanca, moment(data_horaPrevista).utc().format('YYYY-MM-DD')], (erro, resultados) => {
                            if (erro) {
                                res.status(400).json({ status: 400, msg: erro });

                            } else {
                                if (resultados.length > 0) {
                                    res.status(400).json({
                                        msg: `Já existe uma banca de ${resultados[0].tipo_banca}
                                        para ${resultados[0].orientando.substr(-1) === "a" || resultados[0].orientando.substr(-1) === "i" ? ` a aluna ` : ` o aluno `} ${resultados[0].orientando} do curso de ${resultados[0].curso + `.`}
                                        `, status: 400
                                    });
                                    return;
                                } else {
                                    const bancaDatada = { id_orientando, id_orientador, id_tipoBanca, id_linhaPesquisa, data_horaPrevista, titulo, title, resumo, palavra_chave, dataHoraCriacao, status: 1 };
                                    sql = `INSERT INTO bancas SET ?`;
                                    conexao.query(sql, bancaDatada, (erro, resultados) => {
                                        if (erro) {
                                            res.status(400).json(erro);
                                        } else {
                                            const idBanca = resultados.insertId;

                                            arraySelectedMembrosInternos.map(membroInterno => {
                                                arrayBancasXmembroInterno.push([
                                                    idBanca, membroInterno.value, dataHoraCriacao
                                                ])
                                            });

                                            arraySelectedMembrosExternos.map(membroExterno => {
                                                arrayBancasXmembroExterno.push([
                                                    idBanca, membroExterno.value, dataHoraCriacao
                                                ])
                                            });


                                            //Cadastrar a lista de membros internos da banca
                                            sql = `INSERT INTO bancasxmembro_interno (id_banca, id_membroInterno, dataHoraCriacao) VALUES ?`;
                                            conexao.query(sql, [arrayBancasXmembroInterno], (erro, resultados) => {
                                                if (erro) {
                                                    res.status(400).json(erro);
                                                } else {
                                                    //Cadastrar a lista de membros externos da banca
                                                    sql = `INSERT INTO bancasxmembro_externo (id_banca, id_membroExterno, dataHoraCriacao) VALUES ?`;
                                                    conexao.query(sql, [arrayBancasXmembroExterno], (erro, resultados) => {
                                                        if (erro) {
                                                            res.status(400).json(erro);
                                                        } else {
                                                            sql = 'UPDATE orientandos SET ? WHERE id = ?';
                                                            conexao.query(sql, [
                                                                {
                                                                    fase_processo: 1
                                                                }, id_orientando], (erro, resultados) => {
                                                                    if (erro) {
                                                                        res.status(400).json({ status: 400, msg: erro });
                                                                    } else {

                                                                        res.status(200).json({ status: 200, msg: "Banca cadastrada com sucesso" });
                                                                        enviarEmail("angelligruponexus@gmail.com,gabrielbatistagruponexus@gmail.com,renata@enberuniversity.com,tobiaseducanexus@gmail.com", "Mensagem sobre registro de banca!",
                                                                            `<p><b>O orientador(a) ${orientador}</b> registrou uma nova banca de ${id_tipoBanca === 1 ? "qualificação" : "defesa"} para o <b>orientando ${orientando}</b> que está prevista para acontecer às ${moment(data_horaPrevista).format('HH:mm')} no dia ${moment(data_horaPrevista).format('DD/MM/YYYY')}.<p/>
                                                                        <p>Acesse o link <a href="https://www.gestorgruponexus.com.br/">https://www.gestorgruponexus.com.br/</a> para verificar!.<p/>`);
                                                                    }
                                                                });
                                                        }
                                                    });
                                                }
                                            })
                                        }
                                    });
                                }
                            }
                        });
                    } else {
                        sql = `SELECT usuarios.nome AS orientando FROM orientandos 
                        INNER JOIN usuarios ON usuarios.id = orientandos.id_usuario
                        WHERE orientandos.id = ?`;

                        conexao.query(sql, [id_orientando], (erro, resultados) => {
                            if (erro) {
                                res.status(400).json({ status: 400, msg: erro });
                            } else {
                                res.status(400).json({
                                    msg: `É necessário a confirmação da taxa de pagamento pela secretaria da Enber University é para a realização do cadastro da banca de qualificação. Caso a taxa não tenha sido confirmada, não será possível realizar o cadastramento da banca.`, status: 400
                                });

                                enviarEmail("renata@enberuniversity.com", "Tentativa de registro de banca!",
                                    `<b>${orientador}, orientador(a) do orientando ${resultados[0].orientando} tentou registrar a banca de qualificação, mas é preciso confirmar a taxa de qualificação antes de prosseguir. Para verificar,  acesse o link <a href="https://www.gestorgruponexus.com.br/">https://www.gestorgruponexus.com.br/</a>."<b/>`);
                            }
                        });

                    }
                }
            });
            return;
        }

        sql = `SELECT usuarios.nome, orientandos.status_confirmacaoBancaD FROM orientandos 
        INNER JOIN usuarios ON usuarios.id = orientandos.id_usuario
        WHERE orientandos.id = ? AND orientandos.status_confirmacaoBancaD = ?`;

        conexao.query(sql, [id_orientando, 2], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {

                //Verfica se a taxa de defesa foi paga
                if (resultados.length > 0) {
                    orientando = resultados[0].nome;
                    sql = `SELECT usuarios.nome AS orientando, cursos.nome AS curso, 
                tipo_banca.nome AS tipo_banca FROM bancas
                INNER JOIN orientandos ON bancas.id_orientando = orientandos.id
                INNER JOIN cursos ON cursos.id = orientandos.id_curso
                INNER JOIN tipo_banca ON tipo_banca.id = bancas.id_tipoBanca
                INNER JOIN usuarios ON orientandos.id_usuario = usuarios.id
                WHERE bancas.id_orientando = ? AND bancas.id_tipoBanca = ? OR 
                bancas.data_horaPrevista = ?`;

                    conexao.query(sql, [id_orientando, id_tipoBanca, moment(data_horaPrevista).utc().format('YYYY-MM-DD')], (erro, resultados) => {
                        if (erro) {
                            res.status(400).json({ status: 400, msg: erro });
                            console.log(erro)
                        } else {
                            if (resultados.length > 0) {
                                res.status(400).json({
                                    msg: `Já existe uma banca de ${resultados[0].tipo_banca}
                                    para ${resultados[0].orientando.substr(-1) === "a" || resultados[0].orientando.substr(-1) === "i" ? ` a aluna ` : ` o aluno `} ${resultados[0].orientando} do curso de ${resultados[0].curso + `.`}
                                    `, status: 400
                                });
                                return;
                            } else {

                                const bancaDatada = { id_orientando, id_orientador, id_tipoBanca, id_linhaPesquisa, data_horaPrevista, titulo, title, resumo, palavra_chave, dataHoraCriacao, status: 1 };
                                sql = `INSERT INTO bancas SET ?`;
                                conexao.query(sql, bancaDatada, (erro, resultados) => {
                                    if (erro) {
                                        res.status(400).json(erro);
                                    } else {
                                        const idBanca = resultados.insertId;

                                        arraySelectedMembrosInternos.map(membroInterno => {
                                            arrayBancasXmembroInterno.push([
                                                idBanca, membroInterno.value, dataHoraCriacao
                                            ])
                                        });

                                        arraySelectedMembrosExternos.map(membroExterno => {
                                            arrayBancasXmembroExterno.push([
                                                idBanca, membroExterno.value, dataHoraCriacao
                                            ])
                                        });

                                        //Cadastrar a lista de membros internos da banca
                                        sql = `INSERT INTO bancasxmembro_interno (id_banca, id_membroInterno, dataHoraCriacao) VALUES ?`;
                                        conexao.query(sql, [arrayBancasXmembroInterno], (erro, resultados) => {
                                            if (erro) {
                                                res.status(400).json(erro);
                                            } else {
                                                //Cadastrar a lista de membros externos da banca
                                                sql = `INSERT INTO bancasxmembro_externo (id_banca, id_membroExterno, dataHoraCriacao) VALUES ?`;
                                                conexao.query(sql, [arrayBancasXmembroExterno], (erro, resultados) => {
                                                    if (erro) {
                                                        res.status(400).json(erro);
                                                    } else {
                                                        sql = 'UPDATE orientandos SET ? WHERE id = ?';
                                                        conexao.query(sql, [
                                                            {
                                                                fase_processo: 2
                                                            }, id_orientando], (erro, resultados) => {
                                                                if (erro) {
                                                                    res.status(400).json({ status: 400, msg: erro });
                                                                } else {
                                                                    res.status(200).json({ status: 200, msg: "Banca cadastrada com sucesso" });
                                                                    enviarEmail("angelligruponexus@gmail.com,gabrielbatistagruponexus@gmail.com,renata@enberuniversity.com,tobiaseducanexus@gmail.com", "Mensagem sobre registro de banca!",
                                                                        `<p><b>O orientador(a) ${orientador}</b> registrou uma nova banca de ${id_tipoBanca === 1 ? "qualificação" : "defesa"} para o <b>orientando ${orientando}</b> que está prevista para acontecer às ${moment(data_horaPrevista).format('HH:mm')} no dia ${moment(data_horaPrevista).format('DD/MM/YYYY')}.<p/>
                                                                        <p>Acesse o link <a href="https://www.gestorgruponexus.com.br/">https://www.gestorgruponexus.com.br/</a> para verificar!.<p/>`);

                                                                }
                                                            });
                                                    }
                                                });
                                            }
                                        })
                                    }
                                });
                            }
                        }
                    });
                } else {
                    sql = `SELECT usuarios.nome AS orientando FROM orientandos 
                    INNER JOIN usuarios ON usuarios.id = orientandos.id_usuario
                    WHERE orientandos.id = ?`;

                    conexao.query(sql, [id_orientando], (erro, resultados) => {
                        if (erro) {
                            res.status(400).json({ status: 400, msg: erro });
                        } else {
                            res.status(400).json({
                                msg: `É necessário a confirmação da taxa de pagamento pela secretaria da Enber University é para a realização do cadastro da banca de qualificação. Caso a taxa não tenha sido confirmada, não será possível realizar o cadastramento da banca.`, status: 400
                            });

                            enviarEmail("renata@enberuniversity.com", "Tentativa de registro de banca!",
                                `<b>${orientador}, orientador(a) do orientando ${resultados[0].orientando} tentou registrar a banca de defesa, mas é preciso confirmar a taxa de defesa antes de prosseguir. Para verificar,  acesse o link <a href="https://www.gestorgruponexus.com.br/">https://www.gestorgruponexus.com.br/</a>."<b/>`);
                        }
                    });
                }
            }
        });
    }

    altera(id_banca, valores, id_permissao, res) {
        let sql = ``;
        const { email_orientador, email_orientando, id_orientando, orientando, valor,
            data_pagamento, observacao, id_tipoBanca, status } = valores;

        if (id_permissao.includes(permissoes.secretaria)) {
            sql = 'UPDATE bancas SET ? WHERE id = ?';
            conexao.query(sql, [{ valor, data_pagamento: moment(data_pagamento).format('YYYY-MM-DD HH:mm:ss'), observacao, status }, id_banca], (erro, resultados) => {
                if (erro) {
                    res.status(400).json({ status: 400, msg: erro });
                } else {
                    //Enviar email de confirmação de pagamento da banca para o orientador e o aluno!
                    enviarEmail(`${email_orientador},${email_orientando}`, "Confirmação de pagamento da banca!",
                        `A banca de ${id_tipoBanca === 1 ? "qualificação" : "defesa"} do orientando ${orientando} foi confirmada com sucesso.`,
                        `A banca de ${id_tipoBanca === 1 ? "qualificação" : "defesa"} do orientando ${orientando} foi confirmada com sucesso.`);

                    res.status(200).json({ status: 200, msg: "Atualizado com sucesso." });
                }
            });
        }

        if (id_permissao.includes(permissoes.orientadores)) {
            sql = `UPDATE orientandos SET ? WHERE id = ?`;
            console.log(id_tipoBanca, id_orientando);

            conexao.query(sql, [id_tipoBanca === 1 ? { status_confirmacaoBancaQ: 7 } : { status_confirmacaoBancaD: 7 }, id_orientando], (erro, resultados) => {
                if (erro) {
                    res.status(400).json({ status: 400, msg: erro });
                } else {
                    res.status(200).json({ status: 200, msg: "Atualizado com sucesso." });
                    return
                }
            });
        }
    }

    lista(id_tipoBanca, id_areaConcentracao, res) {
        const sql = `SELECT bancas.id, bancas.title, bancas.titulo, orientandos.id AS id_orientando, linhas_pesquisas.id_areaConcentracao, 
        linhas_pesquisas.nome AS linha_pesquisa, areas_concentracao.nome AS areaConcentracao,
        DATE_FORMAT(bancas.data_horaPrevista,'%d/%m/%Y %H:%i:%s') AS data_horaPrevista, 
        DATE_FORMAT(bancas.data_horaPrevista,'%Y/%m/%d') AS dataFormatAmericano,
        usuarios.nome AS orientando, usuarios.email AS email_orientando, cursos.nome AS curso, 
        tipo_banca.id AS id_tipoBanca, tipo_banca.nome AS tipo_banca, bancas.status,
        (SELECT usuarios.id FROM usuarios WHERE usuarios.id = bancas.id_orientador) AS id_orientador,
        (SELECT UPPER(usuarios.nome) FROM usuarios WHERE usuarios.id = bancas.id_orientador) AS orientador,
        (SELECT usuarios.email FROM usuarios WHERE usuarios.id = bancas.id_orientador) AS email_orientador,
        (SELECT orientador.assinatura FROM orientador WHERE orientador.id_usuario = bancas.id_orientador) 
        AS assinatura_presidente, orientandos.id_curso, 
        (SELECT tipo_banca.nome FROM tipo_banca WHERE tipo_banca.id = orientandos.fase_processo) AS fase_processo,
        DATE_FORMAT(orientandos.dataHoraInicialFaseProcesso, "%d-%m-%Y %H:%i:%s") AS dataHoraInicialFaseProcessoTb, 
        DATE_FORMAT(orientandos.dataHoraFinalFaseProcesso, "%d-%m-%Y %H:%i:%s") AS dataHoraFinalFaseProcessoTb, 
        DATE_FORMAT(orientandos.dataHoraConclusao, "%d-%m-%Y %H:%i:%s") AS dataHoraConclusaoTb,
        ata.id AS id_ata, ata.link, ata.titulo_teseOuDissertacao, ata.status AS id_statusAta,
        ata.quant_pag, (SELECT status.nome FROM status WHERE status.id = ata.status) AS status_ata,
        DATE_FORMAT(bancas.data_horaPrevista, "%M %d, %Y") AS dtCadAta,
        DATE_FORMAT(orientandos.dt_confirmacaoTaxaQ, "%d-%m-%Y %H:%i:%s") AS dt_confirmacaoTaxaQ,
        IF(orientandos.status_confirmacaoBancaQ = 1, "AGUARDANDO", IF(orientandos.status_confirmacaoBancaQ = 7, "FINALIZADA", "CONFIRMADO")) AS status_confirmacaoBancaQ,
        DATE_FORMAT(orientandos.dt_confirmacaoTaxaD, "%d-%m-%Y %H:%i:%s") AS dt_confirmacaoTaxaD,
        IF(orientandos.status_confirmacaoBancaD = 1, "AGUARDANDO", IF(orientandos.status_confirmacaoBancaD = 7, "FINALIZADA", "CONFIRMADO")) AS status_confirmacaoBancaD,
        orientandos.observacao, 
        bancas.id_membroInterno, 
		(SELECT UPPER(usuarios.nome) FROM usuarios WHERE usuarios.id =  bancas.id_membroInterno)
        AS membro_interno,
        (SELECT orientador.assinatura FROM orientador WHERE orientador.id_usuario = bancas.id_membroInterno)
        AS assinatura_membroInterno,
        bancas.id_membroExterno,
        (SELECT UPPER(usuarios.nome) FROM membro_externo 
		INNER JOIN usuarios ON membro_externo.id_usuario = usuarios.id
		WHERE bancas.id_membroExterno = membro_externo.id_usuario)
        AS membro_externo,
         (SELECT membro_externo.assinatura FROM membro_externo WHERE bancas.id_membroExterno = membro_externo.id_usuario)
        AS assinatura_membroExterno,
        ficha_avaliacao.id AS id_fichaAvaliacao, orientandos.id_linhaPesquisa,
        ficha_avaliacao.titulo_projeto, ficha_avaliacao.pergunta_condutora,
        ficha_avaliacao.hipotese, ficha_avaliacao.fundamentacao_teorica,
        ficha_avaliacao.objetivo, ficha_avaliacao.metodo, ficha_avaliacao.cronograma,
        ficha_avaliacao.conclusao_avaliacao, ficha_avaliacao.resumoQ1,
        ficha_avaliacao.resumoQ2, ficha_avaliacao.resumoQ2, ficha_avaliacao.resumoQ3,
        ficha_avaliacao.resumoQ4, ficha_avaliacao.resumoQ5, ficha_avaliacao.resumoQ6,
        ficha_avaliacao.resumoQ7, ficha_avaliacao.resumoQ8,
        (CASE
            WHEN DATE_FORMAT(ficha_avaliacao.dataHoraCriacao, "%M") = 'January' THEN DATE_FORMAT(ficha_avaliacao.dataHoraCriacao, "%d de Janeiro de %Y") 
            WHEN DATE_FORMAT(ficha_avaliacao.dataHoraCriacao, "%M") = 'February' THEN DATE_FORMAT(ficha_avaliacao.dataHoraCriacao, "%d de Fevereiro de %Y")
            WHEN DATE_FORMAT(ficha_avaliacao.dataHoraCriacao, "%M") = 'March' THEN DATE_FORMAT(ficha_avaliacao.dataHoraCriacao, "%d de Março de %Y")
            WHEN DATE_FORMAT(ficha_avaliacao.dataHoraCriacao, "%M") = 'April' THEN DATE_FORMAT(ficha_avaliacao.dataHoraCriacao, "%d de Abril de %Y")
            WHEN DATE_FORMAT(ficha_avaliacao.dataHoraCriacao, "%M") = 'May' THEN DATE_FORMAT(ficha_avaliacao.dataHoraCriacao, "%d de Maio de %Y")
            WHEN DATE_FORMAT(ficha_avaliacao.dataHoraCriacao, "%M") = 'June' THEN DATE_FORMAT(ficha_avaliacao.dataHoraCriacao, "%d de Junho de %Y")
            WHEN DATE_FORMAT(ficha_avaliacao.dataHoraCriacao, "%M") = 'July' THEN DATE_FORMAT(ficha_avaliacao.dataHoraCriacao, "%d de Julho de %Y")
            WHEN DATE_FORMAT(ficha_avaliacao.dataHoraCriacao, "%M") = 'August' THEN DATE_FORMAT(ficha_avaliacao.dataHoraCriacao, "%d de Agosto de %Y")
            WHEN DATE_FORMAT(ficha_avaliacao.dataHoraCriacao, "%M") = 'September' THEN DATE_FORMAT(ficha_avaliacao.dataHoraCriacao, "%d de Setembro de %Y")
            WHEN DATE_FORMAT(ficha_avaliacao.dataHoraCriacao, "%M") = 'October' THEN DATE_FORMAT(ficha_avaliacao.dataHoraCriacao, "%d de Outubro de %Y")
            WHEN DATE_FORMAT(ficha_avaliacao.dataHoraCriacao, "%M") = 'November' THEN DATE_FORMAT(ficha_avaliacao.dataHoraCriacao, "%d de Novembro de %Y")
            WHEN DATE_FORMAT(ficha_avaliacao.dataHoraCriacao, "%M") = 'December' THEN DATE_FORMAT(ficha_avaliacao.dataHoraCriacao, "%d de Dezembro de %Y")
        END) AS dataFichaAvaliacaoPtBr, 
        folha_aprovacao.id AS idFolhaDeAprovacao, folha_aprovacao.titulo_teseOuDissertacao, 
        DATE_FORMAT(folha_aprovacao.dataAprovacao, "%Y-%m-%d") AS dtFolhaAprovacao,
      	declaracao_orientacao.id As idDeclaracaoOrientacao,
        declaracao_orientacao.codigo_validacao AS codigoDeclaracaoDeOrientacao,
        DATE_FORMAT(declaracao_orientacao.dataHoraCriacao, "%M %d, %Y") AS dataDeclaracaoDeOrientacaoEnUs,
        (CASE
            WHEN DATE_FORMAT(declaracao_orientacao.dataHoraCriacao, "%M") = 'January' THEN DATE_FORMAT(declaracao_orientacao.dataHoraCriacao, "%d de Janeiro de %Y") 
            WHEN DATE_FORMAT(declaracao_orientacao.dataHoraCriacao, "%M") = 'February' THEN DATE_FORMAT(declaracao_orientacao.dataHoraCriacao, "%d de Fevereiro de %Y")
            WHEN DATE_FORMAT(declaracao_orientacao.dataHoraCriacao, "%M") = 'March' THEN DATE_FORMAT(declaracao_orientacao.dataHoraCriacao, "%d de Março de %Y")
            WHEN DATE_FORMAT(declaracao_orientacao.dataHoraCriacao, "%M") = 'April' THEN DATE_FORMAT(declaracao_orientacao.dataHoraCriacao, "%d de Abril de %Y")
            WHEN DATE_FORMAT(declaracao_orientacao.dataHoraCriacao, "%M") = 'May' THEN DATE_FORMAT(declaracao_orientacao.dataHoraCriacao, "%d de Maio de %Y")
            WHEN DATE_FORMAT(declaracao_orientacao.dataHoraCriacao, "%M") = 'June' THEN DATE_FORMAT(declaracao_orientacao.dataHoraCriacao, "%d de Junho de %Y")
            WHEN DATE_FORMAT(declaracao_orientacao.dataHoraCriacao, "%M") = 'July' THEN DATE_FORMAT(declaracao_orientacao.dataHoraCriacao, "%d de Julho de %Y")
            WHEN DATE_FORMAT(declaracao_orientacao.dataHoraCriacao, "%M") = 'August' THEN DATE_FORMAT(declaracao_orientacao.dataHoraCriacao, "%d de Agosto de %Y")
            WHEN DATE_FORMAT(declaracao_orientacao.dataHoraCriacao, "%M") = 'September' THEN DATE_FORMAT(declaracao_orientacao.dataHoraCriacao, "%d de Setembro de %Y")
            WHEN DATE_FORMAT(declaracao_orientacao.dataHoraCriacao, "%M") = 'October' THEN DATE_FORMAT(declaracao_orientacao.dataHoraCriacao, "%d de Outubro de %Y")
            WHEN DATE_FORMAT(declaracao_orientacao.dataHoraCriacao, "%M") = 'November' THEN DATE_FORMAT(declaracao_orientacao.dataHoraCriacao, "%d de Novembro de %Y")
            WHEN DATE_FORMAT(declaracao_orientacao.dataHoraCriacao, "%M") = 'December' THEN DATE_FORMAT(declaracao_orientacao.dataHoraCriacao, "%d de Dezembro de %Y")
        END) AS dataDeclaracaoDeOrientacaoPtBr
        FROM bancas
        LEFT JOIN orientandos ON bancas.id_orientando = orientandos.id
        INNER JOIN cursos ON cursos.id = orientandos.id_curso
        INNER JOIN tipo_banca ON tipo_banca.id = bancas.id_tipoBanca 
        INNER JOIN usuarios ON orientandos.id_usuario = usuarios.id
        INNER JOIN linhas_pesquisas ON bancas.id_linhaPesquisa = linhas_pesquisas.id
        INNER JOIN areas_concentracao ON areas_concentracao.id = linhas_pesquisas.id_areaConcentracao
        LEFT JOIN ata ON ata.id_banca = bancas.id
        LEFT JOIN ficha_avaliacao ON ficha_avaliacao.id_banca = bancas.id
        LEFT JOIN folha_aprovacao ON folha_aprovacao.id_banca = bancas.id
        LEFT JOIN declaracao_orientacao on bancas.id = declaracao_orientacao.id_banca 
        WHERE bancas.id_tipoBanca = ? AND linhas_pesquisas.id_areaConcentracao = ? order by bancas.id DESC`;

        conexao.query(sql, [id_tipoBanca, id_areaConcentracao], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, resultados, id_tipoBanca: Number(id_tipoBanca), id_areaConcentracao: Number(id_areaConcentracao) });
            }
        });
    }

    listaDeDeclaracoes(id_banca, res) {
        const sql = `SELECT usuarios.id, orientandos.id_curso, usuarios.nome AS membro, usuarios.sexo, declaracao_participacao.codigo_validacao, 
        DATE_FORMAT(declaracao_participacao.dataHoraCriacao, "%d/%m/%Y %H:%i:%s") AS dataHoraCriacao,
        bancas.titulo AS titulo_banca, 
        (SELECT usuarios.nome FROM usuarios WHERE usuarios.id = orientandos.id_usuario) AS orientando,
        (SELECT cursos.nome FROM cursos WHERE cursos.id = orientandos.id_curso) AS curso,
        CONCAT(DATE_FORMAT(bancas.data_horaPrevista, "%d/%m/%Y, at "),
          TIME_FORMAT(bancas.data_horaPrevista, '%r')) AS data_horaPrevistaEnUs,
        DATE_FORMAT(bancas.data_horaPrevista, "%d/%m/%Y às %Hh%i") AS data_horaPrevistaPtBr,
        DATE_FORMAT(declaracao_participacao.dataHoraCriacao, "%M %d, %Y") AS dataDeclaracaoEnUs,
        (CASE
            WHEN DATE_FORMAT(declaracao_participacao.dataHoraCriacao, "%M") = 'January' THEN DATE_FORMAT(declaracao_participacao.dataHoraCriacao, "dia %d de Janeiro de %Y") 
            WHEN DATE_FORMAT(declaracao_participacao.dataHoraCriacao, "%M") = 'February' THEN DATE_FORMAT(declaracao_participacao.dataHoraCriacao, "dia %d de Fevereiro de %Y")
            WHEN DATE_FORMAT(declaracao_participacao.dataHoraCriacao, "%M") = 'March' THEN DATE_FORMAT(declaracao_participacao.dataHoraCriacao, "dia %d de Março de %Y")
            WHEN DATE_FORMAT(declaracao_participacao.dataHoraCriacao, "%M") = 'April' THEN DATE_FORMAT(declaracao_participacao.dataHoraCriacao, "dia %d de Abril de %Y")
            WHEN DATE_FORMAT(declaracao_participacao.dataHoraCriacao, "%M") = 'May' THEN DATE_FORMAT(declaracao_participacao.dataHoraCriacao, "dia %d de Maio de %Y")
            WHEN DATE_FORMAT(declaracao_participacao.dataHoraCriacao, "%M") = 'June' THEN DATE_FORMAT(declaracao_participacao.dataHoraCriacao, "dia %d de Junho de %Y")
            WHEN DATE_FORMAT(declaracao_participacao.dataHoraCriacao, "%M") = 'July' THEN DATE_FORMAT(declaracao_participacao.dataHoraCriacao, "dia %d de Julho de %Y")
            WHEN DATE_FORMAT(declaracao_participacao.dataHoraCriacao, "%M") = 'August' THEN DATE_FORMAT(declaracao_participacao.dataHoraCriacao, "dia %d de Agosto de %Y")
            WHEN DATE_FORMAT(declaracao_participacao.dataHoraCriacao, "%M") = 'September' THEN DATE_FORMAT(declaracao_participacao.dataHoraCriacao, "dia %d de Setembro de %Y")
            WHEN DATE_FORMAT(declaracao_participacao.dataHoraCriacao, "%M") = 'October' THEN DATE_FORMAT(declaracao_participacao.dataHoraCriacao, "dia %d de Outubro de %Y")
            WHEN DATE_FORMAT(declaracao_participacao.dataHoraCriacao, "%M") = 'November' THEN DATE_FORMAT(declaracao_participacao.dataHoraCriacao, "dia %d de Novembro de %Y")
            WHEN DATE_FORMAT(declaracao_participacao.dataHoraCriacao, "%M") = 'December' THEN DATE_FORMAT(declaracao_participacao.dataHoraCriacao, "dia %d de Dezembro de %Y")
        END) AS dataDeclaracaoPtBr
        FROM declaracao_participacao 
        INNER JOIN usuarios ON usuarios.id = declaracao_participacao.id_usuario
        INNER JOIN bancas ON bancas.id = declaracao_participacao.id_banca
        INNER JOIN orientandos ON orientandos.id = bancas.id_orientando
        WHERE declaracao_participacao.id_banca = ? ORDER BY declaracao_participacao.id DESC`;
        conexao.query(sql, [id_banca], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, resultados });
                console.log(resultados)
            } 
        });
    }

    listaDeMembrosDaBanca(id_banca, res) {
        const sql = `SELECT bancas.id AS id_banca, bancas.id_orientador,
        (SELECT usuarios.nome FROM usuarios WHERE usuarios.id = bancas.id_orientador) AS orientador,
        GROUP_CONCAT(DISTINCT bancasxmembro_interno.id_membroInterno) AS id_membros_internos, 
        GROUP_CONCAT(DISTINCT bancasxmembro_externo.id_membroExterno) AS id_membros_externos,
        GROUP_CONCAT(DISTINCT (SELECT usuarios.nome FROM usuarios 
        WHERE usuarios.id = orientador.id_usuario)) AS membros_internos,
        GROUP_CONCAT(DISTINCT (SELECT usuarios.nome FROM usuarios 
        WHERE usuarios.id = membro_externo.id_usuario)) AS membros_externos,
        GROUP_CONCAT(DISTINCT (SELECT usuarios.id FROM usuarios 
        WHERE usuarios.id = orientador.id_usuario)) AS id_usuarios_internos,
        GROUP_CONCAT(DISTINCT (SELECT usuarios.id FROM usuarios 
        WHERE usuarios.id = membro_externo.id_usuario)) AS id_usuarios_externos
        FROM bancas 
        INNER JOIN bancasxmembro_interno ON bancasxmembro_interno.id_banca = bancas.id
        INNER JOIN bancasxmembro_externo ON bancasxmembro_externo.id_banca = bancas.id
        INNER JOIN orientador ON orientador.id = bancasxmembro_interno.id_membroInterno
        INNER JOIN membro_externo ON membro_externo.id = bancasxmembro_externo.id_membroExterno
        WHERE bancas.id = ?`;
        conexao.query(sql, [id_banca], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, resultados });
            }
        });
    }

    deleta(banca, res) {
        const { id_banca, id_tipoBanca, id_orientando } = banca;

        let sql = 'DELETE FROM bancas WHERE bancas.id = ?';

        conexao.query(sql, [id_banca], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                if (id_tipoBanca === 1) {
                    const dataHoraCriacao = moment().format('YYYY-MM-DD HH:mm:ss');
                    sql = 'UPDATE orientandos SET ? WHERE orientandos.id = ?';
                    conexao.query(sql, [{ status_confirmacaoBancaQ: 1, dt_confirmacaoTaxaQ: dataHoraCriacao }, id_orientando], (erro, resultados) => {
                        if (erro) {
                            res.status(400).json({ status: 400, msg: erro });
                        } else {
                            res.status(200).json({ status: 200, msg: "Banca excluida com sucesso!" });
                        }
                    });
                    return
                }
                res.status(200).json({ status: 200, msg: "Banca excluida com sucesso!" });
            }
        });
    }

}

module.exports = new Banca;