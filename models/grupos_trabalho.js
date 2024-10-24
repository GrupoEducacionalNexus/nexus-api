const moment = require('moment');
const conexao = require('../infraestrutura/conexao');

class GrupoTrabalho {

    listaDeMembrosComSubmissaoNoGt(id_gt, res) {
        const sql = `SELECT u.id AS id_usuario, u.nome, u.email,
        IF(mxgt.tipo = 2, 'Submissão de Trabalho', '') AS tipo,
        axmxgt.id_gt,
        (SELECT gt.nome FROM grupos_trabalho gt WHERE gt.id = ?) AS gt,
        COUNT(DISTINCT axmxgt.id) AS qtd_anexos,
        (SELECT COUNT(axmxgt.id) FROM anexosxmembrosxgt axmxgt WHERE axmxgt.id_gt = ?) qtdTrabEnviados
      FROM
        membrosxgrupos_trabalho mxgt
      INNER JOIN
        anexosxmembrosxgt axmxgt ON axmxgt.id_usuario = mxgt.id_membro
      INNER JOIN
        usuarios u ON u.id = mxgt.id_membro
      INNER JOIN
        grupos_trabalho gt ON gt.id = mxgt.id_grupo_trabalho
      WHERE
        mxgt.tipo = 2 AND axmxgt.id_gt = ? AND gt.id_evento = 11
      GROUP BY
        u.id, u.nome, u.email, tipo, axmxgt.id_gt, gt
      ORDER BY
        MAX(axmxgt.id) DESC;`;

        conexao.query(sql, [id_gt, id_gt, id_gt], (erro, resultados) => {
            if(erro) {
                res.status(400).json({status: 400, msg: erro});
            } else {
                res.status(200).json({status: 200, resultados});
            }
        });
    }

    listaDeMembrosSemSubmissaoNoGt(id_gt, res) {
        const sql = `SELECT DISTINCT gt.id_evento, gt.id,
        u.id, u.nome, u.email,
        GROUP_CONCAT(DISTINCT IF(mxgt.tipo = 2, 'Submissão de Trabalho', 'Ouvinte')) AS tipo,
        (SELECT gt.nome FROM grupos_trabalho gt WHERE gt.id = ?) AS gt,
        (SELECT COUNT(axmxgt.id) FROM anexosxmembrosxgt axmxgt WHERE axmxgt.id_usuario = u.id) AS qtd_anexos
    FROM usuarios u
    INNER JOIN membrosxgrupos_trabalho mxgt ON u.id = mxgt.id_membro
    INNER JOIN grupos_trabalho gt ON gt.id = mxgt.id_grupo_trabalho
    WHERE gt.id_evento = 11 AND gt.id = ? AND NOT EXISTS (
            SELECT 1
            FROM anexosxmembrosxgt axmxgt
            WHERE axmxgt.id_usuario = u.id
                AND axmxgt.id_gt = ?
        )
    GROUP BY u.id, u.nome, u.email`;
        conexao.query(sql, [id_gt, id_gt, id_gt], (erro, resultados) => {
            if(erro) {
                res.status(400).json({status: 400, msg: erro});
            } else {
                res.status(200).json({status: 200, resultados});
            }
        });
    }
}

module.exports = new GrupoTrabalho;