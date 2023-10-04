const moment = require('moment');
const conexao = require('../infraestrutura/conexao');

class LinhasPesquisas {
    lista(area_concentracao, res) {
        const sql = `SELECT linhas_pesquisas.id, linhas_pesquisas.nome AS linha_pesquisa
        FROM linhas_pesquisas
        LEFT JOIN areas_concentracao ON
        linhas_pesquisas.id_areaConcentracao = areas_concentracao.id
        WHERE linhas_pesquisas.id_areaConcentracao = ?`;
        conexao.query(sql, [area_concentracao], (erro, resultados) => {
            if(erro) {
                res.status(400).json({status: 400, msg: erro});
            } else {
                res.status(200).json({status: 200, resultados});
            }
        });
    }

    
}

module.exports = new LinhasPesquisas;