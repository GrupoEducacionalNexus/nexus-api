const moment = require('moment');

const conexao = require('../infraestrutura/conexao');

class FolhaAprovacao {
    
    adiciona(folha_aprovacao, res) {
        console.log(folha_aprovacao);
        const {id_banca, titulo_teseOuDissertacao, dataAprovacao} = folha_aprovacao;

        let dataHoraCriacao = moment().format('YYYY-MM-DD HH:mm:ss');

        const folhaAprovacaoDatada = { id_banca, titulo_teseOuDissertacao, dataAprovacao, dataHoraCriacao };

        let sql = `SELECT * FROM folha_aprovacao WHERE folha_aprovacao.id_banca = ?`;

        conexao.query(sql, [id_banca], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
                console.log(erro)
            } else {
                if (resultados.length > 0) {
                    res.status(400).json({ msg: `Já existe uma folha de aprovação registrada para essa banca!`, status: 400});
                } else {
                    sql = `INSERT INTO folha_aprovacao SET ?`;
                    conexao.query(sql, folhaAprovacaoDatada, (erro, resultados) => {
                        if (erro) {
                            res.status(400).json(erro);
                        } else {
                            res.status(200).json({ status: 200, msg: "Folha de aprovação cadastrada com sucesso" });
                        }
                    }); 
                }
            }
        });
    }

    altera(id, valores, res) {        
        let sql = 'UPDATE folha_aprovacao SET ? WHERE id = ?';
        conexao.query(sql, [valores, id], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro })
            } else {
                res.status(200).json({ status: 200, msg: "Atualizado com sucesso."});
            } 
        });
    } 
}

module.exports = new FolhaAprovacao;