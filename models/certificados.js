const moment = require('moment');
const conexao = require('../infraestrutura/conexao');
const enviarEmail = require('../services/send-email');

class Certificado { 
    
    adiciona(certificado, res) {
        const { cpf, nome_completo, curso, codigo_validacao,
            data_emissaoDoDiploma, numero_livro, numero_pagina, numero_registro, data_local } = certificado;
        let dataHoraCriacao = moment().format('YYYY-MM-DD HH:mm:ss');

        let sql = `SELECT usuarios.id, usuarios.cpf_cnpj, usuarios.nome
         FROM usuarios WHERE usuarios.cpf_cnpj = ?`;
 
        conexao.query(sql, [cpf], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                if (resultados.length > 0) {
                    sql = `INSERT INTO certificados SET ?`;
                    conexao.query(sql, { curso, id_usuario: resultados[0].id, dataHoraCriacao, codigo_validacao,
                        data_emissaoDoDiploma, numero_livro, numero_pagina, numero_registro, data_local }, (erro, resultados) => {
                        if (erro) {
                            res.status(400).json(erro);
                        } else {
                            res.status(200).json({ status: 200, msg: "Certificado cadastrado com sucesso" });
                        }
                    });
                    return
                }

                sql = `INSERT INTO usuarios SET ?`;
                conexao.query(sql, { cpf_cnpj: cpf, nome: nome_completo }, (erro, resultados) => {
                    if (erro) {
                        res.status(400).json(erro);
                    } else {
                        sql = `INSERT INTO certificados SET ?`;
                        conexao.query(sql, { curso, id_usuario: resultados.insertId, dataHoraCriacao, codigo_validacao,
                            data_emissaoDoDiploma, numero_livro, numero_pagina, numero_registro, data_local }, (erro, resultados) => {
                            if (erro) {
                                res.status(400).json(erro); 
                            } else {
                                res.status(200).json({ status: 200, msg: "Certificado cadastrado com sucesso" });
                            }
                        });
                    }
                });
            }
        });
    }

    altera(id, valores, res) {
        let sql = ``;

        const { id_usuario, cpf, nome_completo, curso,
            data_emissaoDoDiploma, numero_livro, numero_pagina, numero_registro, data_local } = valores;

        sql = `UPDATE usuarios SET ? WHERE usuarios.id = ?`;
        conexao.query(sql, [{ cpf_cnpj: cpf, nome: nome_completo }, id_usuario], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro })
            } else {
                sql = `UPDATE certificados SET ? WHERE certificados.id = ?`;
                conexao.query(sql, [{ curso, data_emissaoDoDiploma, numero_livro, numero_pagina, numero_registro, data_local }, id], (erro, resultados) => {
                    if (erro) {
                        res.status(400).json({ status: 400, msg: erro });
                    } else {
                        res.status(200).json({ status: 200, msg: "Certificado atualizado com sucesso." });
                    }
                });
            }
        });
    }

    lista(res) {
        const sql = `SELECT certificados.id, certificados.id_usuario, usuarios.cpf_cnpj, usuarios.nome, 
        certificados.curso, certificados.codigo_validacao, 
        certificados.numero_livro,
        certificados.numero_pagina, certificados.numero_registro,
        DATE_FORMAT(certificados.data_emissaoDoDiploma, "%Y-%m-%d") AS data_emissaoDoDiploma,
        DATE_FORMAT(certificados.data_local, "%Y-%m-%d") AS data_local
        FROM certificados 
        INNER JOIN usuarios ON usuarios.id = certificados.id_usuario
        ORDER BY certificados.id DESC`;

        conexao.query(sql, (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, resultados });
            }
        });
    }

    busca(codigo_validacao, res) {
        const sql = `SELECT certificados.id, certificados.id_usuario, usuarios.cpf_cnpj, usuarios.nome, 
        certificados.curso, certificados.codigo_validacao, 
        certificados.numero_livro,
        certificados.numero_pagina, certificados.numero_registro,
        DATE_FORMAT(certificados.data_emissaoDoDiploma, "%Y-%m-%d") AS data_emissaoDoDiploma,
        DATE_FORMAT(certificados.data_local, "%Y-%m-%d") AS data_local
        FROM certificados 
        INNER JOIN usuarios ON usuarios.id = certificados.id_usuario
        WHERE certificados.codigo_validacao = ?`;

        conexao.query(sql, [codigo_validacao], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, resultados });
            }
        });
    }

}

module.exports = new Certificado;