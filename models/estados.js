const moment = require('moment');
const conexao = require('../infraestrutura/conexao');

class Estado {
    
    lista(res) {
        const sql = `SELECT * FROM estados`;

        conexao.query(sql, (erro, resultados) => {
            if(erro) {
                res.status(400).json({status: 400, msg: erro});
            } else {
                res.status(200).json({status: 200, resultados});
            }
        });
    }

    listaDeCredenciamento(idEstado, res) {
        const sql = `SELECT usuarios.id AS id_usuario, usuarios.nome AS gestor, 
        usuarios.email, usuarios.telefone, usuarios.cpf_cnpj, usuarios.senha,
        instituicoes.id AS id_instituicao, instituicoes.cnpj, 
        instituicoes.nome_fantasia, instituicoes.razao_social,
        estados.id as id_estado, estados.nome AS estado, estados.sigla,
        credenciamento.id AS id_credenciamento, credenciamento.observacao, 
        status.id AS id_status, status.nome AS status,
        COUNT(DISTINCT documento_credenciamento.id_checklist_credenciamento) AS qtdDocEnviados,
        (SELECT COUNT(checklist_credenciamentoxestado.id_checklist) 
        FROM checklist_credenciamentoxestado 
        WHERE checklist_credenciamentoxestado.id_estado = credenciamento.id_estado) AS totDocDoEstado
        FROM credenciamento 
        inner join usuarios on usuarios.id = credenciamento.id_usuario 
        inner join estados on estados.id = credenciamento.id_estado 
        inner join instituicoes on instituicoes.id = credenciamento.id_instituicao 
        inner join status on status.id = credenciamento.status
        LEFT JOIN documento_credenciamento ON documento_credenciamento.id_credenciamento = 
        credenciamento.id
        WHERE credenciamento.id_estado = ?
        GROUP BY usuarios.id, usuarios.nome, 
        usuarios.email, usuarios.telefone, usuarios.cpf_cnpj, usuarios.senha,
        instituicoes.id, instituicoes.cnpj, 
        instituicoes.nome_fantasia, instituicoes.razao_social,
        estados.id, estados.nome, estados.sigla,
        credenciamento.id, credenciamento.observacao, 
        status.id, status.nome
        ORDER BY credenciamento.id DESC`;

        conexao.query(sql, [idEstado], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, resultados });
            }
        });
    }


    listaDeChecklistDoCredenciamento(idEstado, res) {
        const sql = `SELECT checklist_credenciamentoxestado.id, checklist_credenciamentoxestado.id_checklist,
        checklist_credenciamentoxestado.id_estado, checklist_credenciamento.nome
        FROM checklist_credenciamentoxestado
        INNER JOIN checklist_credenciamento on checklist_credenciamento.id = checklist_credenciamentoxestado.id_checklist
        WHERE checklist_credenciamentoxestado.id_estado = ? ORDER BY checklist_credenciamentoxestado.id DESC`;

        conexao.query(sql, [idEstado], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, resultados });
            }
        });
    }

    
}

module.exports = new Estado;