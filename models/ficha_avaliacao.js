const moment = require('moment');

const conexao = require('../infraestrutura/conexao');

class FichaAvaliacao {

    adiciona(ficha_avaliacao, res) {
        const { titulo_projeto, pergunta_condutora,
            hipotese, fundamentacao_teorica,
            objetivo, metodo, cronograma,
            conclusao_avaliacao, resumoQ1,
            resumoQ2, resumoQ3, resumoQ4,
            resumoQ5, resumoQ6, resumoQ7, resumoQ8, id_banca } = ficha_avaliacao;

        let dataHoraCriacao = moment().format('YYYY-MM-DD HH:mm:ss');

        const FichaAvaliacaoDatada = { titulo_projeto, pergunta_condutora,
            hipotese, fundamentacao_teorica,
            objetivo, metodo, cronograma,
            conclusao_avaliacao, resumoQ1,
            resumoQ2, resumoQ3, resumoQ4,
            resumoQ5, resumoQ6, resumoQ7, resumoQ8, dataHoraCriacao, id_banca };

        let sql = `SELECT * FROM ficha_avaliacao WHERE ficha_avaliacao.id_banca = ?`;

        conexao.query(sql, [id_banca], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
                console.log(erro)
            } else {
                if (resultados.length > 0) {
                    res.status(400).json({ msg: `Já existe uma ficha de avaliação registrada para essa banca!`, status: 400});
                } else {
                    sql = `INSERT INTO ficha_avaliacao SET ?`;
                    conexao.query(sql, FichaAvaliacaoDatada, (erro, resultados) => {
                        if (erro) {
                            res.status(400).json(erro);
                        } else {
                            res.status(200).json({ status: 200, msg: "Ficha de avaliação cadastrada com sucesso" });
                        }
                    });
                }
            }
        });
    }

    altera(id_fichaAvaliacao, valores, res) {
        let sql = 'UPDATE ficha_avaliacao SET ? WHERE id = ?';
        conexao.query(sql, [valores, id_fichaAvaliacao], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro })
            } else {
                res.status(200).json({ status: 200, msg: "Atualizado com sucesso."});
            } 
        });

    }

    
}

module.exports = new FichaAvaliacao;