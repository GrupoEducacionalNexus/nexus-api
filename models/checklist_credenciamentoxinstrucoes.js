const moment = require('moment');
const conexao = require('../infraestrutura/conexao');

class ChecklistCredenciamentoXinstrucoes {

    adiciona(checklistCredenciamentoXinstrucoes, res) {
        const { id_checklist, descricao_instrucao } = checklistCredenciamentoXinstrucoes;
        let sql = `SELECT * FROM checklist_credenciamentoxinstrucoes 
        WHERE checklist_credenciamentoxinstrucoes.descricao = ?`;

        conexao.query(sql, [descricao_instrucao], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                if (resultados.length > 0) {
                    res.status(400).json({ status: 400, msg: "Já existe uma instrução com essa descrição" });
                    return
                }

                const dataHoraCriacao = moment().format('YYYY-MM-DD HH:mm:ss');
                const checklistCredenciamentoXInstrucaoDatada = { id_checklist, descricao: descricao_instrucao, dataHoraCriacao }

                sql = `INSERT INTO checklist_credenciamentoxinstrucoes SET ?`;

                conexao.query(sql, checklistCredenciamentoXInstrucaoDatada, (erro, resultados) => {
                    if (erro) {
                        res.status(400).json({ status: 400, msg: erro });
                    } else {
                        res.status(200).json({ status: 200, msg: "Instrução cadastrada com sucesso." });
                    }
                });
            }
        });
    }

    deleta(id, res) {
        const sql = 'DELETE FROM checklist_credenciamentoxinstrucoes WHERE checklist_credenciamentoxinstrucoes.id = ?';

        conexao.query(sql, [id], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, msg: "Item do checklist excluido com sucesso!" });
            }
        });
    }



}

module.exports = new ChecklistCredenciamentoXinstrucoes;