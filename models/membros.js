const moment = require('moment');
const conexao = require('../infraestrutura/conexao');
const enviarEmail = require('../services/send-email');

class Membro {
    adiciona(membro, res) {
        const { cpf_cnpj, telefone, vinculo_institucional, nome, email, id_permissao,
            id_evento, faco_parte, codigo_validacao, tipo_membro, id_grupo_trabalho, comoSoube } = membro;
        let dataHoraCriacao = moment().format('YYYY-MM-DD HH:mm:ss');
        let id_usuario = 0;
        const mensagemConfirmacao = `Olá,
        <p>Nós da equipe do I Congresso Internacional Ivy Enber Christian University estamos entrando em contato para informar que a sua inscrição foi realizada com sucesso. 
        Para acessar a página do evento, basta acessar o link abaixo, informar o email que você informou na inscrição, utilizar a senha 0 e selecionar o nível de permissão “Eventos”.
        <a href="https://www.gestorgruponexus.com.br/">https://www.gestorgruponexus.com.br/</a></p>
        <p>O evento acontecerá nos dias 11 e 12 de maio e temos certeza de que será uma experiência enriquecedora para todos os participantes.
        Lembramos que é importante que você acesse a página do evento caso você seja um aluno que tenha interesse em submeter o resumo do trabalho. O evento será transmitido 100% online e o link da transmissão será enviado para o email a qual você realizou a inscrição.
        O certificado será emitido de forma gratuita por meio da página do evento.</p>
        <p>Agradecemos por se inscrever no I Congresso Internacional Ivy Enber Christian University e estamos ansiosos para estarmos juntos em breve nessa experiência tão enriquecedora e importante para a sua carreira acadêmica e profissional.
        Atenciosamente,</p>
        <p>Atenciosamente,</p>
        <p>A equipe do I Congresso Internacional Ivy Enber Christian University</p>`;

        let sql = `SELECT * FROM usuarios WHERE usuarios.email = ?`;
        conexao.query(sql, [email], (erro, resultados) => {
            if (erro) {
                res.status(400).json(erro);
            } else {
                id_usuario = resultados.length > 0 ? resultados[0].id : 0;
                //Verifica se o usuário já esta cadastrado

                if (id_usuario === 0) {
                    //Cadastrar o membro como um usuário
                    sql = `INSERT INTO usuarios SET ?`;
                    conexao.query(sql, [{ cpf_cnpj, nome, email, senha: 0, dataHoraCriacao }], (erro, resultados) => {
                        if (erro) {
                            res.status(400).json(erro);
                        } else {
                            id_usuario = resultados.insertId;
                            console.log(id_usuario);

                            //Realiza cadastro em usuarioxpermissoes
                            sql = `INSERT INTO usuariosxpermissoes SET ?`;
                            conexao.query(sql, [{ id_usuario, id_permissao, dataHoraCriacao }], (erro, resultados) => {
                                if (erro) {
                                    res.status(400).json(erro);
                                } else {
                                    //Realiza cadastro do membro
                                    sql = `INSERT INTO membros SET ?`;
                                    conexao.query(sql, [{ telefone, vinculo_institucional, faco_parte, dataHoraCriacao, id_usuario, codigo_validacao, tipo_membro, comoSoube }], (erro, resultados) => {
                                        if (erro) {
                                            res.status(400).json(erro);
                                        } else {
                                            //Realiza cadastro do membro no evento
                                            sql = `INSERT INTO membrosxeventos SET ?`;
                                            conexao.query(sql, [{ id_usuario, id_evento, dataHoraCriacao }], (erro, resultados) => {
                                                if (erro) {
                                                    res.status(400).json(erro);
                                                } else {
                                                    if (id_grupo_trabalho > 0) {
                                                        //Realiza o cadastro do membro em grupo de trabalho
                                                        sql = `INSERT INTO membrosxgrupos_trabalho SET ?`;
                                                        conexao.query(sql, [{ id_membro: id_usuario, id_grupo_trabalho, dataHoraCriacao }], (erro, resultados) => {
                                                            if (erro) {
                                                                res.status(400).json(erro);
                                                            } else {
                                                                res.status(200).json({ status: 200, msg: "Cadastrado com sucesso!" });
                                                                enviarEmail(`${email.trim()}`, `Confirmação de inscrição`, mensagemConfirmacao);
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
                    });
                    return;
                }

                sql = `SELECT * FROM usuariosxpermissoes
                    WHERE usuariosxpermissoes.id_permissao = ? AND usuariosxpermissoes.id_usuario= ?`;

                conexao.query(sql, [id_permissao, id_usuario], (erro, resultados) => {
                    if (erro) {
                        res.status(400).json({ status: 400, msg: erro });
                    } else {
                        if (resultados.length > 0) {
                            //Verifica se o usuário já está cadastrado como membro
                            sql = `SELECT * FROM membros WHERE membros.id_usuario = ?`;
                            conexao.query(sql, [id_usuario], (erro, resultados) => {
                                if (erro) {
                                    res.status(400).json(erro);
                                } else {
                                    //Verifica se o usuário já está cadastrado no evento
                                    if (resultados.length > 0) {
                                        sql = `SELECT membrosxeventos.id FROM membrosxeventos
                                            WHERE membrosxeventos.id_usuario = ? AND membrosxeventos.id_evento = ?`;
                                        conexao.query(sql, [id_usuario, id_evento], (erro, resultados) => {
                                            if (erro) {
                                                res.status(400).json({ status: 400, msg: erro });
                                            } else {
                                                if (resultados.length > 0) {
                                                    //Verifica se o usuário já está cadastrado no grupo de trabalho
                                                    sql = `SELECT * FROM membrosxgrupos_trabalho
                                                        WHERE membrosxgrupos_trabalho.id_membro = ? AND
                                                        membrosxgrupos_trabalho.id_grupo_trabalho = ?`;
                                                    conexao.query(sql, [id_usuario, id_grupo_trabalho], (erro, resultados) => {
                                                        if (erro) {
                                                            res.status(400).json({ status: 400, msg: erro });
                                                        } else {
                                                            if (resultados.length > 0) {
                                                                res.status(400).json({ msg: "Você já está cadastrado nesse grupo de trabalho.", status: 400 });
                                                            } else {
                                                               
                                                                    sql = `INSERT INTO membrosxgrupos_trabalho SET ?`;
                                                                    conexao.query(sql, [{ id_membro: id_usuario, id_grupo_trabalho, dataHoraCriacao }], (erro, resultados) => {
                                                                        if (erro) {
                                                                            res.status(400).json(erro);
                                                                        } else {
                                                                            res.status(200).json({ status: 200, msg: "Cadastrado com sucesso!" });
                                                                            enviarEmail(`${email.trim()}`,
                                                                            `Confirmação de inscrição`, mensagemConfirmacao);
                                                                        }
                                                                    });

                                                            }
                                                        }
                                                    });

                                                } else {
                                                    //Realiza cadastro do membro no evento
                                                    sql = `INSERT INTO membrosxeventos SET ?`;
                                                    conexao.query(sql, [{ id_usuario, id_evento, dataHoraCriacao }], (erro, resultados) => {
                                                        if (erro) {
                                                            res.status(400).json(erro);
                                                        } else {
                                                            //Realiza o cadastro do membro em um grupo de trabalho
                                                            if (id_grupo_trabalho > 0) {
                                                                sql = `INSERT INTO membrosxgrupos_trabalho SET ?`;
                                                                conexao.query(sql, [{ id_membro: id_usuario, id_grupo_trabalho, dataHoraCriacao }], (erro, resultados) => {
                                                                    if (erro) {
                                                                        res.status(400).json(erro);
                                                                    } else {
                                                                        res.status(200).json({ status: 200, msg: "Cadastrado com sucesso!" });
                                                                        enviarEmail(`${email.trim()}`, `Confirmação de inscrição`, mensagemConfirmacao);
                                                                    }
                                                                });
                                                            }

                                                        }
                                                    });
                                                }
                                            }
                                        });
                                    } else {
                                        //Realiza cadastro de membro
                                        sql = `INSERT INTO membros SET ?`;
                                        conexao.query(sql, [{ telefone, vinculo_institucional, faco_parte, dataHoraCriacao, id_usuario, codigo_validacao, tipo_membro, comoSoube }], (erro, resultados) => {
                                            if (erro) {
                                                res.status(400).json(erro);
                                            } else {
                                                sql = `INSERT INTO membrosxeventos SET ?`;
                                                conexao.query(sql, [{ id_usuario, id_evento, dataHoraCriacao }], (erro, resultados) => {
                                                    if (erro) {
                                                        res.status(400).json(erro);
                                                    } else {
                                                        if (id_grupo_trabalho > 0) {
                                                            //Realiza o cadastro do membro em grupo de trabalho
                                                            sql = `INSERT INTO membrosxgrupos_trabalho SET ?`;
                                                            conexao.query(sql, [{ id_membro: id_usuario, id_grupo_trabalho, dataHoraCriacao }], (erro, resultados) => {
                                                                if (erro) {
                                                                    res.status(400).json(erro);
                                                                } else {
                                                                    res.status(200).json({ status: 200, msg: "Cadastrado com sucesso!" });
                                                                    enviarEmail(`${email.trim()}`, `Confirmação de inscrição`, mensagemConfirmacao);
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
                            const permisaoDatada = { id_usuario, id_permissao, dataHoraCriacao };

                            sql = `INSERT INTO usuariosxpermissoes SET ?`;
                            conexao.query(sql, permisaoDatada, (erro, resultados) => {
                                if (erro) {
                                    res.status(400).json(erro);
                                } else {
                                    //Realiza cadastro do membro
                                    sql = `INSERT INTO membros SET ?`;
                                    conexao.query(sql, [{ telefone, vinculo_institucional, faco_parte, dataHoraCriacao, id_usuario, codigo_validacao, tipo_membro, comoSoube }], (erro, resultados) => {
                                        if (erro) {
                                            res.status(400).json(erro);
                                        } else {
                                            //Realiza cadastro do membro no evento
                                            sql = `INSERT INTO membrosxeventos SET ?`;
                                            conexao.query(sql, [{ id_usuario, id_evento, dataHoraCriacao }], (erro, resultados) => {
                                                if (erro) {
                                                    res.status(400).json(erro);
                                                } else {
                                                    if (id_grupo_trabalho > 0) {
                                                        //Realiza o cadastro do membro em grupo de trabalho
                                                        sql = `INSERT INTO membrosxgrupos_trabalho SET ?`;
                                                        conexao.query(sql, [{ id_membro: id_usuario, id_grupo_trabalho, dataHoraCriacao }], (erro, resultados) => {
                                                            if (erro) {
                                                                res.status(400).json(erro);
                                                            } else {
                                                                res.status(200).json({ status: 200, msg: "Cadastrado com sucesso!" });
                                                                enviarEmail(`${email.trim()}`, `Confirmação de inscrição`, mensagemConfirmacao);
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
        });
    }

    listaEventos(id_usuario, res) {
        const sql = `SELECT membros.id, eventos.tema, usuarios.id AS id_usuario,
        usuarios.cpf_cnpj AS cpf, usuarios.nome AS nome_completo, usuarios.email,
        membros.codigo_validacao, membros.tipo_membro,
        date_format(eventos.dataEventoInicial, '%d/%m/%Y') AS dataEventoInicial, 
        date_format(eventos.dataEventoFinal, '%d/%m/%Y') AS dataEventoFinal,
        date_format(eventos.dataEventoFinal, '%Y/%m/%d') AS dataEventoFinalInvertida,
        eventos.carga_horaria,
        eventos.anexo, grupos_trabalho.id AS id_grupoTrabalho, grupos_trabalho.nome AS grupo_trabalho
        FROM membrosxeventos
        INNER JOIN usuarios ON membrosxeventos.id_usuario = usuarios.id
        INNER JOIN membros ON membrosxeventos.id_usuario = membros.id_usuario
        INNER JOIN eventos ON membrosxeventos.id_evento = eventos.id
        LEFT JOIN membrosxgrupos_trabalho ON membrosxgrupos_trabalho.id_membro = usuarios.id
        LEFT JOIN grupos_trabalho ON grupos_trabalho.id = membrosxgrupos_trabalho.id_grupo_trabalho
        WHERE membrosxeventos.id_usuario = ? GROUP BY grupos_trabalho.id ORDER BY eventos.id DESC`;

        conexao.query(sql, [id_usuario], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, resultados });
            }
        });
    }

    listaAnexos(id_usuario, id_grupoTrabalho, res) {
        const sql = `SELECT anexos.id, anexos.nome, anexos.link, 
        anexos.coautor FROM anexosxmembros 
        INNER JOIN anexos ON anexos.id = anexosxmembros.id_anexo
        WHERE anexosxmembros.id_usuario = ? AND anexosxmembros.id_grupoTrabalho = ? ORDER BY anexos.id DESC`;

        conexao.query(sql, [id_usuario, id_grupoTrabalho], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, resultados });
                // console.log(resultados);
            }
        });
    }

    verificarCodigoValidacaoDoCertificado(codigo, res) {
        const sql = `SELECT membros.codigo_validacao
        FROM membros WHERE membros.codigo_validacao = ?`;

        conexao.query(sql, [codigo], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, msg: resultados.length > 0 ? 1 : 0 });
            }
        });
    }

}

module.exports = new Membro;