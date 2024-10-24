const moment = require('moment');
const conexao = require('../infraestrutura/conexao');

class Setor {
    lista(id_setor, res) {
        const sql = `SELECT * FROM setores ORDER BY setores.nome`;
        conexao.query(sql, [id_setor], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, resultados });
            }
        });
    }

    listaDeTiposDeChamados(id, res) {
        const sql = `SELECT tipos_chamados.id, tipos_chamados.idSetor AS idSetorResponsavel, 
        tipos_chamados.nome, setores.nome AS setor_responsavel,
        DATE_FORMAT(tipos_chamados.dataHoraCriacao, "%d-%m-%Y %H:%i") AS dataHoraCriacao
        FROM tipos_chamados
        INNER JOIN setores ON setores.id = tipos_chamados.idSetor
        WHERE tipos_chamados.idSetor = ?
        ORDER BY tipos_chamados.nome`;

        conexao.query(sql, [id], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, resultados });
            }
        });
    }

    listaDeUsuarios(id, res) {
        const sql = `SELECT * FROM usuarios WHERE usuarios.id_setor = ?`;

        conexao.query(sql, [id], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, resultados });
            }
        });
    } 

    listaDeChamados(id_setor, id_usuario, tipo, filtro, id_permissao, res) { 
        let { id_chamado, idSetorResponsavel, idPrioridade, dataHoraFinalizacao, status, descricao } = filtro;

        descricao = descricao !== "" ? ` AND chamados.descricao LIKE '%${descricao}%'` : ``;
        id_chamado = parseInt(id_chamado) > 0 ? ` AND chamados.id = '${id_chamado}'` : "";
        idSetorResponsavel = parseInt(idSetorResponsavel) > 0 ? `AND chamados.idSetorResponsavel = '${idSetorResponsavel}' ` : "";
        idPrioridade = parseInt(idPrioridade) > 0 ? ` AND chamados.idPrioridade = '${idPrioridade}' ` : "";
        dataHoraFinalizacao = dataHoraFinalizacao !== "" ? ` AND DATE_FORMAT(chamados.dataHoraFinalizacao, "%Y-%m-%d") = '${moment(dataHoraFinalizacao).format('YYYY-MM-DD')}' ` : "";
        status = parseInt(status) > 0 ? ` AND status.id = '${status}' ` : "";
        let sql = ``;
        let where = ` `;
 
        switch (tipo) {
            case 0:
                sql = `SELECT distinct chamados.id, chamados.descricao, setores.nome AS setor_responsavel, chamados.idSetorResponsavel, tipos_chamados.id AS idTipoChamado,
                tipos_chamados.nome AS tipo_chamado, prioridades.id AS idPrioridade, prioridades.nome AS prioridade,
                chamados.visualizado, chamados.valor, 
                DATE_FORMAT(chamados.dataHoraCriacao, "%Y-%m-%d %H:%i") AS dataHoraCriacao,
                DATE_FORMAT(chamados.dataHoraFinalizacao, "%Y-%m-%d") AS dataHoraFinalizacao,
                DATE_FORMAT(chamados.dataHoraFinalizacao, "%d-%m-%Y") AS dataHoraFinalizacaoFormatado,
                status.id AS id_status, status.nome AS status, chamados.idResponsavel, chamados.idSolicitante,
                (SELECT GROUP_CONCAT(setores.nome) FROM chamadosxsetores
                INNER JOIN setores ON setores.id = chamadosxsetores.id_setor 
                WHERE chamadosxsetores.id_chamado = chamados.id) AS setoresParticipantes,
                (SELECT setores.nome FROM setores WHERE setores.id =
                    usuarios.id_setor) AS setorSolicitante, chamados.dataHoraAtualizacao
                FROM chamados
                INNER JOIN tipos_chamados ON tipos_chamados.id = chamados.idTipoChamado
                INNER JOIN usuarios ON chamados.idSolicitante = usuarios.id
                INNER JOIN prioridades ON prioridades.id = chamados.idPrioridade
                INNER JOIN setores ON setores.id = chamados.idSetorResponsavel
                INNER JOIN status ON status.id = chamados.status
                LEFT join chamadosxsetores on chamadosxsetores.id_chamado = chamados.id
                WHERE chamados.idSetorResponsavel = ${id_setor} AND chamados.idResponsavel = ${id_usuario}
                ${descricao} ${id_chamado} ${idSetorResponsavel} 
                ${idPrioridade} ${dataHoraFinalizacao} ${status} ORDER BY chamados.dataHoraAtualizacao DESC;`;
                break;
            case 1:
                sql = `SELECT distinct chamados.id, chamados.descricao, setores.nome AS setor_responsavel, chamados.idSetorResponsavel, tipos_chamados.id AS idTipoChamado,
                tipos_chamados.nome AS tipo_chamado, prioridades.id AS idPrioridade, prioridades.nome AS prioridade,
                chamados.visualizado, chamados.valor, 
                DATE_FORMAT(chamados.dataHoraCriacao, "%Y-%m-%d %H:%i") AS dataHoraCriacao,
                DATE_FORMAT(chamados.dataHoraFinalizacao, "%Y-%m-%d") AS dataHoraFinalizacao,
                status.id AS id_status, status.nome AS status, chamados.idResponsavel, chamados.idSolicitante,
                (SELECT GROUP_CONCAT(setores.nome) FROM chamadosxsetores
                INNER JOIN setores ON setores.id = chamadosxsetores.id_setor 
                WHERE chamadosxsetores.id_chamado = chamados.id) AS setoresParticipantes,
                (SELECT setores.nome FROM setores WHERE setores.id =
                    usuarios.id_setor) AS setorSolicitante,
                    DATE_FORMAT(chamados.dataHoraFinalizacao, "%d-%m-%Y") AS dataHoraFinalizacaoFormatado
                FROM chamados
                INNER JOIN tipos_chamados ON tipos_chamados.id = chamados.idTipoChamado
                INNER JOIN usuarios ON chamados.idSolicitante = usuarios.id
                INNER JOIN prioridades ON prioridades.id = chamados.idPrioridade
                INNER JOIN setores ON setores.id = chamados.idSetorResponsavel
                INNER JOIN status ON status.id = chamados.status
                LEFT join chamadosxsetores on chamadosxsetores.id_chamado = chamados.id
                WHERE usuarios.id_setor = ${id_setor} AND chamados.idSolicitante = ${id_usuario} ${descricao} ${id_chamado} ${idSetorResponsavel} 
                ${idPrioridade} ${dataHoraFinalizacao} ${status} ORDER BY chamados.dataHoraAtualizacao DESC;`;
                break; 
            case 2:
                sql = `SELECT distinct chamados.id, chamados.descricao, setores.nome AS setor_responsavel, chamados.idSetorResponsavel, tipos_chamados.id AS idTipoChamado,
                tipos_chamados.nome AS tipo_chamado, prioridades.id AS idPrioridade, prioridades.nome AS prioridade,
                chamados.visualizado, chamados.valor, 
                DATE_FORMAT(chamados.dataHoraCriacao, "%Y-%m-%d %H:%i") AS dataHoraCriacao,
                DATE_FORMAT(chamados.dataHoraFinalizacao, "%Y-%m-%d") AS dataHoraFinalizacao,
                status.id AS id_status, status.nome AS status, chamados.idResponsavel, chamados.idSolicitante,
                (SELECT GROUP_CONCAT(setores.nome) FROM chamadosxsetores
                INNER JOIN setores ON setores.id = chamadosxsetores.id_setor 
                WHERE chamadosxsetores.id_chamado = chamados.id) AS setoresParticipantes,
                (SELECT setores.nome FROM setores WHERE setores.id =
                    usuarios.id_setor) AS setorSolicitante,
                    DATE_FORMAT(chamados.dataHoraFinalizacao, "%d-%m-%Y") AS dataHoraFinalizacaoFormatado
                FROM chamados
                INNER JOIN tipos_chamados ON tipos_chamados.id = chamados.idTipoChamado
                INNER JOIN usuarios ON chamados.idSolicitante = usuarios.id
                INNER JOIN prioridades ON prioridades.id = chamados.idPrioridade
                INNER JOIN setores ON setores.id = chamados.idSetorResponsavel
                INNER JOIN status ON status.id = chamados.status
                LEFT join chamadosxsetores on chamadosxsetores.id_chamado = chamados.id
                WHERE chamados.idSetorResponsavel = ${id_setor} AND chamados.idResponsavel = 0
                ${descricao} ${id_chamado} ${idSetorResponsavel} 
                ${idPrioridade} ${dataHoraFinalizacao} ${status} ORDER BY chamados.dataHoraAtualizacao DESC;`;
                break;
            case 3:
                sql = `select distinct chamados.id, chamados.descricao, setores.nome AS setor_responsavel, chamados.idSetorResponsavel, tipos_chamados.id AS idTipoChamado,
                tipos_chamados.nome AS tipo_chamado, prioridades.id AS idPrioridade, prioridades.nome AS prioridade,
                chamados.visualizado, chamados.valor, 
                DATE_FORMAT(chamados.dataHoraCriacao, "%Y-%m-%d %H:%i") AS dataHoraCriacao,
                DATE_FORMAT(chamados.dataHoraFinalizacao, "%Y-%m-%d") AS dataHoraFinalizacao,
                status.id AS id_status, status.nome AS status, chamados.idResponsavel, chamados.idSolicitante,
                (SELECT GROUP_CONCAT(setores.nome) FROM chamadosxsetores
                INNER JOIN setores ON setores.id = chamadosxsetores.id_setor 
                WHERE chamadosxsetores.id_chamado = chamados.id) AS setoresParticipantes,
                (SELECT setores.nome FROM setores WHERE setores.id =
                    usuarios.id_setor) AS setorSolicitante, 
                    DATE_FORMAT(chamados.dataHoraFinalizacao, "%d-%m-%Y") AS dataHoraFinalizacaoFormatado
                FROM chamadosxsetores
                inner join chamados on chamados.id = chamadosxsetores.id_chamado
                INNER JOIN tipos_chamados ON tipos_chamados.id = chamados.idTipoChamado
                INNER JOIN usuarios ON chamados.idSolicitante = usuarios.id
                INNER JOIN prioridades ON prioridades.id = chamados.idPrioridade
                INNER JOIN setores ON setores.id = chamados.idSetorResponsavel
                INNER JOIN status ON status.id = chamados.status
                where chamadosxsetores.id_setor = ${id_setor}
                ORDER BY chamados.dataHoraAtualizacao DESC;`;
                break;
            case 4:
                sql = `SELECT distinct chamados.id, chamados.descricao, setores.nome AS setor_responsavel, chamados.idSetorResponsavel, tipos_chamados.id AS idTipoChamado,
                tipos_chamados.nome AS tipo_chamado, prioridades.id AS idPrioridade, prioridades.nome AS prioridade,
                chamados.visualizado, chamados.valor, 
                DATE_FORMAT(chamados.dataHoraCriacao, "%Y-%m-%d %H:%i") AS dataHoraCriacao,
                DATE_FORMAT(chamados.dataHoraFinalizacao, "%Y-%m-%d") AS dataHoraFinalizacao,
                status.id AS id_status, status.nome AS status, chamados.idResponsavel, chamados.idSolicitante,
                (SELECT GROUP_CONCAT(setores.nome) FROM chamadosxsetores
                INNER JOIN setores ON setores.id = chamadosxsetores.id_setor 
                WHERE chamadosxsetores.id_chamado = chamados.id) AS setoresParticipantes,
                (SELECT setores.nome FROM setores WHERE setores.id =
                    usuarios.id_setor) AS setorSolicitante,
                    DATE_FORMAT(chamados.dataHoraFinalizacao, "%d-%m-%Y %H:%i") AS dataHoraFinalizacaoFormatado
                FROM chamados
                INNER JOIN tipos_chamados ON tipos_chamados.id = chamados.idTipoChamado
                INNER JOIN usuarios ON chamados.idSolicitante = usuarios.id
                INNER JOIN prioridades ON prioridades.id = chamados.idPrioridade
                INNER JOIN setores ON setores.id = chamados.idSetorResponsavel
                INNER JOIN status ON status.id = chamados.status
                LEFT join chamadosxsetores on chamadosxsetores.id_chamado = chamados.id
                WHERE usuarios.id_setor = ${id_setor} ${descricao} ${id_chamado} ${idSetorResponsavel} 
                ${idPrioridade} ${dataHoraFinalizacao} ${status} ORDER BY chamados.dataHoraAtualizacao DESC;`;
                break;
            default:
                break;
        }
   
        conexao.query(sql, (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, resultados, id_setor, id_usuario, id_permissao });
            }
        });
    }
}

module.exports = new Setor;