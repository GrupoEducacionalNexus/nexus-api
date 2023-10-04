const moment = require('moment');
const conexao = require('../infraestrutura/conexao');

class Instituicao {
    
    lista(cnpj, res) {
        const sql = `SELECT instituicoes.id AS id_instituicao, instituicoes.cnpj, instituicoes.nome_fantasia, instituicoes.razao_social FROM instituicoes ${cnpj.length > 0 ? ` WHERE instituicoes.cnpj = '${cnpj}'` : ``}`;

        conexao.query(sql, (erro, resultados) => {
            if(erro) {
                res.status(400).json({status: 400, msg: erro});
            } else {
                res.status(200).json({status: 200, resultados});
            }
        });
    }

    
}

module.exports = new Instituicao;