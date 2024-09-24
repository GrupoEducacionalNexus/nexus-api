// src/models/checklist_credenciamento.js
const moment = require('moment');
const conexao = require('../infraestrutura/conexao');

class ChecklistCredenciamento {

    adiciona( checklistCredenciamento, res) {
        const { descricao } = checklistCredenciamento;

        const dataHoraCriacao = moment().format('YYYY-MM-DD HH:mm:ss');
        const checklistCredenciamentoDatado = { nome: descricao, dataHoraCriacao }
        
        const sql = `INSERT INTO checklist_credenciamento SET ?`;   

        conexao.query(sql, checklistCredenciamentoDatado, (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                
                res.status(200).json({ status: 200, msg: "Item do checklist cadastrado com sucesso." });
            }
        });
    }

    altera(id, valores, res) {
        const { descricao } = valores;

        const sql = `UPDATE checklist_credenciamento SET ? WHERE checklist_credenciamento.id = ?`;
        conexao.query(sql, [{ nome: descricao  }, id], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, msg: "Atualizado com sucesso." });
            }
        });
    }
    
    lista(res) {
        const sql = `SELECT * FROM checklist_credenciamento`;

        conexao.query(sql, (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, resultados });
            }
        });
    }

    anexosDoChecklistCredenciamento(id_checklist_credenciamento, id_credenciamento, res) {
        
        const sql = `SELECT documento_credenciamento.id_credenciamento, status.id AS id_status,
        status.nome AS status, documento_credenciamento.anexo,
        documento_credenciamento.observacao,
        DATE_FORMAT(documento_credenciamento.dataHoraCriacao, "%d-%m-%Y") AS dataHoraCriacao
        FROM documento_credenciamento
        INNER JOIN status on status.id = documento_credenciamento.status
        WHERE documento_credenciamento.id_checklist_credenciamento = ? AND 
        documento_credenciamento.id_credenciamento = ?
        ORDER BY documento_credenciamento.id DESC;`;
    
        conexao.query(sql, [id_checklist_credenciamento, id_credenciamento], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, resultados });
                console.log(resultados);
            }
        });
    }

    listaDeInstrucoes(id_checklist_credenciamento, res) {
        
        const sql = `SELECT * FROM checklist_credenciamentoxinstrucoes 
        WHERE checklist_credenciamentoxinstrucoes.id_checklist = ?`;
    
        conexao.query(sql, [id_checklist_credenciamento], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, resultados });
            }
        });
    }

}

module.exports = new ChecklistCredenciamento;