const moment = require('moment');
const conexao = require('../infraestrutura/conexao');
const enviarEmail = require('../services/send-email');
const Usuario = require('../models/usuarios');
const Permissao = require('../models/permissoes');

class Membro {
    adiciona(membro, res) {
        const { telefone, grau_escolaridade, nome, email,
            id_evento, codigo_validacao,
            id_estado, cidade, arrayGruposDeTrabalhosSelecionados,
            curso_formacao,
            instituicao_origem } = membro;

        let dataHoraCriacao = moment().format('YYYY-MM-DD HH:mm:ss');
        let id_usuario = 0;

        const mensagemConfirmacao = `<p style='text-align: justify;'>É com grande satisfação que informamos que sua inscrição no evento da Ivy Enber Christian University foi confirmada com sucesso!
        Como participante do evento, você tem acesso exclusivo ao sistema de submissão de artigos do grupo de trabalho.
        Utilize seu email de inscrição e a senha: 0 para acessar o sistema através do nosso site: <a href='https://www.gestorgruponexus.com.br/'>https://www.gestorgruponexus.com.br/</a>. 
        Estamos ansiosos para contar com sua valiosa contribuição e participação nessa experiência de aprendizado e colaboração.
        Se surgirem dúvidas ou necessitar de assistência, não hesite em nos contatar por meio de nossa central de atendimento via WhatsApp: Link para a central de atendimento.
        Agradecemos por fazer parte deste evento! Estamos empolgados para compartilhar esse momento de aprendizado e crescimento com você.
        Atenciosamente, Equipe Ivy Enber Christian University       
        </p>`;
        let sql = ``;

        Usuario.buscaPorEmail(email, (erro, resultados) => {
            if (erro) {
                console.error(erro);
                res.status(400).json(erro);
                return
            }

            console.log(resultados);

            //Verificar se o usuário já está cadastrado 
            if (resultados.length > 0) {
                id_usuario = resultados[0].id;
                //Busca na tabela de membros

                this.verificaInscricaoNoEvento({ id_usuario, id_evento }, (erro, resultados) => {
                    if (erro) {
                        console.log(erro);
                        res.status(400).json({
                            status: 400,
                            msg: erro
                        });
                        return;
                    }
                    //verificar se o membro está cadastrado no evento
                    if (resultados.length > 0) {
                        console.log(resultados);
                        res.status(400).json({ status: 400, msg: "Já possui inscrição no evento" });
                        return;
                    }

                    this.buscaPorId(id_usuario, (erro, resultados) => {
                        if (erro) {
                            console.log(erro);
                            res.status(400).json({
                                status: 400,
                                msg: erro
                            });
                            return;
                        }
                        if (resultados.length > 0) {
                            //Inscrição do usuário como membro e no evento
                            sql = `UPDATE membros SET ? WHERE membros.id_usuario = ?`;

                            conexao.query(sql, [{
                                grau_escolaridade, dataHoraCriacao, id_usuario, codigo_validacao,
                                id_estado, cidade, curso_formacao, instituicao_origem, comoSoube: 0
                            }, id_usuario], (erro, resultados) => {
                                if (erro) {
                                    console.log(erro);
                                    res.status(400).json(erro);
                                    return;
                                }
                                this.cadastrarMembroNoEvento({ id_usuario, id_evento, dataHoraCriacao }, (erro, resultados) => {
                                    if (erro) {
                                        console.log(erro);
                                        res.status(400).json({ status: 400, msg: erro });
                                        return
                                    }
                                    this.cadastrarMembroNoGrupoDeTrabalho(id_usuario, arrayGruposDeTrabalhosSelecionados, (erro, resultados) => {
                                        if (erro) {
                                            console.log(erro);
                                            console.log(erro);
                                            res.status(400).json({ status: 400, msg: erro });
                                            return
                                        }
                                        res.status(200).json({ status: 200, msg: "Inscrição realizado com sucesso!" });
                                        enviarEmail(`${email.trim()}`, `Confirmação de inscrição`, mensagemConfirmacao);
                                    });
                                });
                            });
                            return;
                        }

                        sql = `INSERT INTO membros SET ?`;

                        conexao.query(sql, [{
                            grau_escolaridade, dataHoraCriacao, id_usuario, codigo_validacao,
                            id_estado, cidade, curso_formacao, instituicao_origem, comoSoube: 0
                        }], (erro, resultados) => {
                            if (erro) {
                                console.log(erro);
                                res.status(400).json(erro);
                                return;
                            }
                            this.cadastrarMembroNoEvento({ id_usuario, id_evento, dataHoraCriacao }, (erro, resultados) => {
                                if (erro) {
                                    console.log(erro);
                                    res.status(400).json({ status: 400, msg: erro });
                                    return
                                }
                                this.cadastrarMembroNoGrupoDeTrabalho(id_usuario, arrayGruposDeTrabalhosSelecionados, (erro, resultados) => {
                                    if (erro) {
                                        console.log(erro);
                                        console.log(erro);
                                        res.status(400).json({ status: 400, msg: erro });
                                        return
                                    }
                                    res.status(200).json({ status: 200, msg: "Inscrição realizado com sucesso!" });
                                    enviarEmail(`${email.trim()}`, `Confirmação de inscrição`, mensagemConfirmacao);
                                });
                            });
                        });

                    });
                });
                return;
            }

            Usuario.adiciona({ nome, email, telefone, dataHoraCriacao }, (erro, resultados) => {
                if (erro) {
                    res.status(400).json(erro);
                    return
                }
                console.log(resultados);
                id_usuario = resultados.insertId;

                Permissao.adiciona({ id_usuario, id_permissao: 4 }, (erro, resultados) => {
                    if (erro) {
                        res.status(400).json({
                            status: 400,
                            msg: erro
                        });
                        return;
                    }

                    //Inscrição de membro no evento
                    sql = `INSERT INTO membros SET ?`;
                    conexao.query(sql, [{
                        grau_escolaridade, dataHoraCriacao, id_usuario, codigo_validacao,
                        id_estado, cidade, curso_formacao, instituicao_origem, comoSoube: 0
                    }], (erro, resultados) => {
                        if (erro) {
                            res.status(400).json(erro);
                            return;
                        }
                        this.cadastrarMembroNoEvento({ id_usuario, id_evento, dataHoraCriacao }, (erro, resultados) => {
                            if (erro) {
                                res.status(400).json({ status: 400, msg: erro });
                                return
                            }
                            this.cadastrarMembroNoGrupoDeTrabalho(id_usuario, arrayGruposDeTrabalhosSelecionados, (erro, resultados) => {
                                if (erro) {
                                    console.log(erro);
                                    res.status(400).json({ status: 400, msg: erro });
                                    return
                                }
                                res.status(200).json({ status: 200, msg: "Inscrição realizado com sucesso!" });
                                enviarEmail(`${email.trim()}`, `Confirmação de inscrição`, mensagemConfirmacao);
                            });
                        });
                    });
                });
            }); 
        });
    }

    verificaInscricaoNoEvento(usuario, callback) {
        const { id_usuario, id_evento } = usuario;
        const sql = `SELECT * FROM membrosxeventos WHERE membrosxeventos.id_usuario = ? AND membrosxeventos.id_evento = ?`;
        conexao.query(sql, [id_usuario, id_evento], (erro, resultados) => {
            if (erro) {
                callback(erro, null)
                return;
            }
            callback(null, resultados);
        });
    }

    cadastrarMembroNoEvento(usuario, callback) {
        //Realiza cadastro do membro no evento
        const { id_usuario, id_evento, dataHoraCriacao } = usuario;
        const sql = `INSERT INTO membrosxeventos SET ?`;
        conexao.query(sql, [{ id_usuario, id_evento, dataHoraCriacao }], (erro, resultados) => {
            if (erro) {
                callback(erro, null);
                return;
            }
            callback(null, resultados);
            //res.status(200).json({ status: 200, msg: "Inscrição realizado com sucesso!" });
            //enviarEmail(`${email.trim()}`, `Confirmação de inscrição`, mensagemConfirmacao);
        });
    }

    cadastrarMembroNoGrupoDeTrabalho(id_usuario, gruposDeTrabalho, callback) {
        console.log(gruposDeTrabalho);
        const dataHoraCriacao = moment().format('YYYY-MM-DD HH:mm:ss');

        let arrayTbMembrosXgruposTrabalho = [];
        arrayTbMembrosXgruposTrabalho = gruposDeTrabalho.map((item, index) =>
            [
                id_usuario,
                item.id,
                item.tipo,
                dataHoraCriacao
            ]
        );
        //Realiza cadastro do membro no evento
        const sql = `INSERT INTO membrosxgrupos_trabalho (id_membro, id_grupo_trabalho, tipo, dataHoraCriacao) VALUES ?`;
        conexao.query(sql, [arrayTbMembrosXgruposTrabalho], (erro, resultados) => {
            if (erro) {
                callback(erro, null);
                return;
            }
            callback(null, resultados);
            //res.status(200).json({ status: 200, msg: "Inscrição realizado com sucesso!" });
            //enviarEmail(`${email.trim()}`, `Confirmação de inscrição`, mensagemConfirmacao);
        });
    }

    buscaPorId(id, callback) {
        const sql = `SELECT * FROM membros WHERE membros.id_usuario = ?`;
        conexao.query(sql, [id], (erro, resultados) => {
            if (erro) {
                callback(erro, null)
                return;
            }
            callback(null, resultados);
        });
    }


    listaEventos(id_usuario, res) {
        const sql = `
        SELECT v.tema, GROUP_CONCAT(gt.link, ",") AS links, GROUP_CONCAT(gt.id) AS id_grupo_trabalho,
            GROUP_CONCAT(gt.nome, "/") AS grupos_trabalho, GROUP_CONCAT(mxgt.tipo) AS tipo_gt,
            date_format(v.dataEventoInicial, '%d/%m/%Y') AS dataEventoInicial, 
            date_format(v.dataEventoFinal, '%d/%m/%Y') AS dataEventoFinal
        FROM membrosxeventos mxe
            INNER JOIN eventos v ON v.id = mxe.id_evento
            INNER JOIN membros m ON m.id_usuario = mxe.id_usuario
            INNER JOIN membrosxgrupos_trabalho mxgt ON mxgt.id_membro = m.id_usuario
            INNER JOIN grupos_trabalho gt ON gt.id = mxgt.id_grupo_trabalho
        WHERE mxe.id_usuario = ? AND mxe.id_evento = 11 AND mxgt.id_grupo_trabalho in (8,9,10,11,12,13)`;
 
        conexao.query(sql, [id_usuario], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, resultados });
            }
        });
    }

    listaAnexos(id_usuario, id_gt, res) {
        const sql = `SELECT axmxgt.id, axmxgt.titulo, axmxgt.link, axmxgt.coautor, s.nome AS status 
        FROM anexosxmembrosxgt axmxgt
        INNER JOIN status s ON s.id = axmxgt.id_status
        WHERE axmxgt.id_usuario = ? AND axmxgt.id_gt = ?
        ORDER BY axmxgt.id DESC`;

        conexao.query(sql, [id_usuario, id_gt], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, resultados });
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