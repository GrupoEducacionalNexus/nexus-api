const moment = require('moment');
const conexao = require('../infraestrutura/conexao');
const socket = require('../services/socket');
const conectados = require('../services/conectados');
const { listaDeParticipantesDoChamado } = require('../services/participantesDoChamado');
const { registrarNoficacao } = require('../services/registrarNotificacao');
const { registrarComentario } = require('../services/registrarComentario');
const { buscarSetorResponsavel } = require('../services/buscarSetorResponsavel');

class Chamado {

    adiciona(chamado, res) {
        const { descricao, idTipoChamado,
            idPrioridade, valor, idSolicitante, idSetorSolicitante, idSetorResponsavel, idResponsavel, link,
            arraySelectedParticipantes, dataHoraFinalizacao
        } = chamado;

        const dataHoraCriacao = moment().format('YYYY-MM-DD HH:mm:ss');

        const chamadoDatado = {
            descricao, idTipoChamado,
            idPrioridade, valor: !isNaN(valor) ? 0 : parseFloat(valor), idSolicitante, idSetorResponsavel, idResponsavel: idResponsavel !== 0 ?
                idResponsavel : 0, status: 5, dataHoraCriacao, dataHoraFinalizacao
        }

        let sql = `INSERT INTO chamados SET ?`;
        conexao.query(sql, chamadoDatado, (erro, resultados) => {
            if (erro) {
                res.status(400).json(erro);
            } else {
                const io = socket.getIO();
                const id_chamado = resultados.insertId;

                //Preenchendo o arrayChamadosXsetores com idSetorSolicitante e idSetorResponsavel, caso não tenha participantes no chamado
                let arrayChamadosXsetores = [];

                if (parseInt(idSetorSolicitante) !== parseInt(idSetorResponsavel)) {
                    arrayChamadosXsetores.push([id_chamado, idSetorSolicitante, dataHoraCriacao]);
                    arrayChamadosXsetores.push([id_chamado, idSetorResponsavel, dataHoraCriacao]);
                }

                if (parseInt(idSetorSolicitante) === parseInt(idSetorResponsavel)) {
                    //arrayChamadosXsetores.push([id_chamado, idSetorSolicitante, dataHoraCriacao]);
                    arrayChamadosXsetores.push([id_chamado, idSetorResponsavel, dataHoraCriacao]);
                }

                if (arraySelectedParticipantes.length > 0) {
                    arraySelectedParticipantes.map(participante => {
                        arrayChamadosXsetores.push([id_chamado, participante.value, dataHoraCriacao]);
                    });
                }

                console.log(arrayChamadosXsetores);

                sql = `INSERT INTO chamadosxsetores (id_chamado, id_setor, dataHoraCriacao) VALUES ?`;
                conexao.query(sql, [arrayChamadosXsetores], (erro, resultados) => {
                    if (erro) {
                        res.status(400).json(erro);
                    } else {
                        if (link !== "") {
                            const anexoDatado = { id_usuario: idSolicitante, nome: 0, link, coautor: 0, dataHoraCriacao };

                            sql = `INSERT INTO anexos SET ?`;
                            conexao.query(sql, anexoDatado, (erro, resultados) => {
                                if (erro) {
                                    res.status(400).json(erro);
                                } else {
                                    const id_anexo = resultados.insertId;
                                    sql = `INSERT INTO anexosxchamados SET ?`;
                                    conexao.query(sql, { id_anexo, id_chamado, dataHoraCriacao }, (erro, resultados) => {
                                        if (erro) {
                                            res.status(400).json(erro);
                                        } else {
                                            res.status(200).json({ status: 200, msg: "Chamado enviado com sucesso." });

                                            listaDeParticipantesDoChamado(id_chamado).then(result => {
                                                console.log(result);
                                                result.map(item => {
                                                    if (conectados.find(objeto => objeto.nome === item.nome)) {
                                                        console.log(conectados.find(objeto => objeto.nome === item.nome).nome);
                                                        io.to(conectados.find(objeto => objeto.nome === item.nome).id).emit('notification', { message: `Um novo chamado com id ${id_chamado} foi solicitado` });
                                                    }
                                                    registrarNoficacao(`Um novo chamado com id ${id_chamado} foi solicitado`, 2, item.id_usuario);
                                                });
                                            });
                                        }
                                    });
                                }
                            });
                            return
                        }

                        const comentarioDatado = { id_usuario: idSolicitante, id_chamado, descricao: `A data de finalização foi definida para ${moment(dataHoraFinalizacao).format('DD/MM/YYYY')}`, dataHoraCriacao };
                        //Registrar a data de finalização do chamado
                        registrarComentario(comentarioDatado);

                        res.status(200).json({ status: 200, msg: "Chamado enviado com sucesso." });

                        listaDeParticipantesDoChamado(id_chamado).then(result => {
                            result.map(item => {
                                if (conectados.find(objeto => objeto.nome === item.nome)) {
                                    console.log(conectados.find(objeto => objeto.nome === item.nome).nome);
                                    io.to(conectados.find(objeto => objeto.nome === item.nome).id).emit('notification', { message: `Um novo chamado com id ${id_chamado} foi solicitado` });
                                }
                                registrarNoficacao(`Um novo chamado com id ${id_chamado} foi solicitado`, 2, item.id_usuario);
                            });
                        });
                    }
                });
            }
        });
    }

    altera(id, valores, req, res) {
        let sql = `SELECT chamados.idResponsavel, chamados.visualizado, chamados.status, 
        DATE_FORMAT(chamados.dataHoraFinalizacao, "%Y-%m-%d") AS dataHoraFinalizacao
        FROM chamados WHERE chamados.id = ?`;

        conexao.query(sql, [id], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                const { id_usuario, dataHoraFinalizacao, status, visualizado, idResponsavel } = valores;

                console.log(resultados);

                sql = `UPDATE chamados SET ? WHERE chamados.id = ?`;

                let chamadoDatado = {};

                if (visualizado !== undefined) {
                    chamadoDatado[`visualizado`] = visualizado;
                }

                const dataHoraFinalizacaoDeAlteracao = new Date(dataHoraFinalizacao);
                const dataHoraFinalizacaoDefinida = new Date(resultados[0].dataHoraFinalizacao);

                if (dataHoraFinalizacaoDeAlteracao > dataHoraFinalizacaoDefinida) {
                    chamadoDatado[`dataHoraFinalizacao`] = dataHoraFinalizacaoDeAlteracao;
                }

                if (status !== resultados[0].status && status !== undefined) {
                    chamadoDatado[`status`] = status;
                }

                if (parseInt(idResponsavel) !== parseInt(resultados[0].idResponsavel) && idResponsavel !== undefined) {
                    chamadoDatado[`idResponsavel`] = idResponsavel;
                }

                conexao.query(sql, [chamadoDatado, id], (erro, resultados) => {
                    if (erro) {
                        res.status(400).json({ status: 400, msg: erro });
                    } else {
                        const dataHoraCriacao = moment().format('YYYY-MM-DD HH:mm:ss');
                        let comentarioDatado = {};
                        let tipo_notificao = 0;

                        if (chamadoDatado[`visualizado`]) {
                            comentarioDatado = {
                                id_usuario, id_chamado: id, descricao: `O chamado com id ${id} foi visualizado`, dataHoraCriacao
                            };
                            tipo_notificao = 5; 
                        }

                        if (valores.hasOwnProperty('dataHoraFinalizacao')) {
                            comentarioDatado = {
                                id_usuario,
                                id_chamado: id,
                                descricao: `Data de conclusão do chamado com id ${id} foi atualizada para ${moment(dataHoraFinalizacao).format('DD/MM/YYYY')}`,
                                dataHoraCriacao
                            }
                            tipo_notificao = 6;
                        }

                        if (valores.hasOwnProperty('status')) {
                            comentarioDatado = {
                                id_usuario, id_chamado: id, descricao: `O status do chamado com id ${id} foi atualizado para ${parseInt(status) === 5 ? " solicitado" : parseInt(status) === 7 ? " finalizado" : parseInt(status) === 9 ? " em produção" : ""
                                    }`, dataHoraCriacao
                            };
                            tipo_notificao = 3;
                        }
 
                        if (valores.hasOwnProperty('idResponsavel')) {
                            comentarioDatado = {
                               id_usuario, id_chamado: id, descricao: `O chamado com id ${id} foi reatribuido`, dataHoraCriacao
                            };
                            tipo_notificao = 4;
                        }

                        sql = `INSERT INTO chamadosxcomentarios SET ?`;
                        conexao.query(sql, comentarioDatado, (erro, resultados) => {
                            if (erro) {
                                res.status(400).json(erro);
                            } else {
                                res.status(200).json({ status: 200, msg: "Atualizado com sucesso." });
                                const io = socket.getIO();
                                buscarSetorResponsavel(id).then(idSetorResponsavel => {
                                    listaDeParticipantesDoChamado(id).then(result => {
                                        result.map(item => {
                                            if (conectados.find(objeto => objeto.nome === item.nome)) {
                                                io.to(conectados.find(objeto => objeto.nome === item.nome).id).emit('notification', { message: comentarioDatado.descricao });
                                            }
                                            registrarNoficacao(comentarioDatado.descricao, tipo_notificao, item.id_usuario);
                                        });
                                    });
                                });
                                return
                            }
                        });
                    }
                });
            }
        });

    }

    busca(id, res) {
        let sql = `SELECT chamados.id, chamados.descricao, setores.nome AS setor_responsavel, chamados.idSetorResponsavel, tipos_chamados.id AS idTipoChamado,
        tipos_chamados.nome AS tipo_chamado, prioridades.id AS idPrioridade, prioridades.nome AS prioridade,
        chamados.visualizado, chamados.valor, 
        DATE_FORMAT(chamados.dataHoraCriacao, "%Y-%m-%d %H:%i") AS dataHoraCriacao,
        DATE_FORMAT(chamados.dataHoraFinalizacao, "%Y-%m-%d %H:%i") AS dataHoraFinalizacao,
        status.id AS id_status, status.nome AS status,
        (SELECT setores.nome FROM setores WHERE setores.id =
            usuarios.id_setor) AS setorSolicitante
        FROM chamados
        INNER JOIN tipos_chamados ON tipos_chamados.id = chamados.idTipoChamado
        INNER JOIN usuarios ON chamados.idSolicitante = usuarios.id
        INNER JOIN prioridades ON prioridades.id = chamados.idPrioridade
        INNER JOIN setores ON setores.id = chamados.idSetorResponsavel
        INNER JOIN status ON status.id = chamados.status
        WHERE chamados.id = ?`;

        conexao.query(sql, [id], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, resultados });
            }
        });
    }

    listaDeAnexos(idChamado, res) {
        const sql = `SELECT anexos.id, anexos.link, 
        usuarios.nome AS responsavel_anexo, 
        DATE_FORMAT(anexos.dataHoraCriacao, "%d-%m-%Y às %H:%i") AS dataHoraCriacao
        FROM anexosxchamados
        left JOIN anexos ON anexos.id = anexosxchamados.id_anexo
        INNER JOIN usuarios ON usuarios.id = anexos.id_usuario
        WHERE anexosxchamados.id_chamado = ?`;

        conexao.query(sql, [idChamado], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, resultados });
            }
        });
    }

    listaDeSetores(idChamado, res) {
        const sql = `SELECT setores.id, setores.nome, chamadosxsetores.dataHoraCriacao 
        FROM chamadosxsetores 
        INNER JOIN setores ON setores.id = chamadosxsetores.id_setor
        WHERE chamadosxsetores.id_chamado = ?`;

        conexao.query(sql, [idChamado], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, resultados });
            }
        });
    }

    listaDeComentarios(idChamado, res) {
        const sql = `SELECT chamadosxcomentarios.id_usuario, usuarios.nome,
        chamadosxcomentarios.descricao, chamadosxcomentarios.anexo,
        DATE_FORMAT(chamadosxcomentarios.dataHoraCriacao, "%d-%m-%Y às %H:%i") AS dataHoraCriacao
        FROM chamadosxcomentarios
        INNER JOIN chamados ON chamados.id = chamadosxcomentarios.id_chamado
        INNER JOIN usuarios ON usuarios.id = chamadosxcomentarios.id_usuario
        WHERE chamadosxcomentarios.id_chamado = ? ORDER BY chamadosxcomentarios.id DESC`;

        conexao.query(sql, [idChamado], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, resultados });

            }
        });
    }

    informacoesDoSolicitante(idSolicitante, idChamado, res) {
        const sql = `SELECT usuarios.id AS id_usuario, usuarios.nome, usuarios.email, setores.nome AS setor
        FROM chamados
        INNER JOIN usuarios on usuarios.id = chamados.idSolicitante
        INNER JOIN setores on setores.id = usuarios.id_setor
        WHERE usuarios.id = ? AND chamados.id = ?`;

        conexao.query(sql, [idSolicitante, idChamado], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, resultados });

            }
        });
    }
}

module.exports = new Chamado;