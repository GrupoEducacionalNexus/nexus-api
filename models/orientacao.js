const moment = require('moment');

const conexao = require('../infraestrutura/conexao');
const enviarEmail = require('../services/send-email');
const permissoes = require('../helpers/permissoes');

class Orientacao {
    adiciona(orientacao, res) {
        const { link, id_orientador, id_orientando, observacao, data_horaPrevista, nomeArquivo, anexo } = orientacao;

        let dataHoraCriacao = moment().format('YYYY-MM-DD HH:mm:ss');
        let sql = `SELECT * FROM orientacao WHERE orientacao.dataHoraPrevista = ?`;

        conexao.query(sql, [data_horaPrevista], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                if (resultados.length > 0) {
                    res.status(400).json({ msg: `Já existe uma orientação cadastrada na data e hora informada.`, status: 400 });
                } else {
                    const orientacaoDatada = { link, id_orientador, id_orientando, observacao, dataHoraPrevista: data_horaPrevista.split(',').join(''), dataHoraCriacao };

                    sql = `INSERT INTO orientacao SET ?`;
                    conexao.query(sql, orientacaoDatada, (erro, resultados) => {
                        if (erro) {
                            res.status(400).json(erro);
                        } else {
                            if (anexo.length > 0) {
                                const id_orientacao = resultados.insertId;
                                const anexoDatado = { id_usuario: id_orientando, nome: nomeArquivo, link: anexo, coautor: 0, dataHoraCriacao };
                                sql = `INSERT INTO anexos SET ?`;
                                conexao.query(sql, anexoDatado, (erro, resultados) => {
                                    if (erro) {
                                        res.status(400).json(erro);
                                    } else {
                                        const id_anexo = resultados.insertId;
                                        sql = `INSERT INTO orientacaoxanexos SET ?`;
                                        conexao.query(sql, { id_orientacao, id_anexo, dataHoraCriacao }, (erro, resultados) => {
                                            if (erro) {
                                                res.status(400).json(erro);
                                            } else {
                                                sql = `SELECT usuarios.email, usuarios.nome FROM orientandos 
                                                            INNER JOIN usuarios ON orientandos.id_usuario = usuarios.id
                                                            WHERE orientandos.id = ?`;

                                                conexao.query(sql, [id_orientando], (erro, resultados) => {
                                                    if (erro) {
                                                        res.status(400).json({ status: 400, msg: erro });
                                                    } else {
                                                            enviarEmail(`tobiasferraz34@gmail.com`, "Mensagem sobre o registro de orientação",
                                                            `<b>${resultados[0].nome}, uma nova orientação foi registra, acesse o link <a href="https://www.gestorgruponexus.com.br/">https://www.gestorgruponexus.com.br/</a> para verificar!</b>`);
                                                        res.status(200).json({ status: 200, msg: "Orientação cadastrada com sucesso" });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                                return;
                            }

                            sql = `SELECT usuarios.email FROM orientandos 
                            INNER JOIN usuarios ON orientandos.id_usuario = usuarios.id
                            WHERE orientandos.id = ?`;

                            conexao.query(sql, [id_orientando], (erro, resultados) => {
                                if (erro) {
                                    res.status(400).json({ status: 400, msg: erro });
                                } else {
                                    enviarEmail(`${resultados[0].email}`, "REGISTRO DE ORIENTAÇÃO", `NÃO RESPONDA A ESSA MENSAGEM - ${"Uma orientação foi Registrada para você".toLocaleUpperCase()}\n acesse o sistema para mais informações`,
                                        `${resultados[0].email}`, "REGISTRO DE ORIENTAÇÃO", `NÃO RESPONDA A ESSA MENSAGEM - ${"Uma orientação foi Registrada para você".toLocaleUpperCase()}\n acesse o sistema para mais informações`);
                                    res.status(200).json({ status: 200, msg: "Orientação cadastrada com sucesso" });
                                }
                            });

                        }
                    });
                }
            }
        });
    }

    altera(id_orientacao, valores, res) {
        const dataHoraCriacao = moment().format('YYYY-MM-DD HH:mm:ss');
        const { id_orientando, link, observacao, data_horaPrevista, nomeArquivo, anexo } = valores;
        const orientacao_datada = { link, observacao, dataHoraPrevista: data_horaPrevista, dataHoraCriacao };

        let sql = 'UPDATE orientacao SET ? WHERE id = ?';
        conexao.query(sql, [orientacao_datada, id_orientacao], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro })
            } else {
                if (anexo.length > 0) {
                    const anexoDatado = { id_usuario: id_orientando, nome: nomeArquivo, link: anexo, coautor: 0, dataHoraCriacao };
                    sql = `INSERT INTO anexos SET ?`;
                    conexao.query(sql, anexoDatado, (erro, resultados) => {
                        if (erro) {
                            res.status(400).json(erro);
                        } else {
                            const id_anexo = resultados.insertId;
                            sql = `INSERT INTO orientacaoxanexos SET ?`;
                            conexao.query(sql, { id_orientacao, id_anexo, dataHoraCriacao }, (erro, resultados) => {
                                if (erro) {
                                    res.status(400).json(erro);
                                } else {
                                    res.status(200).json({ status: 200, msg: "Orientação atualizado com sucesso." });
                                }
                            });
                        }
                    });
                    return;
                }
                res.status(200).json({ status: 200, msg: "Orientação atualizado com sucesso." });
            }
        });
    }

    lista(id_areaConcentracao = 0, res) {
        const sql = `SELECT orientacao.id, orientacao.id_orientando,  (SELECT orientador.id_areaConcentracao FROM orientador WHERE orientador.id_usuario = usuarios.id) AS id_areaConcentracao,
        (SELECT usuarios.nome FROM usuarios WHERE usuarios.id = orientandos.id_usuario) AS orientando,
        (SELECT usuarios.nome FROM usuarios WHERE usuarios.id = orientacao.id_orientador) AS orientador,
        orientacao.link, orientacao.observacao,
        DATE_FORMAT(orientacao.dataHoraPrevista, "%Y-%m-%d %H:%i:%s") AS dataHoraPrevista, orientacao.anexo
        FROM orientacao
        INNER JOIN orientandos ON orientacao.id_orientando = orientandos.id
        INNER JOIN usuarios ON orientacao.id_orientador = usuarios.id
        WHERE (SELECT orientador.id_areaConcentracao FROM orientador WHERE orientador.id_usuario = usuarios.id) = ?
        GROUP BY (SELECT orientador.id_areaConcentracao FROM orientador WHERE orientador.id_usuario = usuarios.id),
        orientacao.id
		   ORDER BY orientacao.id_orientador DESC`;

        conexao.query(sql, [id_areaConcentracao], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, resultados });
            }
        });
    }

    listaAnexos(id_orientacao, res) {

        let sql = `SELECT anexos.id, anexos.nome, anexos.link,  
        DATE_FORMAT(anexos.dataHoraCriacao, "%d-%m-%Y %H:%i") AS dataHoraCriacao
        FROM orientacaoxanexos
        INNER JOIN orientacao ON orientacao.id = orientacaoxanexos.id_orientacao
        INNER JOIN anexos ON anexos.id = orientacaoxanexos.id_anexo
        WHERE orientacao.id = ? ORDER BY anexos.id DESC`;

        conexao.query(sql, [id_orientacao], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {

                const resultadosAnexosDaOrientacao = resultados;
                sql = `SELECT anexos.id, anexos.nome, anexos.link,  
            DATE_FORMAT(anexos.dataHoraCriacao, "%d-%m-%Y %H:%i") AS dataHoraCriacao
            FROM orientacaoxanexosxorientandos
            INNER JOIN orientacao ON orientacao.id = orientacaoxanexosxorientandos.id_orientacao
            INNER JOIN anexos ON anexos.id = orientacaoxanexosxorientandos.id_anexo
            WHERE orientacao.id = ? ORDER BY anexos.id DESC`;

                conexao.query(sql, [id_orientacao], (erro, resultados) => {
                    if (erro) {
                        res.status(400).json({ status: 400, msg: erro });
                    } else {
                        const resultadosAnexosDoOrientando = resultados;
                        res.status(200).json({ status: 200, resultadosAnexosDaOrientacao, resultadosAnexosDoOrientando });
                        console.log(resultados);
                    }
                });
 
            }

        });
    }

    deleta(id_banca, res) {
        let sql = 'DELETE FROM bancas WHERE bancas.id = ?';

        conexao.query(sql, [id_banca], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, msg: "Banca excluida com sucesso!" });
            }
        });
    }

}

module.exports = new Orientacao;