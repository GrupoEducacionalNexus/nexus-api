const moment = require('moment');
const conexao = require('../infraestrutura/conexao');
const enviarEmail = require('../services/send-email');
const permissoes = require('../helpers/permissoes');

class TipoSolicitacao {
    
    lista(res) {
        const sql = `SELECT * FROM tipo_solicitacao`;

        conexao.query(sql, (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, resultados });
            }
        });
    }

}

module.exports = new TipoSolicitacao;