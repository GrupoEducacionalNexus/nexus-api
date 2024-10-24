const moment = require('moment');
const conexao = require('../infraestrutura/conexao');

class LiderGt {
    adiciona(lider_gt, res) {
        const { id_usuario, id_grupoTrabalho, id_evento } = lider_gt;
        console.log(lider_gt);
        let dataHoraCriacao = moment().format('YYYY-MM-DD hh:mm:ss');
        let id_liderGt = 0;

        let sql = `SELECT lider_gt.id FROM lider_gt WHERE lider_gt.id_usuario = ?`;
        conexao.query(sql, [id_usuario], (erro, resultados) => {
            if (erro) {
                res.status(400).json(erro);
            } else {
                if (resultados.length > 0) {
                    id_liderGt = resultados[0].id
                    sql = `SELECT lider_gtxgrupo_trabalho.id_liderGt FROM lider_gtxgrupo_trabalho WHERE 
                            lider_gtxgrupo_trabalho.id_liderGt = ? AND 
                            lider_gtxgrupo_trabalho.id_grupoTrabalho = ?`;
                    conexao.query(sql, [id_liderGt, id_grupoTrabalho], (erro, resultados) => {
                        if (erro) {
                            res.status(400).json(erro);
                        } else {
                            if (resultados.length > 0) {
                                res.status(400).json({ msg: "O usuário já é lider desse grupo de trabalho!", status: 400 })
                            } else {
                                const lider_gtXgrupo_trabalhoDatado = { id_liderGt, id_grupoTrabalho, id_evento, dataHoraCriacao };
                                //Cadastro do orientandos
                                sql = `INSERT INTO lider_gtxgrupo_trabalho SET ?`;
                                conexao.query(sql, lider_gtXgrupo_trabalhoDatado, (erro, resultados) => {
                                    if (erro) {
                                        res.status(400).json(erro);
                                    } else {
                                        res.status(200).json({ status: 200, msg: "Lider cadastrado com sucesso" });
                                    }
                                });
                            }
                        }
                    })
                } else {
                    const liderGtDatado = { id_usuario, dataHoraCriacao };
                    sql = `INSERT INTO lider_gt SET ?`;

                    conexao.query(sql, liderGtDatado, (erro, resultados) => {
                        if (erro) {
                            res.status(400).json(erro);
                        } else {

                            const lider_gtXgrupo_trabalhoDatado = { id_liderGt, id_grupoTrabalho, id_evento, dataHoraCriacao };
                            //Cadastro do orientandos
                            sql = `INSERT INTO lider_gtxgrupo_trabalho SET ?`;
                            conexao.query(sql, lider_gtXgrupo_trabalhoDatado, (erro, resultados) => {
                                if (erro) {
                                    res.status(400).json(erro);
                                } else {
                                    res.status(200).json({ status: 200, msg: "Lider cadastrado com sucesso" });
                                }
                            });
                        }
                    });
                }
            }
        });
    }

    listaGruposDeTrabalho(id_usuario, res) {
        const sql = `SELECT lxgt.id_grupoTrabalho, gt.nome
        FROM lider_gtxgrupo_trabalho lxgt
        INNER JOIN lider_gt ON lider_gt.id = lxgt.id_liderGt
        INNER JOIN grupos_trabalho gt ON gt.id = lxgt.id_grupoTrabalho
        WHERE (SELECT usuarios.id FROM usuarios WHERE usuarios.id = lider_gt.id_usuario) = ?
        AND gt.id_evento = 11`;

        conexao.query(sql, [id_usuario], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, resultados });
            }
        });
    }
}

module.exports = new LiderGt;