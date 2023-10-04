const moment = require('moment');
const conexao = require('../infraestrutura/conexao');

class Pendencia {
    adiciona(pendencia, res) {
        console.log(pendencia);
        const {id_usuario, nome} = pendencia;
        let dataHoraCriacao = moment().format('YYYY-MM-DD hh:mm:ss');
        const pendenciaDatada = {nome, id_usuario, dataHoraCriacao};
        let sql = `SELECT * FROM pendencias WHERE nome = ?`;

        conexao.query(sql, [nome], (erro, resultados) => {
            if (erro) {
                res.status(400).json({status: 400, msg: erro});
            } else {
                if (resultados.length > 0) {
                    res.status(400).json({ msg: "Já existe uma pendência cadastrada com esse nome.", status: 400 })
                } else {
                //Cadastro do ciclo
                sql = `INSERT INTO pendencias SET ?`;
                    conexao.query(sql, pendenciaDatada, (erro, resultados) => {
                        if (erro) {
                            res.status(400).json(erro);
                        } else {
                            res.status(201).json({ status: 200, msg: "Pendência cadastrada com sucesso" });
                        }
                    });
                }
            }
        });
    }

    listaPendencias(res) {
        const sql = `SELECT pendencias.id, pendencias.nome, date_format(pendencias.dataHoraCriacao, '%d/%m/%Y') as dataHoraCriacao
                    FROM pendencias ORDER BY pendencias.id DESC`;

        conexao.query(sql, (erro, resultados) => {
            if(erro) {
                res.status(400).json({status: 400, msg: erro});
            } else {
                res.status(200).json({status: 200, resultados});
            }
        });
    }

    
}

module.exports = new Pendencia;