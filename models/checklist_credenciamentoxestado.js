const moment = require('moment');
const conexao = require('../infraestrutura/conexao');

class ChecklistCredenciamentoXestado {

    adiciona(checklistCredenciamentoXestado, res) {
        const { id_checklist, id_estado } = checklistCredenciamentoXestado;
        let sql = `SELECT checklist_credenciamento.nome FROM checklist_credenciamentoxestado
        INNER JOIN checklist_credenciamento on checklist_credenciamento.id = checklist_credenciamentoxestado.id_checklist
        WHERE checklist_credenciamentoxestado.id_checklist = ? 
        AND checklist_credenciamentoxestado.id_estado = ?`;

        conexao.query(sql, [id_checklist, id_estado], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                if (resultados.length > 0) {
                    res.status(400).json({ status: 400, msg: "Item do checklist já está associado ao estado!" });
                    return
                }

                const dataHoraCriacao = moment().format('YYYY-MM-DD HH:mm:ss');
                const checklistCredenciamentoXestadoDatado = { id_checklist, id_estado, dataHoraCriacao }

                sql = `INSERT INTO checklist_credenciamentoxestado SET ?`;

                conexao.query(sql, checklistCredenciamentoXestadoDatado, (erro, resultados) => {
                    if (erro) {
                        res.status(400).json({ status: 400, msg: erro });
                    } else {
                        res.status(200).json({ status: 200, msg: "Item do checklist associado com sucesso." });
                    }
                });
            }
        });
    }

    deleta(id, res) {
        const sql = 'DELETE FROM checklist_credenciamentoxestado WHERE checklist_credenciamentoxestado.id = ?';

        conexao.query(sql, [id], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, msg: "Item do checklist excluido com sucesso!" });
            }
        });
    }



}

module.exports = new ChecklistCredenciamentoXestado;