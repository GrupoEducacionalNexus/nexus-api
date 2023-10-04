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
        status.id AS id_status, status.nome AS status 
        FROM credenciamento 
        inner join usuarios on usuarios.id = credenciamento.id_usuario 
        inner join estados on estados.id = credenciamento.id_estado 
        inner join instituicoes on instituicoes.id = credenciamento.id_instituicao 
        inner join status on status.id = credenciamento.status
        WHERE credenciamento.id_estado = ? ORDER BY credenciamento.id DESC`;

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