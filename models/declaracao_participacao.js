const moment = require('moment');
const conexao = require('../infraestrutura/conexao');
const enviarEmail = require('../services/send-email');

class DeclaracaoParticipacao {
    adiciona(declaracao, res) {
        const { id_usuario, codigo_validacao, id_banca } = declaracao;
        let dataHoraCriacao = moment().format('YYYY-MM-DD HH:mm:ss');

        let sql = `SELECT declaracao_participacao.id_usuario, (SELECT COUNT(declaracao_participacao.id_banca) from declaracao_participacao WHERE declaracao_participacao.id_banca = ?)
          AS quant_dec
         FROM declaracao_participacao WHERE declaracao_participacao.id_usuario = ? AND declaracao_participacao.id_banca = ?`;
         
        conexao.query(sql, [id_banca, id_usuario, id_banca], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                if (resultados.length > 0) { 
                    if(resultados[0].quant_dec === 3) {
                        res.status(400).json({
                            msg: `Não é mais possível gerar declarações!`, status: 400
                        });
                        return
                    }
                    res.status(400).json({
                        msg: `Já existe uma declaração para esse membro`, status: 400
                    });
                    return
                } 

                const declaracaoDatada = { id_usuario, codigo_validacao, id_banca, dataHoraCriacao };
                sql = `INSERT INTO declaracao_participacao SET ?`;
                conexao.query(sql, declaracaoDatada, (erro, resultados) => {
                    if (erro) {
                        res.status(400).json(erro);
                    } else {
                        res.status(200).json({ status: 200, msg: "Declaração cadastrada com sucesso" });
                    }
                });
            }
        });
    }
}

module.exports = new DeclaracaoParticipacao;