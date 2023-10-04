const moment = require('moment');
const conexao = require('../infraestrutura/conexao');

class Plano {
    lista(res) {
        const sql = `SELECT * FROM planos`;

        conexao.query(sql, (erro, resultados) => {
            if(erro) {
                res.status(400).json({status: 400, msg: erro});
            } else {
                res.status(200).json({status: 200, resultados});
            }
        });
    }
}

module.exports = new Plano;