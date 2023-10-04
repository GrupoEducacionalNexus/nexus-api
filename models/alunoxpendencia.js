const moment = require('moment');
const conexao = require('../infraestrutura/conexao');

class AlunoXPendencia {

    altera(id, valores, res) {
        const sql = `UPDATE alunosxpendencias SET ? WHERE alunosxpendencias.id = ?`;
        conexao.query(sql, [valores, id], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, msg: "Pendência atualizado com sucesso." });
            }
        })
    }
}

module.exports = new AlunoXPendencia;