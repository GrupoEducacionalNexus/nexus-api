const moment = require('moment');

const conexao = require('../infraestrutura/conexao');

class Ata {
    
    adiciona(ata, res) {
        console.log(ata)
        const {
            id_banca, 
            titulo_teseOuDissertacao, 
            quant_pag, 
            status
        } = ata;

        let dataHoraCriacao = moment().format('YYYY-MM-DD HH:mm:ss');

        const ataDatada = {
            titulo_teseOuDissertacao, 
            quant_pag: parseInt(quant_pag), 
            status: parseInt(status), 
            dataHoraCriacao, 
            id_banca 
        };

        let sql = `SELECT * FROM ata WHERE ata.id_banca = ?`;

        conexao.query(sql, [id_banca], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
                console.log(erro)
            } else {
                if (resultados.length > 0) {
                    res.status(400).json({ msg: `Já existe uma ATA registrada para essa banca!`, status: 400});
                } else {
                    sql = `INSERT INTO ata SET ?`;
                    conexao.query(sql, ataDatada, (erro, resultados) => {
                        if (erro) {
                            res.status(400).json(erro);
                        } else {
                            res.status(200).json({ status: 200, msg: "ATA cadastrada com sucesso" });
                        }
                    }); 
                }
            }
        });
    }

    altera(id_ata, valores, res) {
        const {
            id_banca,
            titulo_teseOuDissertacao,
            quant_pag,
            status 
        } = valores; 

            const ataDatada = { 
                titulo_teseOuDissertacao, 
                quant_pag: parseInt(quant_pag), 
                status: parseInt(status), 
                id_banca 
            };
        
        let sql = 'UPDATE ata SET ? WHERE id = ?';
        conexao.query(sql, [ataDatada, id_ata], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro })
            } else {
                res.status(200).json({ status: 200, msg: "Atualizado com sucesso."});
            } 
        });
    } 
}

module.exports = new Ata;