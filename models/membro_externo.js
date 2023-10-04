const moment = require('moment');
const conexao = require('../infraestrutura/conexao');

class MembroExterno {

    adiciona(membro_externo, res) {
        const { nome, email, link_lattes, id_vinculoInstitucional, assinatura } = membro_externo;
        const dataHoraCriacao = moment().format('YYYY-MM-DD HH:mm:ss');
        let sql = `SELECT * FROM usuarios WHERE email = ?`;
        let id_usuario = 0
        conexao.query(sql, [email], (erro, resultados) => {
            if (erro) {
                res.status(400).json(erro);
            } else {
                if (resultados.length > 0) {
                    id_usuario = resultados[0].id;
                    sql = `SELECT * FROM membro_externo WHERE membro_externo.id_usuario = ?`;
                    conexao.query(sql, [id_usuario], (erro, resultados) => {
                        if (erro) {
                            res.status(400).json(erro);
                        } else {
                            if (resultados.length > 0) {
                                res.status(400).json({ msg: "O usuário já está cadastrado como membro.", status: 400 })
                            } else {
                                //Cadastro do membro externo
                                sql = `INSERT INTO membro_externo SET ?`;
                                conexao.query(sql, { id_usuario: id_usuario, link_lattes, vinculo_institucional: id_vinculoInstitucional, assinatura, dataHoraCriacao }, (erro, resultados) => {
                                    if (erro) {
                                        res.status(400).json(erro);
                                    } else {
                                        res.status(200).json({ status: 200, msg: "Usuário cadastrado com sucesso" });
                                    }
                                });
                            }
                        }
                    });
                    return
                } else {
                    const usuarioDatado = { nome, email, dataHoraCriacao }
                    sql = `INSERT INTO usuarios SET ?`;
                    conexao.query(sql, usuarioDatado, (erro, resultados) => {
                        if (erro) {
                            res.status(400).json(erro);
                        } else {
                            id_usuario = resultados.insertId;

                            //Cadastro do membro externo
                            sql = `INSERT INTO membro_externo SET ?`;
                            conexao.query(sql, { id_usuario: id_usuario, link_lattes, vinculo_institucional: id_vinculoInstitucional, assinatura, dataHoraCriacao }, (erro, resultados) => {
                                if (erro) {
                                    res.status(400).json(erro);
                                } else {
                                    res.status(200).json({ status: 200, msg: "Membro cadastrado com sucesso" });
                                }
                            });
                        }
                    });
                }
            }
        });
    }

    altera(id, valores, res) {
        const { nome, email, link_lattes, id_vinculoInstitucional, assinatura } = valores;
        let sql = `UPDATE usuarios SET ? WHERE usuarios.id = ?`;
        conexao.query(sql, [{nome, email}, id], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                sql = `UPDATE membro_externo SET ? WHERE membro_externo.id_usuario = ?`;
                conexao.query(sql, [{link_lattes, vinculo_institucional: id_vinculoInstitucional, assinatura}, id], (erro, resultados) => {
                    if (erro) {
                        res.status(400).json({ status: 400, msg: erro });
                    } else {
                        res.status(200).json({ status: 200, msg: "Membro atualizado com sucesso." });
                    }
                });
            }
        });

    }

    lista(res) {
        const sql = `SELECT membro_externo.id, membro_externo.id_usuario,
        membro_externo.link_lattes, vinculo_institucional.id AS id_vinculoInstitucional,
        vinculo_institucional.nome AS vinculo_institucional,
        membro_externo.assinatura, usuarios.nome, usuarios.email, 
        DATE_FORMAT(membro_externo.dataHoraCriacao, "%d-%m-%Y %H:%i:%s") AS dataHoraCriacao
        FROM membro_externo
        JOIN usuarios ON membro_externo.id_usuario = usuarios.id
        LEFT JOIN vinculo_institucional ON membro_externo.vinculo_institucional = vinculo_institucional.id
        ORDER BY membro_externo.id DESC`;

        conexao.query(sql, (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, resultados });
            }
        });
    }
}

module.exports = new MembroExterno;