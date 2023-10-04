const moment = require('moment');
const conexao = require('../infraestrutura/conexao');

class DeclaracaoOrientacao {
    adiciona(declaracao_orientacao, res) {
        const { id_usuario, codigo_validacao, id_banca } = declaracao_orientacao;
        let dataHoraCriacao = moment().format('YYYY-MM-DD HH:mm:ss');

        let sql = `SELECT * FROM declaracao_orientacao WHERE declaracao_orientacao.id_banca = ?`;
         
        conexao.query(sql, [id_banca], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                if (resultados.length > 0) { 
                    res.status(400).json({
                        msg: `Já existe uma declaração de orientação para essa banca`, status: 400
                    });
                    return
                } 

                const declaracaoDeOrientacaoDatada = { codigo_validacao, id_banca, id_usuario, dataHoraCriacao };
                sql = `INSERT INTO declaracao_orientacao SET ?`; 
                conexao.query(sql, declaracaoDeOrientacaoDatada, (erro, resultados) => {
                    if (erro) {
                        res.status(400).json(erro);
                    } else {
                        res.status(200).json({ status: 200, msg: "Declaração de orientação cadastrada com sucesso" });
                    }
                });
            }
        });
    }

}

module.exports = new DeclaracaoOrientacao;