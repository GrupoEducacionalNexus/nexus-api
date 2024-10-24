const moment = require('moment');
const conexao = require('../infraestrutura/conexao');

class Permissao {
    lista(res) {
        const sql = `SELECT permissoes.id, permissoes.nome FROM permissoes`;

        conexao.query(sql, (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, resultados });
            }
        });
    }

    adiciona(usuario, callback) {
        const { id_permissao, id_usuario } = usuario;
        const dataHoraCriacao = moment().format('YYYY-MM-DD hh:mm:ss');
        const permisaoDatada = { id_usuario, id_permissao, dataHoraCriacao }
 
        const sql = `INSERT INTO usuariosxpermissoes SET ?`;
        conexao.query(sql, permisaoDatada, (erro, resultados) => {
            if (erro) {
                callback(erro, null);
            } else {
                callback(null, resultados);
            }
        });
    }

    verfificaPermissao() {
        let sql = `SELECT * FROM usuariosxpermissoes 
        WHERE usuariosxpermissoes.id_permissao = ? AND usuariosxpermissoes.id_usuario= ?`;

        conexao.query(sql, [id_permissao, usuario.id_usuario], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                if (resultados.length > 0) {
                    console.log(resultados);
                    sql = 'DELETE FROM `usuariosxpermissoes` WHERE usuariosxpermissoes.id IN (?)';

                    conexao.query(sql, [resultados[0].id], (erro, resultados) => {
                        if (erro) {
                            res.status(400).json({ status: 400, msg: erro });
                        } else {
                            console.log(resultados);
                            res.status(200).json({ status: 200, msg: "Permissão excluida com sucesso!", checked: 0 });
                        }
                    });
                    return
                }

                const dataHoraCriacao = moment().format('YYYY-MM-DD hh:mm:ss');
                const permisaoDatada = { id_usuario: usuario.id_usuario, id_permissao, dataHoraCriacao }

                sql = `INSERT INTO usuariosxpermissoes SET ?`;
                conexao.query(sql, permisaoDatada, (erro, resultados) => {
                    if (erro) {
                        res.status(400).json(erro);
                    } else {
                        res.status(200).json({ status: 200, msg: "Permissão cadastrado com sucesso", checked: 1 });
                    }
                });

            }
        });
    }

}

module.exports = new Permissao;